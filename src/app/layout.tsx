import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { AmbientBackground } from "@/components/brand/ambient-background";
import { AmbientProvider } from "@/components/ambient/ambient-provider";
import "./globals.css";

// Fonte variável (peso 200–800 + eixo óptico): um único arquivo, títulos com peso fino e corpo firme
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CLAVIS VIA — seu caminho de volta para si",
    template: "%s · CLAVIS VIA",
  },
  description:
    "Protótipo de demonstração: check-in emocional, prática do dia, planos temáticos e acompanhamento da sua jornada.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f8fc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} antialiased`}>
      <body className="min-h-dvh">
        <noscript>
          <style>{`[data-reveal-pending],[data-intro-hero],[data-intro-pillar],[data-intro-step]{visibility:visible!important;opacity:1!important}`}</style>
        </noscript>
        {/* Camadas do fundo: CSS (fallback) → aurora WebGL → grão; o conteúdo vem por cima */}
        <AmbientBackground />
        <div aria-hidden className="grain" />
        <MotionProvider>
          <AmbientProvider>{children}</AmbientProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
