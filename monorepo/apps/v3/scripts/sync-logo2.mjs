import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.resolve(root, "../../logo2");
const dest = path.join(root, "public", "logo2");

if (!fs.existsSync(src)) {
  console.warn("[sync-logo2] origem inexistente:", src);
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });
for (const name of fs.readdirSync(src)) {
  if (!name.toLowerCase().endsWith(".svg")) continue;
  fs.copyFileSync(path.join(src, name), path.join(dest, name));
}
console.log("[sync-logo2] copiados para", dest);
