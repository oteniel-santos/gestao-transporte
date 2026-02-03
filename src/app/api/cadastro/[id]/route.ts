import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    }

    const ref = doc(db, "cadastrosTransporte", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "Cadastro não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: snap.id,
      ...snap.data(),
    });
  } catch (error) {
    console.error("Erro ao buscar cadastro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
