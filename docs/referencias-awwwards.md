# CLAVIS VIA: pesquisa Awwwards de fundos, efeitos e tipografia

Data: 20/10/2026 · Escopo: mobile-first, PT-BR, Next.js 16 + React 19 + Tailwind v4 + GSAP 3.15 + Motion

## Como esta pesquisa foi feita

1. **Listas no awwwards.com.** Abri e li: *Sites of the Month* (página 1, de mar/2024 a set/2026), *Sites of the Day* (página 1, de set a out/2026), a categoria *Health & Beauty*, as buscas "wellness" e "meditation", a coleção *Pastel colors* (Mixallo), a tag *gradient* e as páginas de inspiração *Interactive background (FORMLESS)*, *Grainy Shader (Meet Your Legend)* e *Grainient v2* (HM, 30/07/2026). Também abri a página individual de cada site citado, com prêmio, data, tags e cores.
2. **Sites ao vivo no navegador.** Abri cada site e rolei a página. As descrições marcadas como "**Visto**" vêm do que apareceu na tela. Não aceitei cookies e não preenchi nenhum formulário.
3. **Código público.** Baixei o HTML, o CSS e o JS de cada site. As fontes foram lidas das declarações `font-family` e `@font-face` e dos nomes dos arquivos `.woff2`. As técnicas foram identificadas por palavras-chave no código: `feTurbulence`, `mix-blend-mode`, `backdrop-filter`, `@property`, `gl_FragColor`, `fbm` e trechos de shader.
4. **Teste de fontes.** Montei uma página de amostra com as candidatas do Google Fonts, renderizei e conferi os acentos e os numerais "1 / I / l" (arquivo `scratchpad/fonttest.html`). As metainformações do Google Fonts (subsets, eixos e estilos) vieram de `fonts.google.com/metadata/fonts`.

O que não consegui ver:
- **Cleo AI** (SOTD 23/05/2026): bloqueado pelo bot check da Cloudflare, ignorado.
- **David Whyte Experience** e **The Tie-break**: ficaram presos no loader do WebGL no painel do navegador. A descrição deles vem do código, e isso está indicado em cada caso.
- **FORMLESS**: só renderizou a parte escura, sem o gradiente interativo. Ficou fora da lista.

---

## A. Fundos e efeitos: 12 referências reais

### Resumo

| # | Site | Prêmio (data) | Técnica principal vista | O que roubar |
|---|---|---|---|---|
| 1 | Sleep Well Creative | **SOTD** 28/01/2026 (8.03) | Papel creme com grão em todas as superfícies; transição em "horizonte" curvo | Grão global + transição em arco |
| 2 | Vibrant Wellness | **SOTD** + Dev 20/02/2026 | Gradiente líquido "seda" azul/lavanda/rosa com bolhas | Camada ambiente "seda" |
| 3 | Bevel Health | **HM** 11/05/2026 | Céu suave + faixa espectral iridescente no horizonte + pílula de vidro | Faixa de luz tingida pela emoção |
| 4 | iyO | **SOTD** + Dev 02/04/2026 | Luz feita de pontilhado/grão que muda de forma no scroll | Orb de respiração "granulado" |
| 5 | Heron AI | **SOTD** 12/10/2026 | Papel com ruído `feTurbulence` + `multiply`; moldura com linhas finas e cruzetas | Receita de grão + moldura da Jornada |
| 6 | Antara Spa Wellness | **HM** 07/02/2025 | Painel em arco que sobe sobre o hero; Fraunces + Manrope | Arco "fechadura" + prova de par tipográfico |
| 7 | Méline Gobet (kinesióloga) | **HM** 20/06/2026 | Creme quente, bordas curvas, flores em aquarela desfocadas nas bordas | Profundidade de campo em vez de blobs |
| 8 | Slow Down Creative | **HM** 01/06/2026 | Um único orb quente atrás do título; sans + serif itálica misturadas | Um orb só + ênfase em itálico |
| 9 | Odyssée | **SOTD** + Dev 08/10/2026 | Navy #1E305E + creme #F6F4F2; calma feita só de tipografia e espaço | Contenção editorial, contadores "1 : 4" |
| 10 | David Whyte Experience | **SOTM** dez/2024 | Shader de névoa com foco/desfoque guiado pelo mouse (lido no código) | Revelação "névoa que se abre" |
| 11 | Oryzo AI (Lusion) | **SOTM** abr/2026 | 3D hiper-real; deriva de câmera por fbm (movimento browniano) | Movimento ocioso orgânico |
| 12 | Why Zero | **SOTM** set/2026 | Luz radial vinda de baixo; transições em "papel queimando" com fbm | Dissolve por limiar de ruído |

### Detalhes

#### 1. Sleep Well Creative: https://sleep-well-creatives.com/
- **Prêmio:** Site of the Day, 28/01/2026, nota 8.03 (a mais alta deste conjunto). Dev score 7.42, com 9.0 em animação. Autor: Victor Work. Cores no Awwwards: #0042AF e #FEF1D0.
- **Visto:** Fundo creme #FEF1D0 com **grão de papel visível em toda a página, inclusive sobre o azul-marinho**. O loader é uma lua dentro de uma moldura em arco, como uma escotilha. As seções trocam de cor por um **grande arco de horizonte**: o creme dá lugar ao navy, com um contorno de linha fina acompanhando a curva. Os títulos usam uma serif editorial condensada e enorme. Há um timer "08h00" dentro de um anel com nuvens em aquarela.
- **Fontes (CSS):** `Editorial` (PP Editorial New) + `NM` (PP Neue Montreal). As duas são pagas.
- **Técnica (código):** three.js (`dithering_fragment`, `uTime`), GSAP ScrollTrigger, Lenis, overlay de noise, `mix-blend-mode: luminosity`.
- **Roubar:** a camada de grão por cima de tudo e o arco como transição de seção. Na nossa marca, o arco remete à fechadura. A paleta de duas cores (navy + claro) também é quase a nossa.

#### 2. Vibrant Wellness: https://vibrant.noomoagency.com/
- **Prêmio:** Site of the Day + Developer Award, 20/02/2026 (7.31). Feito pela Noomo Agency. Cores: #8EBEF9 e #0774C4.
- **Visto:** Fundo de tela cheia em **gradiente líquido tipo seda**, em azul, lavanda e rosa-claro (praticamente a nossa paleta), fluindo devagar. Sobre ele flutuam **bolhas translúcidas pequenas e esparsas**. No centro há um corpo 3D cromado iridescente. O toggle Feminino/Masculino é uma pílula de vidro, e o CTA "Start Experience" é uma pílula branca com halo luminoso.
- **Fontes:** só aparecem variáveis (`--font-sans`, `--font-mono`). Não identifiquei a família.
- **Técnica (código):** three.js + GSAP ScrollTrigger, `backdrop-filter` (26 ocorrências), `@property` (56), `filter: blur(12–20px)`, `visibilitychange` (o site pausa quando a aba fica oculta).
- **Roubar:** **esta é a nossa camada ambiente**, mas em versão barata: shader 2D próprio em vez de three.js (ver A2). Vale também copiar as 15 a 25 bolhas esparsas e o CTA com halo.

#### 3. Bevel Health: https://www.bevel.health/
- **Prêmio:** Honorable Mention, 11/05/2026 (NOOON e equipe). Tags: Mobile & Apps, App Style, Colorful.
- **Visto:** O hero tem céu claro com nuvens suaves e uma **faixa espectral iridescente na linha do horizonte**, um arco-íris desfocado atrás do celular e do relógio. A navegação é uma pílula de vidro e o restante da página é branco limpo.
- **Fontes (CSS):** `Archivo` (Google Fonts) + `Graphik` + SF Pro via variável.
- **Técnica (código):** Webflow + GSAP ScrollTrigger + Lenis, `radial-gradient` (17), `backdrop-filter` (12), **`prefers-reduced-motion` (13 ocorrências)**, grain.
- **Roubar:** a **faixa de luz no horizonte** para a tela Hoje, tingida pela emoção do dia. Também o cuidado consistente com `reduced-motion`.

#### 4. iyO: https://www.iyo.ai/
- **Prêmio:** Site of the Day + Developer Award, 02/04/2026 (Matteo Donini). Está na coleção *Pastel colors*.
- **Visto:** Fundo escuro com uma **luz feita de pontilhado/grão**, uma nuvem de partículas, que no scroll se expande numa grande forma de cruz arredondada. Por cima flutua uma pílula de vidro com o menu.
- **Fontes (CSS):** Roobert, Magnetik, NB Architekt Pro Neue (todas pagas).
- **Técnica (CSS):** `filter: blur(40px)` (11), `backdrop-filter` (34), `radial-gradient` (12), `mix-blend-mode: lighten`.
- **Roubar:** um **orb de respiração "granulado"**: um halo que se forma com pontilhado em vez de um blur liso. No tema claro, use pontos navy em baixa opacidade, ou pontos brancos sobre a seda.

#### 5. Heron AI: https://heronaiapp.com/
- **Prêmio:** Site of the Day, 12/10/2026 (Bearplus).
- **Visto:** Papel off-white com grão fino. Um desenho técnico em linha "revela" uma ilustração gravada e pontilhada no scroll. A página tem **moldura de linhas finas com cruzetas nos cantos**, micro-rótulos em fonte mono e uma linha vermelha de acento.
- **Fontes (CSS):** `BT Grotesk` + `Geist Mono` (Geist Mono está no Google Fonts).
- **Técnica (CSS):** **`feTurbulence` (14) + `mix-blend-mode: multiply` (32)**, noise (21).
- **Roubar:** a receita de grão com SVG `feTurbulence` e `multiply` (ver A3) e a **moldura de linhas finas com ticks** para a tela Jornada, como um mapa.

#### 6. Antara Spa Wellness: https://antaraspawellness.com/
- **Prêmio:** Honorable Mention, 07/02/2025 (bikebear).
- **Visto:** Hero escuro com vídeo de vela e "A n t a r A" em serif leve com espaçamento enorme. No scroll, **um painel verde com topo em arco sobe sobre o hero**, com título em itálico caixa-alta.
- **Fontes (CSS):** **`Fraunces` + `Manrope`**, ambas Google Fonts. É exatamente o nosso corpo de texto atual.
- **Roubar:** o **painel em arco que sobe**, que vira a nossa "fechadura" na Entrada. É também a prova, num site premiado, de que Fraunces + Manrope funciona em wellness.

#### 7. Méline Gobet, kinesióloga: https://www.melinegobet.fr/
- **Prêmio:** Honorable Mention, 20/06/2026 (Jaeco). É o domínio mais próximo do nosso: "libération émotionnelle & bien-être".
- **Visto:** Creme quente com **bordas laterais curvas**, que funcionam como moldura suave. Tem um beija-flor em traço fino, título em serif display e **flores em aquarela desfocadas entrando pelas bordas**, um efeito de profundidade de campo. Assinaturas em fonte script.
- **Fontes (CSS):** `Lato` (Google) + "Elegant" (display custom) + "Feminous Script".
- **Roubar:** **elementos desfocados em primeiro plano, nas bordas**, no lugar de blobs genéricos no meio da tela. É isso que dá profundidade sem ruído visual. Exemplo para nós: uma chave grande e desfocada saindo pela borda.

#### 8. Slow Down Creative: https://www.slowdowncreative.com/
- **Prêmio:** Honorable Mention, 01/06/2026.
- **Visto:** Fundo creme com **um único orb quente e desfocado atrás do título**. O título mistura uma sans leve com palavras em **serif itálica** ("*branding*", "*graphic design*", "*for a better world*").
- **Fontes (CSS):** `Matter` (paga) + `Montserrat`. A família da serif itálica não ficou clara no CSS.
- **Técnica (CSS):** `filter: blur(50px / 80px / 100px)` e `radial-gradient`. É a técnica atual do nosso app, mas usada com intenção.
- **Roubar:** **um orb só, atrás do título**, em vez de vários espalhados. E a ênfase de palavras emocionais em itálico, por exemplo "Seu caminho de volta *para si*".

#### 9. Odyssée (clínica de estética): https://www.odysseeclinic.com.au/
- **Prêmio:** Site of the Day + Dev Award, 08/10/2026 (NIGHTJAR). Cores no Awwwards: **#1E305E** (quase o nosso #182F58) e #F6F4F2. Tags: Luxury, Clean, Minimal, Microinteractions, GSAP, Next.js, Sanity.
- **Visto:** O hero é um vídeo que não carregou no painel e aparece cinza com "ODYSSÉE" em serif fina. Depois vem um creme quente com um **parágrafo-manifesto grande em grotesk e recuo na primeira linha**, micro-rótulos em caixa-alta, contador "1 : 4" e divisórias finas. **Não há fundo decorativo nenhum**: a calma vem só de tipografia e espaço.
- **Fontes (CSS):** `baselGrotesk` + `psTimes` (pagas). Os equivalentes gratuitos estão na parte B.
- **Técnica (CSS/JS):** `@property` (69), `backdrop-filter`, GSAP ScrollTrigger, Lenis.
- **Roubar:** contenção: telas de conteúdo (Plano, Detalhe) com fundo quase parado, contadores "1 : 4" nos passos do plano e manifesto com recuo.

#### 10. David Whyte Experience: https://davidwhyte.com/experience/
- **Prêmio:** Site of the Month, dez/2024 (Immersive Garden).
- **Não vi ao vivo:** o loader travou no painel, um sintoma de WebGL pesado. Pelo código: shader three.js com **névoa** (`vFogDepth`, `uFogState`), textura de ruído (`uNoise`) e intervalos de **desfoque e alpha controlados pelo mouse** (`uMouseNoiseInputRange`, `uBlurOutputRange`). As imagens poéticas emergem da névoa conforme o ponteiro se aproxima.
- **Fontes (CSS):** `Canela Text` + `Roobert` (pagas).
- **Roubar:** a revelação "**névoa que se abre**": conteúdo que sai do desfoque para o foco, um bom ritual para a mensagem do dia. É também um aviso: WebGL pesado demais trava em celular.

#### 11. Oryzo AI: https://oryzo.ai/
- **Prêmio:** Site of the Month, abr/2026 (Lusion).
- **Visto:** Loader verde-oliva com grade de linhas finas e uma cruzeta laranja, depois um porta-copos de cortiça 3D hiper-real sobre uma base de corte. O clima não é o nosso.
- **Fontes (CSS):** **`Literata` + `DM Mono`**, ambas Google Fonts.
- **Técnica (código):** classe `BrownianMotion` com `_fbm(...)`: a câmera deriva com ruído fractal em vez de senos. Tem também `dithering`, `visibilitychange` e controle de `devicePixelRatio`.
- **Roubar:** **movimento ocioso por fbm**. A chave e o orb "flutuam" de forma orgânica e não periódica, o que transmite muito mais calma que um `yoyo` de seno.

#### 12. Why Zero: https://why.zero.university/
- **Prêmio:** Site of the Month, set/2026 (Sindhur Dutta).
- **Visto:** Verde profundo com luz radial subindo da base, depois uma textura de água e gelo cáustico.
- **Fontes (CSS):** **`Newsreader`, `Inter`, `Google Sans Flex`, `Google Sans Code`** (todas Google), mais PP Supply Mono e Caveat.
- **Técnica (shader lido):** `hash` + `vnoise` + `fbm` de 3 oitavas com rotação `mat2(0.8,0.6,-0.6,0.8)`. Um limiar animado (`uBurnProgress`) dissolve a imagem como **papel queimando**.
- **Roubar:** o mesmo fbm leve de 3 oitavas, que é a base do nosso shader, e um **dissolve por limiar de ruído** entre telas. No nosso caso seria uma "névoa", não fogo.

**Menções rápidas:**
- **Son Daven** (SOTM jun/2026): loader com ovelha e letreiro rasterizados em linhas verticais, `feTurbulence` + `soft-light`. Boa ideia de textura, mas é rústico demais para nós.
- **The Tie-break** (SOTD 25/09/2026, Merci Michel): não carregou além do loader, mas o CSS usa **`InstrumentSerif-Italic` + `WorkSans`**.
- **Grainient v2** (HM 30/07/2026): uma ferramenta de gradientes granulados e shaders que serve para prototipar paletas.

### A1. Padrões que se repetem nos premiados de 2025–2026

1. **Grão por cima de tudo.** Aparece em Sleep Well, Heron, Bevel e Son Daven. É o que mais tira a sensação de "seco": quebra o plástico digital e **elimina o banding** dos gradientes pastel em telas de 8 bits.
2. **Uma fonte de luz, não várias.** Slow Down e Bevel usam um orb ou uma faixa de horizonte. Blobs espalhados (o nosso estado atual) parecem genéricos.
3. **Formas arquitetônicas suaves:** arco, horizonte curvo, escotilha (Sleep Well, Antara, Méline). Para uma marca cuja chave é o símbolo, o **arco ou fechadura** é natural.
4. **Vidro com parcimônia.** Os sites usam uma pílula de navegação e um CTA, não telas inteiras de glassmorphism.
5. **Movimento lento e orgânico.** O fbm e a deriva browniana (Oryzo, Why Zero) substituem as animações em loop.
6. **Cuidado técnico.** `visibilitychange` e `prefers-reduced-motion` aparecem em quase todos os bundles: Bevel, Vibrant, Oryzo, Why Zero, Heron.

---

### A2. Sistema de fundo recomendado: "Seda + Grão + Luz"

São três camadas fixas atrás do conteúdo, todas controladas por variáveis CSS e uniforms:

```
z-index -3  <canvas class="ambient">   seda WebGL (ou fallback CSS)
z-index -2  <div class="light">        uma luz: orb ou horizonte (CSS, transform/opacity)
z-index -1  <div class="grain">        grão estático (PNG/WebP ou SVG feTurbulence)
            conteúdo (cards brancos 72–80%, no máximo 2 superfícies de vidro reais)
```

#### (1) Camada ambiente global: shader de seda em resolução reduzida

**Por que não usar só CSS animado:** animar `@property` dentro de `radial-gradient` força um repaint da camada inteira a cada frame na thread principal. Em celular médio isso costuma sair **mais caro** que um shader minúsculo em baixa resolução, que roda na GPU e só é ampliado pelo compositor. Já o CSS **estático** é ótimo como primeira pintura e como fallback.

**Como implementar:**
- **WebGL1 puro, sem three.js:** um triângulo cobrindo a tela e um fragment shader de cerca de 40 linhas, com uns 3–4 KB de código próprio. Para ter uma API pronta, use **OGL**, que é bem mais leve que three.js. O three.js só se justifica se houver 3D de verdade.
- **Resolução:** `canvas.width = innerWidth * 0.33`, sem multiplicar por DPR. Num iPhone ou Android de 390×844 CSS isso dá cerca de 130×280, ~36 mil pixels. O CSS estica o canvas para `100vw/100dvh` e o filtro bilinear do navegador faz o resto: **o desfoque sai de graça**.
- **Taxa:** limite de **30 fps** (24 é suficiente, porque o movimento é muito lento). Use `requestAnimationFrame` com acumulador.
- **Pausas:** pause em `document.hidden`, quando a rota não usa a camada ambiente, com `prefers-reduced-motion: reduce` (renderiza 1 frame e para), com `Save-Data` ativo e em aparelhos fracos (`hardwareConcurrency <= 4 && (deviceMemory ?? 4) <= 2`, que vai para o modo CSS).
- **Primeira pintura:** o fallback CSS, com as mesmas cores, aparece no SSR. O canvas entra com fade-in de 600 ms depois de `requestIdleCallback`, sem flash e sem impacto no LCP.
- **Banding:** o grão em resolução cheia (camada -1) resolve. O dithering dentro do shader de baixa resolução não basta, porque some na ampliação.

**Fragment shader (esboço):**

```glsl
precision mediump float;
uniform vec2  uRes;
uniform float uTime;
uniform vec3  uC0, uC1, uC2, uC3;  // #F7F8FC, #E3ECF8, #ECE7F8, #FBE6EC (em linear ou sRGB, consistente)
uniform vec3  uTint;               // cor da emoção atual
uniform float uTintAmt;            // 0..1
uniform float uBreath;             // 0..1 (respiração)
uniform vec2  uPointer;            // -1..1, suavizado no JS (lerp 0.05)
varying vec2  vUv;

float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0., a = .5; mat2 r = mat2(.8,.6,-.6,.8);
  for (int i = 0; i < 3; i++){ v += a * vnoise(p); p = r * p * 2.; a *= .5; } return v; }   // mesmo fbm do Why Zero

void main(){
  vec2 p = (vUv - .5) * vec2(uRes.x / uRes.y, 1.);
  float t = uTime * .025;                               // MUITO lento: calma
  vec2 q = vec2(fbm(p*1.1 + t), fbm(p*1.1 - t + 4.7));  // domain warp = "seda"
  float n = fbm(p*1.0 + q*1.7 + uPointer*.12);
  vec3 col = mix(uC0, uC1, smoothstep(.25, .85, n));    // base branco -> azul
  col = mix(col, uC2, smoothstep(.45, .95, q.x) * .9);  // lavanda
  col = mix(col, uC3, smoothstep(.55, 1.0, q.y) * .6);  // rosa, sempre minoritário
  col = mix(col, uTint, uTintAmt * .35 * n);            // tinta da emoção, modulada pelo ruído (não chapada)
  float d = length(p - vec2(0., .06));                  // luz central que respira
  col = mix(col, vec3(1.), (1. - smoothstep(0., .5 + .1*uBreath, d)) * (.18 + .14*uBreath));
  gl_FragColor = vec4(col, 1.);
}
```

**Loop JS (esboço), com uniforms animados pelo GSAP:**

```ts
const state = { tint: [0.78,0.73,0.93], tintAmt: 0, breath: 0, px: 0, py: 0 };
const FRAME = 1000 / 30; let last = 0, raf = 0;
const loop = (now: number) => {
  raf = requestAnimationFrame(loop);
  if (now - last < FRAME) return; last = now;
  gl.uniform1f(uTime, now / 1000);
  gl.uniform3fv(uTint, state.tint); gl.uniform1f(uTintAmt, state.tintAmt); gl.uniform1f(uBreath, state.breath);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(loop); });
// Trocar emoção: gsap.to(state, { tintAmt: 1, tint: hexToRgb(emotion), duration: 1.4, ease: 'sine.inOut' })
```

Coloque o canvas num `AmbientProvider` client-side no layout raiz, com um único contexto WebGL para o app inteiro. As telas falam com ele por um store (Zustand ou contexto) passando `{ tint, tintAmt, breath, mode }`. Não crie um contexto por tela, porque o iOS limita contextos e cada criação custa.

**Fallback CSS** (primeira pintura, reduced-motion e aparelhos fracos):

```css
:root{ --c0:#F7F8FC; --c1:#E3ECF8; --c2:#ECE7F8; --c3:#FBE6EC; --emotion:#C6B9EC; --emotion-amt:0%; }
.ambient-fallback{
  position:fixed; inset:0; z-index:-3;
  background:
    radial-gradient(60% 42% at 18% 12%, var(--c1), transparent 70%),
    radial-gradient(55% 40% at 88% 28%, var(--c2), transparent 70%),
    radial-gradient(75% 45% at 50% 105%, var(--c3), transparent 70%),
    radial-gradient(45% 32% at 50% 42%, color-mix(in oklab, var(--emotion) var(--emotion-amt), transparent), transparent 72%),
    var(--c0);
  transition: --emotion-amt 1.2s ease; /* registre --emotion-amt com @property <percentage> */
}
```

Para ter movimento no fallback sem repaint, use 2 ou 3 divs com `radial-gradient` **sem `filter: blur`**, movidas só com `transform` e `opacity` (compositor). Os blobs atuais com `filter: blur()` grande devem sair: são a opção mais cara e a mais "genérica".

#### (2) Grão e textura: receita

- **Fonte do grão:** gere **uma vez** um tile WebP/PNG de 256×256 com `feTurbulence`. Se preferir, use direto como data-URI SVG em `background-image`, que é rasterizado uma vez por tamanho. **Não** aplique `filter: url(#noise)` num elemento grande: o Safari re-rasteriza no scroll.

```html
<!-- noise.svg, ou exportar para noise.webp 256px -->
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>
```

```css
.grain{ position:fixed; inset:-50%; z-index:-1; pointer-events:none;
  background:url(/textures/noise.webp) repeat; background-size:256px;   /* 1:1 em DPR 2: tamanho CSS 128px se quiser grão mais fino */
  opacity:.07; mix-blend-mode:multiply; }                                /* fundos claros: .06–.09 multiply */
.surface-navy .grain-local{ opacity:.12; mix-blend-mode:soft-light; }    /* sobre navy #182F58 */
```

- **Opacidade:** 0,06–0,09 em `multiply` sobre fundos claros (padrão Heron AI). Em superfícies navy, 0,10–0,14 em `soft-light`. Sobre os cards brancos, aplique um grão local mais fraco (0,03–0,04) para eles não ficarem plásticos.
- **Sem animação.** Grão parado é calmo. No máximo, um jitter de 2 passos a 6 fps só no hero da Entrada, e desligado com reduced-motion.

#### (3) Ideias por tela

**Entrada (hero)**
- Seda com intensidade cheia e **uma luz** atrás da chave (Slow Down).
- A chave fica dentro de um **arco em forma de fechadura** (Antara, Sleep Well), em vidro: `backdrop-filter: blur(14px)`, branco a 45% e borda de 1px branca a 60%. É a única superfície de vidro da tela.
- **Light sweep** uma única vez sobre a chave ao carregar (GSAP): uma máscara `linear-gradient` atravessa 110° em 1,6 s e não se repete.
- Título no novo display, com ênfase em itálico: "Seu caminho de volta *para si*".
- No scroll ou ao focar o input, o arco **sobe** como o painel da Antara e vira o card do formulário (Motion `layout`).
- Movimento ocioso da chave com fbm (Oryzo): ±4px e ±1,5°, em ciclo não periódico.

**Check-in (fundo segue a emoção escolhida)**
- Ao tocar numa emoção, `gsap.to(state, { tint, tintAmt: 1, duration: 1.4, ease: 'sine.inOut' })`.
- A tinta é **modulada pelo ruído** (`* n` no shader), então o fundo ganha veios da cor em vez de virar uma cor chapada.
- Os chips usam `--emotion` em `color-mix(in oklab, var(--emotion) 18%, white)`.
- Ao confirmar, uma onda suave: um anel radial de luz se expande a partir do chip (CSS `scale` + `opacity`, 900 ms).
- Mantenha `tintAmt` no máximo em 0,35 para a cor nunca gritar.

**Hoje (tingido pela emoção de hoje)**
- `tintAmt` fixo em ~0,5 da emoção registrada, já presente no primeiro paint via `--emotion` no SSR.
- **Faixa de horizonte** no topo, no estilo Bevel: uma faixa de 120px com `linear-gradient` horizontal da emoção para lavanda e azul, `filter: blur` só nela (é pequena) e grão por cima.
- O conteúdo usa a contenção do Odyssée: cards brancos a 80%, sem vidro.

**Prática de respiração (o fundo respira com o orb)**
- Uma única timeline GSAP controla três coisas: o orb (`scale` 0.85→1.15), `state.breath` (0→1→0) e a opacidade do texto "Inspire/Expire".
- O fundo varia só ±6% de luminância e o raio da luz central em +0,1. **Sutil de propósito.**
- O ponteiro e o scroll ficam desligados durante a prática. O resto da UI recua para opacidade 0,4.
- O orb pode ser "granulado" (iyO): um halo de pontilhado via shader ou SVG com `feTurbulence` + máscara radial. Opcional.
- Com reduced-motion: o orb não escala, e só o anel de progresso e o texto mudam.

**Planos: lista e detalhe (capas)**
- **Capas generativas:** cada plano tem `seed` e duas cores da paleta. O **mesmo shader** é renderizado **uma vez** num canvas offscreen de 320×200, exportado com `toBlob` e cacheado em memória ou IndexedDB. Resultado: custo zero no scroll e capas únicas, mas da mesma família.
- Recorte da capa em **arco/fechadura** com `mask-image` e grão por cima.
- Fallback das capas: 3 `radial-gradient` deterministas a partir do seed.
- Detalhe: transição de elemento compartilhado com Motion `layoutId`, em que a capa cresce e vira o header. No topo, contador "1 : 4" e passos com divisórias finas (Odyssée).

**Jornada**
- **Moldura de linhas finas com ticks e cruzetas** (Heron AI), como um mapa do caminho.
- Os dias são pontos na cor da emoção, ligados por uma linha que se desenha no scroll (GSAP DrawSVG, agora grátis).
- **O fundo muda de cor por seção** (ScrollTrigger → `state.tint`): semana 1 em azul, depois lavanda, depois rosa, como um amanhecer.
- Marcos ganham revelação "névoa que se abre" (David Whyte): `filter: blur(8px)` → 0 + opacidade. Só em elementos pequenos.

#### (4) Orçamento de performance (Android médio: Snapdragon série 6 ou Exynos/Mali, e iPhone 11)

| Item | Orçamento |
|---|---|
| Canvas ambiente | ≤ 50 mil pixels internos (≈ 0,33× pixels CSS), 30 fps, 3 chamadas de fbm × 3 oitavas por pixel |
| GPU por frame (ambiente) | alvo ≤ 1,5–2 ms *(estimativa; medir no Chrome DevTools > Performance com CPU 4× e no Safari Web Inspector)* |
| JS do efeito | WebGL próprio ~3–4 KB; sem three.js |
| `backdrop-filter` | no máximo **2 superfícies visíveis**, blur ≤ 16px; nunca em lista com scroll |
| `filter: blur()` | só em elementos pequenos (≤ 200×200) ou de forma pontual; zero blobs grandes com blur |
| Grão | 1 camada fixa, estática, ~20–40 KB (WebP 256px) |
| Animações | apenas `transform`/`opacity`/uniforms; nada de animar gradiente CSS por `@property` em tela cheia |
| LCP/INP | primeira pintura em CSS estático; canvas depois de `requestIdleCallback`; nenhuma long task > 50 ms ao trocar emoção |
| Modos | `reduced-motion` = 1 frame estático; `Save-Data`/aparelho fraco = fallback CSS; aba oculta = pausa |

---

## B. Tipografia: alternativas ao Cormorant Garamond

### B0. Evidências: fontes lidas no CSS de sites premiados

| Fonte (Google) | Onde (prêmio, data) | Par usado |
|---|---|---|
| **Instrument Serif** | The Tie-break, SOTD 25/09/2026 (Merci Michel) | Work Sans |
| **Fraunces** | Antara Spa Wellness, HM 07/02/2025 | **Manrope** |
| **Newsreader** | Why Zero, SOTM set/2026 | Inter + Google Sans Flex + Google Sans Code |
| **Literata** | Oryzo AI, SOTM abr/2026 (Lusion) | DM Mono |
| **Geist Mono** | Terminal Industries, SOTM set/2025; Heron AI, SOTD 12/10/2026 | Suisse / BT Grotesk |
| **Inter** | MindMarket, SOTM dez/2025; Well app, HM mai/2025 | — |
| **Work Sans** | Belgrade Arbor, SOTD 17/10/2026; The Tie-break | PP Editorial Old / Instrument Serif |
| **Libre Franklin** | Ponpon Mania, SOTM out/2025 | — |
| **Archivo** | Bevel Health, HM 11/05/2026 | Graphik |
| **Lato** | Méline Gobet, HM 20/06/2026 | display custom |

Os sites premiados usam muito fontes **pagas**: PP Editorial New (Sleep Well, Neutomni, Signal-A, Pensatori), Canela (David Whyte, Virtual Well-being Hub), Basel Grotesk + PS Times (Odyssée), Neue Montreal, Roobert e Aeonik. Os equivalentes gratuitos mais próximos:

- PP Editorial New → **Instrument Serif**
- Canela → **Fraunces** (opsz alto, SOFT) ou **Newsreader**
- Neue Montreal / Basel → **Geist**, **Inter Tight** ou **Instrument Sans**

### B1. Teste de numerais e acentos (renderizado em 30px e 16px)

- **Acentos (ã õ ç é ê):** todas as candidatas renderizam corretamente. O subset `latin` do Google já cobre U+00C0–00FF, que inclui todo o português. **Não é preciso `latin-ext`**, o que economiza bytes.
- **Cormorant Garamond:** o padrão são algarismos *oldstyle*, e o "1" é um "I" pequeno. **Confirmado.** Mesmo com `lining-nums`, o "1" continua muito parecido com o "I".
- **Instrument Serif:** algarismos lining e "1" com bandeira, mas o desenho é **condensado**. Em 16px, "11:10" parece "ll:l0". Use só em ≥ 28px e **nunca para números**.
- **Fraunces:** "1" claro, com bandeira e pé, legível em 16px. É a melhor serif nesse quesito.
- **Newsreader / Literata:** "1" claro e boa leitura em 16px.
- **Young Serif:** **oldstyle por padrão**, com o mesmo problema do Cormorant. Com `font-variant-numeric: lining-nums` vira lining (testado). É obrigatório configurar isso.
- **Syne:** oldstyle por padrão, e com lnum o "1" e o "I" viram barras quase idênticas. **Evitar.**
- **Geist:** "1" com bandeira e "l" com cauda. É a **melhor distinção 1/I/l** entre as sans testadas.
- **Inter Tight / Plus Jakarta / Instrument Sans / Manrope:** o "I" e o "l" são barras simples, parecidas entre si, mas o "1" é claro. Para números grandes, prefira Geist ou Fraunces.
- **Regra global:** `font-variant-numeric: lining-nums tabular-nums` em timers, contadores e datas.

### B2. Quatro direções

#### Direção 1: "Revista calma", serif editorial em alta
- **Display:** **Instrument Serif**, 400 e 400 itálico (só existe esse peso). **UI/corpo:** **Geist**, 400/500/600. **Números e rótulos:** **Geist Mono**, 400/500, opcional.
- **Exemplos reais:** The Tie-break (SOTD 25/09/2026) com Instrument Serif Italic + Work Sans. O visual "PP Editorial New", que dominou Sleep Well (SOTD jan/2026), Neutomni, Signal-A e Belgrade Arbor (SOTD out/2026), é exatamente o que a Instrument Serif imita de graça.
- **Por que serve:** é o visual Awwwards de 2025–26. O itálico é perfeito para palavras emocionais ("*para si*", "*respire*"), e um peso único força contenção.
- **Riscos:** condensada, ruim abaixo de 24px. Tem um peso só, então a hierarquia vem de tamanho e itálico. Numerais ambíguos em tamanho pequeno. Toda métrica numérica deve ficar em Geist.

```ts
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
const display = Instrument_Serif({ subsets:['latin'], weight:'400', style:['normal','italic'], variable:'--font-display' });
const sans    = Geist({ subsets:['latin'], variable:'--font-sans' });
const mono    = Geist_Mono({ subsets:['latin'], variable:'--font-mono' });
```

#### Direção 2: "Abraço", serif macia e quente (minha recomendação para o produto)
- **Display:** **Fraunces** variável, `opsz` automático, `SOFT` 100, `WONK` 0, pesos 300–500 e itálico. **Corpo:** **Manrope** (mantém o atual), 400/500/600.
- **Exemplo real:** Antara Spa Wellness (HM 07/02/2025) usa exatamente Fraunces + Manrope num site de spa e wellness. É a referência de Canela (David Whyte, Virtual Well-being Hub) em versão gratuita.
- **Por que serve:** é calorosa e acolhedora, com o "1" mais claro do teste. O eixo `SOFT` arredonda as serifas, e os eixos variáveis permitem que o texto respire: animar `wght` 300→420 ou `SOFT` junto com o orb, um detalhe de nível Awwwards. Ainda dispensa a troca da fonte de corpo.
- **Riscos:** com `WONK` 1 ou `opsz` alto e peso forte ela fica "quirky". Mantenha WONK 0 e pesos ≤ 500. O arquivo variável com 4 eixos é maior, então carregue só `latin` e só os eixos usados. Em caixa-alta espaçada (como o "CLAVIS VIA" atual) perde charme, por isso use caixa baixa ou título normal.

```ts
import { Fraunces, Manrope } from 'next/font/google';
const display = Fraunces({ subsets:['latin'], axes:['SOFT','opsz'], style:['normal','italic'], variable:'--font-display' });
// CSS: font-variation-settings: 'SOFT' 100, 'WONK' 0;  (o WONK fica no default 0 se não for carregado)
```

- **Variante mais sóbria da mesma direção:** **Newsreader** (opsz 6–72, 200–800) + Manrope. Exemplo real: Why Zero (SOTM set/2026).

#### Direção 3: "Moderno gentil", grotesk de display com personalidade
- **Display:** **Bricolage Grotesque**, `opsz` 96, `wdth` 90–100, pesos 300–500. **UI/corpo:** **Geist** ou Manrope.
- **Alternativa forte:** **Google Sans Flex** (no Google Fonts desde 11/2025), com eixo **`ROND`** que arredonda os terminais. Em ROND 60–100 ela fica macia e calma. Exemplo real: Why Zero (SOTM set/2026).
- **Exemplos de grotesk em premiados:** Odyssée (Basel Grotesk, SOTD out/2026), Heron AI (BT Grotesk), Lusion (Aeonik). Os gratuitos com evidência no CSS: Work Sans (Belgrade Arbor, SOTD), Libre Franklin (Ponpon Mania, SOTM), Archivo (Bevel, HM). **Não encontrei Bricolage nos sites premiados que escaneei.** Ela é tendência em Framer e Webflow, mas sem prova nesta amostra.
- **Por que serve:** é contemporânea, sem o romantismo da serif, e o "1" e os acentos são claros. Em peso leve com opsz alto fica elegante.
- **Riscos:** em pesos altos a Bricolage fica "startup" e barulhenta. **Unbounded** é larga e alta demais para um app calmo, e a **Syne** tem o problema 1/I. Confirme que a versão do Next 16 lista `Google_Sans_Flex` em `next/font/google`. Se não listar, use `next/font/local` com o arquivo OFL.

#### Direção 4: "Silêncio", sistema só com sans refinada
- **Display e UI:** **Geist** (display em 300–400 com `letter-spacing: -0.03em`, UI em 400–600). **Números e rótulos:** **Geist Mono**.
- **Alternativa:** **Inter Tight** (display) + **Inter** (corpo).
- **Exemplos reais:** MindMarket (SOTM dez/2025) com Inter. Terminal Industries (SOTM set/2025) e Heron AI (SOTD out/2026) com Geist Mono nos rótulos. Odyssée mostra o mesmo princípio, um grotesk grande com recuo, em fonte paga.
- **Por que serve:** é a leitura mais clara, com os melhores numerais (Geist) e o visual mais "produto". A beleza fica a cargo do fundo (seda + grão) e do espaço.
- **Riscos:** pode virar "SaaS genérico" se o fundo e o layout não carregarem a emoção. Inter/Inter Tight têm "I" e "l" parecidos. Geist é melhor nisso.

### B3. Opções só no Fontshare (grátis para uso comercial, via `next/font/local`)

- **Switzer:** usada em Noho (SOTD 18/09/2026) e Redgevity Master (HM 14/08/2026). Confirmado no CSS.
- **Satoshi, General Sans, Cabinet Grotesk:** sans.
- **Gambetta, Zodiak, Erode, Sentient, Boska:** serifs. Erode e Sentient são as mais "wellness".

Todas precisam de self-host. Vale testar **Sentient** ou **Erode** + **Switzer** se nenhuma Google convencer.

### B4. Recomendação final

- **Produto (telas de uso diário):** **Fraunces + Manrope** (Direção 2). É calorosa, o "1" é claro, a prova vem de um premiado de wellness e não exige trocar o corpo. O eixo `SOFT`/`wght` animado na respiração é um diferencial.
- **Se o dono quiser o "look Awwwards" mais editorial:** **Instrument Serif + Geist** (Direção 1), com Instrument só em títulos ≥ 28px e todos os números em Geist.
- **Próximo passo:** montar a tela Entrada nas duas versões com o novo fundo e decidir vendo no celular. O arquivo `scratchpad/fonttest.html` já tem a amostra comparativa das fontes.
