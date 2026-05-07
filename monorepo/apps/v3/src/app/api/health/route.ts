import { NextResponse } from "next/server";

/** Railway / balanceadores — GET deve responder rápido sem deps externas. */
export function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
