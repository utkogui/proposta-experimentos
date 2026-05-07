import "./proposta.css";
import { Manrope } from "next/font/google";
import type { Viewport } from "next";

// Manrope como fallback enquanto Moderat não está instalada
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <body className="proposta-page" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
