"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Existing {
  slug: string;
  label: string;
}

export function NovaPropostaForm({
  propostasExistentes,
}: {
  propostasExistentes: Existing[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clienteNome, setClienteNome] = useState("");
  const [projeto, setProjeto] = useState("");
  const [fromSlug, setFromSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/propostas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteNome: clienteNome.trim(),
        projeto: projeto.trim() || undefined,
        fromSlug: fromSlug || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Falha ao criar proposta");
      return;
    }
    const { proposta } = await res.json();
    router.push(`/admin/${proposta.slug}`);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-neutral-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-neutral-800 transition"
      >
        + Nova proposta
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 flex items-center justify-center p-4"
          onClick={() => !loading && setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4"
          >
            <h2 className="text-lg font-semibold tracking-tight">
              Nova proposta
            </h2>
            <p className="text-sm text-neutral-500">
              Preencha os dados básicos. O conteúdo da proposta-base é
              copiado e você ajusta no editor.
            </p>

            <label className="block">
              <span className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                Cliente *
              </span>
              <input
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                required
                autoFocus
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
              />
            </label>

            <label className="block">
              <span className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                Projeto
              </span>
              <input
                value={projeto}
                onChange={(e) => setProjeto(e.target.value)}
                placeholder="Ex.: Manutenção Site"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
              />
            </label>

            <label className="block">
              <span className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                Duplicar de
              </span>
              <select
                value={fromSlug}
                onChange={(e) => setFromSlug(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
              >
                <option value="">Template padrão (CIEE-PR)</option>
                {propostasExistentes.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !clienteNome.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando..." : "Criar proposta"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
