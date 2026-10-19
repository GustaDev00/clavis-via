import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { AmbientBackground } from "@/components/brand/ambient-background";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
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
        <AmbientBackground />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
