import { promises as fs } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import {
  getContentType,
  getPublicUploadPath,
  getUploadPath,
} from "@/lib/uploads";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const fileName = path[0];

  if (
    path.length !== 1 ||
    !fileName ||
    !/^[a-zA-Z0-9._-]+$/.test(fileName)
  ) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }

  try {
    const buffer = await readUpload(fileName);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": getContentType(fileName),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }
}

async function readUpload(fileName: string): Promise<Buffer> {
  try {
    return await fs.readFile(getUploadPath(fileName));
  } catch {
    return fs.readFile(getPublicUploadPath(fileName));
  }
}
