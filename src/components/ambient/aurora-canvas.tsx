"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./aurora-shader";
import { AMBIENT_PALETTES, hexToRgb, type AmbientTone } from "./palettes";

const FRAME_MS = 1000 / 30; // 30 fps bastam para um movimento tão lento
const COLOR_EASE_SECONDS = 0.9;

/**
 * Canvas WebGL em tela cheia atrás do app.
 * - Resolução reduzida (0,4× dos pixels CSS) e 30 fps: barato até em celulares intermediários.
 * - Pausa quando a aba fica oculta; com "reduzir movimento" o tempo para (só as cores transitam).
 * - Sem WebGL (ou se o contexto cair), o fundo em CSS que já existe por baixo continua visível.
 */
export function AuroraCanvas({
  toneRef,
  breathRef,
}: {
  toneRef: RefObject<AmbientTone>;
  breathRef: RefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Aparelhos fracos ou economia de dados: fica só o fundo CSS
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || ((nav.hardwareConcurrency ?? 8) <= 4 && (nav.deviceMemory ?? 4) <= 2)) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;
    gl.useProgram(program);

    // Um triângulo que cobre a tela inteira
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uResolution = uniform("uResolution");
    const uTime = uniform("uTime");
    const uColors = [uniform("uColor0"), uniform("uColor1"), uniform("uColor2"), uniform("uColor3")];
    const uPointer = uniform("uPointer");
    const uBreath = uniform("uBreath");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    const colors = AMBIENT_PALETTES[toneRef.current].map(hexToRgb);
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let breath = 0;
    let frame = 0;
    let last = 0;
    let elapsed = Math.random() * 60;
    let firstFrame = true;

    const resize = () => {
      // ~0,4× dos pixels CSS, sem DPR: poucos pixels na GPU e a ampliação do compositor suaviza
      const scale = 0.4;
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (event.clientY / window.innerHeight - 0.5) * -2;
    };
    // No celular, o scroll desloca a aurora de leve (parallax)
    const onScroll = () => {
      if (finePointer.matches) return;
      pointer.targetY = Math.min(1, window.scrollY / 1200);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return;
      const delta = now - last;
      if (delta < FRAME_MS && !firstFrame) return;
      last = now;
      const dt = Math.min(delta, 100) / 1000;

      if (!reduceMotion.matches) elapsed += dt;

      // Aproxima cores, ponteiro e respiração dos alvos (suavização exponencial)
      const target = AMBIENT_PALETTES[toneRef.current].map(hexToRgb);
      const k = firstFrame ? 1 : 1 - Math.exp(-dt / COLOR_EASE_SECONDS);
      colors.forEach((color, index) => {
        for (let channel = 0; channel < 3; channel++) {
          color[channel] += (target[index][channel] - color[channel]) * k;
        }
      });
      const kp = 1 - Math.exp(-dt / 0.8);
      pointer.x += (pointer.targetX - pointer.x) * kp;
      pointer.y += (pointer.targetY - pointer.y) * kp;
      breath += ((breathRef.current ?? 0) - breath) * (1 - Math.exp(-dt / 0.25));

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      uColors.forEach((location, index) => gl.uniform3fv(location, colors[index]));
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uBreath, breath);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
    };
    frame = requestAnimationFrame(render);

    // Contexto perdido (GPU sob pressão): o canvas some com fade e o fundo CSS por baixo
    // assume. Não tentamos recriar: numa demo, o fallback estático é preferível a um ciclo de perdas.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      setReady(false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      // Libera só os recursos: perder o contexto quebraria a remontagem do efeito (StrictMode/HMR)
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [toneRef, breathRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh w-full opacity-0 transition-opacity duration-[1400ms] ease-out-soft",
        ready && "opacity-100",
      )}
    />
  );
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("[aurora] shader:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("[aurora] program:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}
