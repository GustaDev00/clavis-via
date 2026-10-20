/**
 * Shader da aurora: gradiente orgânico com "domain warping" (ruído deformando ruído),
 * como nos fundos fluidos de sites premiados. Quatro cores da paleta, misturadas devagar.
 * GLSL ES 1.0 (WebGL1) para funcionar no maior número de celulares.
 */

export const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uPointer;
uniform float uBreath;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.02 + vec2(1.7, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  p += uPointer * 0.06;

  float t = uTime * 0.035;
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t)), fbm(p * 1.1 + vec2(5.2, -t * 0.8)));
  vec2 r = vec2(fbm(p * 1.3 + 1.7 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p * 1.3 + 1.7 * q + vec2(8.3, 2.8) - t * 0.5));
  float n = fbm(p * 1.4 + 1.6 * r);

  // Mistura das quatro cores da paleta guiada pelo ruído deformado
  vec3 color = mix(uColor0, uColor1, smoothstep(0.25, 0.75, n));
  color = mix(color, uColor2, smoothstep(0.3, 0.85, r.x));
  color = mix(color, uColor3, smoothstep(0.4, 0.95, q.y) * 0.8);

  // Clareia só onde o ruído é alto (manchas de luz), mantendo as cores vivas no resto.
  // A "respiração" (prática guiada) sobe a luminosidade do conjunto.
  float light = smoothstep(0.55, 0.95, fbm(p * 0.9 - r + t * 0.3));
  vec3 base = vec3(0.985, 0.988, 0.996);
  color = mix(color, base, 0.22 + light * 0.45 + uBreath * 0.2);

  // Dithering: elimina "faixas" de cor em gradientes suaves
  color += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 128.0;

  gl_FragColor = vec4(color, 1.0);
}
`;
