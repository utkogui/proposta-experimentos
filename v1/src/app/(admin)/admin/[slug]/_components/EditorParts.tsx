"use client";

import { ReactNode, useState } from "react";
import {
  PROPOSTA_SECTION_LABELS,
  type Proposta,
  type PropostaSectionKey,
} from "@/lib/types";

export function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden group"
    >
      <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between hover:bg-neutral-50 list-none">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-neutral-400 text-xs group-open:rotate-90 transition-transform">
          ▶
        </span>
      </summary>
      <div className="px-5 py-5 space-y-4 border-t border-neutral-100">
        {children}
      </div>
    </details>
  );
}

export function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-y"
    />
  );
}

export function ListEditor<T>({
  label,
  items,
  onChange,
  empty,
  render,
  compact = false,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  empty: () => T;
  render: (item: T, set: (it: T) => void) => ReactNode;
  compact?: boolean;
}) {
  function setAt(i: number, v: T) {
    const next = items.slice();
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, empty()]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        <button
          type="button"
          onClick={add}
          className="text-xs text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-md px-2 py-1"
        >
          + Adicionar
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-sm text-neutral-400 italic px-3 py-2">
            Nenhum item.
          </div>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className={`bg-neutral-50 border border-neutral-200 rounded-lg ${compact ? "p-2" : "p-3"} flex gap-2`}
          >
            <div className="flex-1">{render(item, (v) => setAt(i, v))}</div>
            <div className="flex flex-col gap-1 text-neutral-400 text-xs">
              <button
                type="button"
                onClick={() => move(i, -1)}
                title="Mover para cima"
                className="hover:text-neutral-900"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                title="Mover para baixo"
                className="hover:text-neutral-900"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                title="Remover"
                className="hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionOrderEditor({
  value,
  onChange,
}: {
  value: PropostaSectionKey[];
  onChange: (value: PropostaSectionKey[]) => void;
}) {
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500">
        Use as setas para alterar a ordem das seções na proposta pública. O
        hero permanece sempre no topo.
      </p>
      <div className="space-y-2">
        {value.map((key, i) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
          >
            <span className="w-8 text-xs font-mono text-neutral-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-sm font-medium text-neutral-800">
              {PROPOSTA_SECTION_LABELS[key]}
            </span>
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === value.length - 1}
              className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↓
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoUploader({
  currentUrl,
  currentBg,
  onChange,
  onChangeBg,
}: {
  currentUrl: string;
  currentBg: string;
  onChange: (url: string) => void;
  onChangeBg: (bg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  async function detectBg(source: File | string) {
    setDetecting(true);
    try {
      const { extractLogoBgFromFile, extractLogoBgFromUrl } = await import(
        "@/lib/logo-color"
      );
      const hex =
        typeof source === "string"
          ? await extractLogoBgFromUrl(source)
          : await extractLogoBgFromFile(source);
      if (hex) onChangeBg(hex);
    } finally {
      setDetecting(false);
    }
  }

  async function onFile(file: File) {
    setUploading(true);
    setError(null);
    detectBg(file);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
    });
    setUploading(false);
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      setError(b?.error ?? "Falha no upload");
      return;
    }
    const { url } = await res.json();
    onChange(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-24 rounded-lg border border-neutral-200 flex items-center justify-center overflow-hidden transition-colors"
          style={{ background: currentBg || "#f5f5f5" }}
        >
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt=""
              className="max-w-full max-h-full object-contain p-2"
            />
          ) : (
            <span className="text-xs text-neutral-400">sem logo</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
            <span className="cursor-pointer inline-block text-sm rounded-lg border border-neutral-300 px-3 py-2 hover:bg-neutral-50">
              {uploading ? "Enviando..." : "Escolher arquivo"}
            </span>
          </label>
          {currentUrl && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                onChangeBg("");
              }}
              className="text-xs text-neutral-500 hover:text-red-600 ml-3"
            >
              Remover
            </button>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      {currentUrl && (
        <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
          <label className="text-xs uppercase tracking-wider text-neutral-500">
            Cor de fundo
          </label>
          <input
            type="color"
            value={currentBg || "#000000"}
            onChange={(e) => onChangeBg(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-neutral-300 bg-transparent"
          />
          <input
            type="text"
            value={currentBg}
            onChange={(e) => onChangeBg(e.target.value)}
            placeholder="#000000"
            className="font-mono text-xs w-24 rounded border border-neutral-300 px-2 py-1"
          />
          <button
            type="button"
            onClick={() => currentUrl && detectBg(currentUrl)}
            disabled={detecting}
            className="text-xs text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
            title="Detectar a cor dominante da logo automaticamente"
          >
            {detecting ? "Detectando..." : "Detectar automaticamente"}
          </button>
          {currentBg && (
            <button
              type="button"
              onClick={() => onChangeBg("")}
              className="text-xs text-neutral-400 hover:text-red-600"
            >
              limpar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function CronogramaEditor({
  value,
  onChange,
}: {
  value: Proposta["cronograma"];
  onChange: (v: Proposta["cronograma"]) => void;
}) {
  const cols = value.columns;

  function setColumn(i: number, label: string) {
    const next = cols.slice();
    next[i] = label;
    onChange({ ...value, columns: next });
  }
  function addColumn() {
    onChange({
      ...value,
      columns: [...cols, `Sem ${cols.length + 1}`],
      phases: value.phases.map((ph) => ({
        ...ph,
        rows: ph.rows.map((r) => ({ ...r, marks: [...r.marks, false] })),
      })),
    });
  }
  function removeColumn(i: number) {
    if (cols.length <= 1) return;
    onChange({
      ...value,
      columns: cols.filter((_, idx) => idx !== i),
      phases: value.phases.map((ph) => ({
        ...ph,
        rows: ph.rows.map((r) => ({
          ...r,
          marks: r.marks.filter((_, idx) => idx !== i),
          star: r.star === i ? null : r.star !== null && r.star > i ? r.star - 1 : r.star,
        })),
      })),
    });
  }

  function updatePhase(i: number, p: Proposta["cronograma"]["phases"][number]) {
    const next = value.phases.slice();
    next[i] = p;
    onChange({ ...value, phases: next });
  }
  function addPhase() {
    onChange({
      ...value,
      phases: [
        ...value.phases,
        { nome: "ETAPA — NOVA FASE", rows: [] },
      ],
    });
  }
  function removePhase(i: number) {
    onChange({
      ...value,
      phases: value.phases.filter((_, idx) => idx !== i),
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500">
            Colunas (ex.: semanas)
          </span>
          <button
            type="button"
            onClick={addColumn}
            className="text-xs text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-md px-2 py-1"
          >
            + Coluna
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cols.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <input
                value={c}
                onChange={(e) => setColumn(i, e.target.value)}
                className="w-24 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() => removeColumn(i)}
                className="text-neutral-400 hover:text-red-600 text-xs px-1"
                title="Remover coluna"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-500">
            Fases e linhas
          </span>
          <button
            type="button"
            onClick={addPhase}
            className="text-xs text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-md px-2 py-1"
          >
            + Fase
          </button>
        </div>
        {value.phases.map((phase, pi) => (
          <PhaseEditor
            key={pi}
            phase={phase}
            columns={cols}
            onChange={(p) => updatePhase(pi, p)}
            onRemove={() => removePhase(pi)}
          />
        ))}
      </div>
    </div>
  );
}

function PhaseEditor({
  phase,
  columns,
  onChange,
  onRemove,
}: {
  phase: Proposta["cronograma"]["phases"][number];
  columns: string[];
  onChange: (p: Proposta["cronograma"]["phases"][number]) => void;
  onRemove: () => void;
}) {
  function setRow(i: number, r: Proposta["cronograma"]["phases"][number]["rows"][number]) {
    const next = phase.rows.slice();
    next[i] = r;
    onChange({ ...phase, rows: next });
  }
  function addRow() {
    onChange({
      ...phase,
      rows: [
        ...phase.rows,
        {
          label: "",
          marks: columns.map(() => false),
          star: null,
        },
      ],
    });
  }
  function removeRow(i: number) {
    onChange({ ...phase, rows: phase.rows.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 space-y-3">
      <div className="flex gap-2">
        <input
          value={phase.nome}
          onChange={(e) => onChange({ ...phase, nome: e.target.value })}
          placeholder="Nome da fase (ex.: ETAPA 01 — CORREÇÃO)"
          className="flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm font-medium"
        />
        <button
          type="button"
          onClick={onRemove}
          className="text-neutral-400 hover:text-red-600 text-xs px-2"
          title="Remover fase"
        >
          Remover fase
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-neutral-500">
              <th className="text-left pb-2 font-medium">Entrega</th>
              {columns.map((c, i) => (
                <th key={i} className="px-1 pb-2 font-medium text-center w-14">
                  {c || `Col ${i + 1}`}
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {phase.rows.map((row, ri) => (
              <tr key={ri} className="border-t border-neutral-200">
                <td className="py-1.5 pr-2">
                  <input
                    value={row.label}
                    onChange={(e) =>
                      setRow(ri, { ...row, label: e.target.value })
                    }
                    placeholder="Entrega"
                    className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm"
                  />
                </td>
                {columns.map((_, ci) => (
                  <td key={ci} className="text-center px-1">
                    <button
                      type="button"
                      onClick={() => {
                        const isStarHere = row.star === ci;
                        if (row.marks[ci]) {
                          // bullet -> empty
                          const next = row.marks.slice();
                          next[ci] = false;
                          setRow(ri, { ...row, marks: next });
                        } else if (!isStarHere) {
                          // empty -> bullet
                          const next = row.marks.slice();
                          next[ci] = true;
                          setRow(ri, {
                            ...row,
                            marks: next,
                            star: row.star === ci ? null : row.star,
                          });
                        }
                      }}
                      className="w-6 h-6 rounded border border-neutral-200 bg-white hover:border-neutral-400"
                      title={
                        row.marks[ci]
                          ? "Clique para limpar"
                          : "Clique para marcar (●)"
                      }
                    >
                      {row.star === ci ? (
                        <span className="text-amber-500">★</span>
                      ) : row.marks[ci] ? (
                        <span className="text-neutral-900">●</span>
                      ) : (
                        ""
                      )}
                    </button>
                  </td>
                ))}
                <td>
                  <div className="flex flex-col items-center gap-1">
                    <select
                      value={row.star ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setRow(ri, {
                          ...row,
                          star: v === "" ? null : Number(v),
                        });
                      }}
                      className="text-xs rounded border border-neutral-300 px-1 py-0.5"
                      title="Estrela em qual coluna?"
                    >
                      <option value="">—</option>
                      {columns.map((c, i) => (
                        <option key={i} value={i}>
                          ★ {c || `Col ${i + 1}`}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeRow(ri)}
                      className="text-neutral-400 hover:text-red-600 text-xs"
                      title="Remover linha"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="text-xs text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-md px-2 py-1"
      >
        + Linha
      </button>
    </div>
  );
}
