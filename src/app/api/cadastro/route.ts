import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Cadastro recebido:", body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
