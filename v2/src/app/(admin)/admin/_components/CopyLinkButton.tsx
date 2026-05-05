"use client";

import { useEffect, useState } from "react";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = origin ? `${origin}/p/${slug}` : `/p/${slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 flex items-center gap-3">
      <div className="text-[11px] uppercase tracking-wider text-neutral-500">
        Link público
      </div>
      <code className="text-xs font-mono text-neutral-800 truncate max-w-[24rem]">
        {url}
      </code>
      <button
        type="button"
        onClick={copy}
        className="text-xs rounded-md bg-neutral-900 text-white px-2.5 py-1 hover:bg-neutral-700 active:bg-neutral-800 transition-colors"
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}
