import Link from "next/link";
import { listPropostas } from "@/lib/storage";
import { AdminShell } from "./_components/AdminShell";
import { NovaPropostaForm } from "./_components/NovaPropostaForm";

export const dynamic = "force-dynamic";

function formatData(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default async function AdminListaPage() {
  const propostas = await listPropostas();

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Propostas
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Crie, edite e compartilhe propostas comerciais.
            </p>
          </div>
          <NovaPropostaForm
            propostasExistentes={propostas.map((p) => ({
              slug: p.slug,
              label: `${p.clienteNome} · ${p.projeto}`,
            }))}
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {propostas.length === 0 ? (
            <div className="p-10 text-center text-neutral-500 text-sm">
              Nenhuma proposta ainda. Clique em <b>Nova proposta</b> para criar
              a primeira a partir do template.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Nº</th>
                  <th className="text-left px-5 py-3 font-medium">Cliente</th>
                  <th className="text-left px-5 py-3 font-medium">Projeto</th>
                  <th className="text-left px-5 py-3 font-medium">
                    Link público
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Atualizada
                  </th>
                  <th className="text-right px-5 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {propostas.map((p) => (
                  <tr
                    key={p.slug}
                    className="border-t border-neutral-100 hover:bg-neutral-50/50"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-neutral-700">
                      {p.numero || "—"}
                    </td>
                    <td className="px-5 py-3 font-medium">{p.clienteNome}</td>
                    <td className="px-5 py-3 text-neutral-600">{p.projeto}</td>
                    <td className="px-5 py-3 font-mono text-xs">
                      <Link
                        href={`/p/${p.slug}`}
                        target="_blank"
                        className="text-neutral-500 hover:text-neutral-900 hover:underline"
                      >
                        /p/{p.slug}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">
                      {formatData(p.atualizadoEm)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/p/${p.slug}`}
                          target="_blank"
                          className="text-neutral-600 hover:text-neutral-900"
                          title="Abrir a proposta como o cliente vê"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/admin/${p.slug}`}
                          className="text-neutral-900 font-medium"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
