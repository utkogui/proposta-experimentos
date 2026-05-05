/* eslint-disable no-console */
import "../lib/env";
import { saveProposta, slugExists } from "../lib/storage";
import { getTemplate } from "../lib/template";

async function main() {
  const slug = "ciee-pr";
  if (await slugExists(slug)) {
    console.log(`Proposta "${slug}" já existe — pulando seed.`);
    return;
  }
  const tpl = getTemplate();
  const proposta = { ...tpl, slug };
  const saved = await saveProposta(proposta);
  console.log(`✓ Proposta "${saved.slug}" criada com sucesso.`);
  console.log(`  Cliente: ${saved.cliente.nome}`);
  console.log(`  Acesse em: http://localhost:3000/p/${saved.slug}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
