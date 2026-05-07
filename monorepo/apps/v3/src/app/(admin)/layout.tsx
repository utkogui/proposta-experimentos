import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import {
  CMS_TEMPLATE_COOKIE,
  CMS_TEMPLATE_HEADER,
  parseTemplateCookie,
} from "@/lib/cms-template";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matilha CMS",
  description: "CMS interno de propostas comerciais.",
};

export default async function AdminRootLayout({
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
      data-cms-template={template}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} cms-template-${template} antialiased min-h-screen bg-neutral-50 text-neutral-900`}
      >
        {children}
      </body>
    </html>
  );
}
