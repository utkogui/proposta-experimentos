import { NextRequest, NextResponse } from "next/server";
import {
  generateUniqueSlug,
  getProposta,
  listPropostas,
  saveProposta,
} from "@/lib/storage";
import { PropostaSchema } from "@/lib/types";
import { getTemplate } from "@/lib/template";

export async function GET() {
  const list = await listPropostas();
  return NextResponse.json({ propostas: list });
}

/**
 * POST /api/admin/propostas
 * body: { fromSlug?: string, clienteNome: string, projeto?: string }
 *
 * Cria uma proposta nova:
 * - se fromSlug: duplica a proposta existente com novo slug
 * - senão: usa o template padrão (Gluck/Hackahunt) como base
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    fromSlug?: string;
    clienteNome?: string;
    projeto?: string;
  };

  const clienteNome = (body.clienteNome ?? "").trim();
  if (!clienteNome) {
    return NextResponse.json(
      { error: "clienteNome é obrigatório" },
      { status: 400 }
    );
  }

  const base =
    (body.fromSlug && (await getProposta(body.fromSlug))) ||
    getTemplate();

  if (!base) {
    return NextResponse.json(
      { error: "Proposta-base não encontrada" },
      { status: 404 }
    );
  }

  const slug = await generateUniqueSlug(clienteNome);
  const projeto = body.projeto?.trim() || base.proposta.projeto;

  const novaProposta = PropostaSchema.parse({
    ...base,
    slug,
    cliente: { ...base.cliente, nome: clienteNome },
    proposta: { ...base.proposta, projeto },
    metadata: { criadoEm: "", atualizadoEm: "" },
  });

  const saved = await saveProposta(novaProposta);
  return NextResponse.json({ proposta: saved }, { status: 201 });
}
