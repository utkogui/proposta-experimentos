/* eslint-disable no-console */
import "../lib/env";
import { promises as fs } from "node:fs";
import path from "node:path";
import { saveProposta } from "../lib/storage";
import { PropostaSchema } from "../lib/types";

const DATA_DIR = path.resolve(process.cwd(), "data", "propostas");

async function main() {
  if (!process.env.REDIS_URL) {
    throw new Error("Defina REDIS_URL antes de rodar a migração.");
  }

  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  if (!jsonFiles.length) {
    console.log("Nenhuma proposta encontrada em data/propostas.");
    return;
  }

  for (const file of jsonFiles) {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    const parsed = PropostaSchema.parse(JSON.parse(raw));
    await saveProposta(parsed);
    console.log(`✓ Migrada: ${parsed.slug}`);
  }

  console.log(`Migração concluída: ${jsonFiles.length} proposta(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
