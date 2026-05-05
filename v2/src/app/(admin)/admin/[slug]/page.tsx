import { notFound } from "next/navigation";
import Link from "next/link";
import { getProposta } from "@/lib/storage";
import { AdminShell } from "../_components/AdminShell";
import { CopyLinkButton } from "../_components/CopyLinkButton";
import { Editor } from "./_components/Editor";

export const dynamic = "force-dynamic";

export default async function AdminEditarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposta = await getProposta(slug);
  if (!proposta) notFound();

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/admin"
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              ← Todas as propostas
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight mt-1">
              {proposta.cliente.nome}
            </h1>
            <p className="text-sm text-neutral-500">
              {proposta.proposta.projeto} ·{" "}
              <span className="font-mono text-xs">
                {proposta.proposta.numero || proposta.slug}
              </span>
            </p>
          </div>
          <Link
            href={`/p/${proposta.slug}`}
            target="_blank"
            className="text-sm rounded-lg border border-neutral-300 px-3 py-2 hover:bg-neutral-50"
          >
            Ver proposta ↗
          </Link>
        </div>

        <div className="mb-6">
          <CopyLinkButton slug={proposta.slug} />
        </div>
        <Editor initial={proposta} />
      </div>
    </AdminShell>
  );
}
