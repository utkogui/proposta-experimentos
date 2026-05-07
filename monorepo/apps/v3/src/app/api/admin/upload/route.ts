import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { getUploadDir, getUploadPath } from "@/lib/uploads";

/**
 * Upload de arquivo (logo do cliente).
 *
 * - Em produção (Render Disk): salva em UPLOAD_DIR, ex: /var/data/uploads
 * - Em dev: salva em ./public/uploads/
 */

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }
  const file = formData.get("file") as
    | (Blob & { name?: string; size?: number })
    | null;
  if (
    !file ||
    typeof (file as Blob).arrayBuffer !== "function" ||
    typeof (file as Blob).size !== "number"
  ) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }
  const MAX = 5 * 1024 * 1024;
  if (file.size! > MAX) {
    return NextResponse.json(
      { error: "Arquivo muito grande (máx. 5MB)" },
      { status: 413 }
    );
  }

  const fileName = file.name ?? "upload.bin";
  const ext = (fileName.split(".").pop() || "bin").toLowerCase();
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await fs.mkdir(getUploadDir(), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(getUploadPath(safeName), buffer);
  return NextResponse.json({ url: `/uploads/${safeName}` });
}
