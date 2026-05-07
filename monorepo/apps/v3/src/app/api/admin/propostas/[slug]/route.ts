import { NextRequest, NextResponse } from "next/server";
import { deleteProposta, getProposta, saveProposta } from "@/lib/storage";
import { PropostaSchema } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const proposta = await getProposta(slug);
  if (!proposta) {
    return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ proposta });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const existing = await getProposta(slug);
  if (!existing) {
    return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = PropostaSchema.safeParse({
    ...body,
    slug,
    metadata: existing.metadata,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validação falhou", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const saved = await saveProposta(parsed.data);
  return NextResponse.json({ proposta: saved });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ok = await deleteProposta(slug);
  if (!ok) {
    return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
