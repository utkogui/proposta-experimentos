import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  const ok = await checkPassword(body.password ?? "");
  if (!ok) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  }
  await createSessionCookie();
  return NextResponse.json({ ok: true });
}
