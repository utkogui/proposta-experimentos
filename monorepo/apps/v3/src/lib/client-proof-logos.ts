import fs from "node:fs";
import path from "node:path";

/**
 * Texto alternativo derivado do nome do arquivo (SVG em `logo2/`).
 */
export function clientLogoAlt(file: string): string {
  const base = file.replace(/\.svg$/i, "").trim();
  return base.replace(/[-_]+/g, " ").trim() || "Cliente";
}

export function clientLogoSrc(file: string): string {
  return `/logo2/${encodeURIComponent(file)}`;
}

export function listClientLogoSvgs(): string[] {
  const dir = path.join(process.cwd(), "public", "logo2");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => n.toLowerCase().endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
}
