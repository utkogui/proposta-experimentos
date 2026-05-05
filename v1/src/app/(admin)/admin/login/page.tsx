"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Falha no login");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm space-y-5"
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Matilha CMS</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Entre com a senha do time comercial.
        </p>
      </div>
      <label className="block">
        <span className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
          Senha
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
        />
      </label>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full rounded-lg bg-neutral-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
