import "./proposta.css";
import { Manrope } from "next/font/google";
import type { Viewport } from "next";
import { cookies, headers } from "next/headers";
import {
  CMS_TEMPLATE_COOKIE,
  CMS_TEMPLATE_HEADER,
  parseTemplateCookie,
} from "@/lib/cms-template";

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

export default async function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const jar = await cookies();
  const template = parseTemplateCookie(
    h.get(CMS_TEMPLATE_HEADER) ?? jar.get(CMS_TEMPLATE_COOKIE)?.value,
  );

  return (
    <html
      lang="pt-BR"
      className={manrope.variable}
      data-cms-template={template}
      suppressHydrationWarning
    >
      <body
        className={`proposta-page cms-template-${template}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
