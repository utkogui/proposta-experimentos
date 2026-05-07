"use client";

import { useCallback, useRef, useState } from "react";
import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";

type Props = {
  /** Nome sugerido do arquivo ao baixar o PDF */
  suggestedPdfTitle: string;
};

const EXPORT_ROOT_ID = "proposta-export-root";

function sanitizeFilename(name: string) {
  return (
    name
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, " ")
      .trim() || "proposta"
  );
}

/**
 * PDF contínuo (uma página alta) via rasterização do DOM.
 * Usa html-to-image (SVG foreignObject) para respeitar CSS moderno (ex.: color-mix),
 * ao contrário do html2canvas, que falha ao interpretar essas funções.
 */
export function PropostaPrintPdfButton({ suggestedPdfTitle }: Props) {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const handleExport = useCallback(async () => {
    const root = document.getElementById(EXPORT_ROOT_ID);
    if (!root || busyRef.current) return;

    busyRef.current = true;
    setBusy(true);
    const htmlEl = document.documentElement;

    htmlEl.classList.add("proposta-pdf-capture");

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    await new Promise((r) => setTimeout(r, 280));

    try {
      const canvas = await toCanvas(root, {
        pixelRatio: 2,
        backgroundColor: "#000000",
        cacheBust: true,
        filter: (node) =>
          !(node instanceof HTMLElement && node.classList.contains("proposta-print-pdf")),
      });

      const w = canvas.width;
      const h = canvas.height;
      /** PNG evita escurecimento dos brancos típico do JPEG na rasterização. */
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: h >= w ? "portrait" : "landscape",
        unit: "px",
        format: [w, h],
        compress: true,
        hotfixes: ["px_scaling"],
      });

      pdf.addImage(imgData, "PNG", 0, 0, w, h);
      pdf.save(`${sanitizeFilename(suggestedPdfTitle)}.pdf`);
    } catch (e) {
      console.error("Falha ao gerar PDF:", e);
    } finally {
      htmlEl.classList.remove("proposta-pdf-capture");
      busyRef.current = false;
      setBusy(false);
    }
  }, [suggestedPdfTitle]);

  return (
    <button
      type="button"
      className="proposta-print-pdf"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleExport();
      }}
      disabled={busy}
      aria-busy={busy}
      title={
        busy
          ? "Gerando PDF…"
          : "Baixar PDF contínuo (captura do layout da página)"
      }
      aria-label={
        busy
          ? "Gerando PDF da proposta"
          : "Baixar PDF contínuo da proposta como na página"
      }
    >
      <svg
        className="proposta-print-pdf__icon"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8l-6-6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 2v6h6M12 18v-6m0 0-2 2m2-2 2 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
