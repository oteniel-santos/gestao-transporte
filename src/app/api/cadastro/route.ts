import { NextResponse } from "next/server";
import { salvarCadastro } from "@/services/cadastro.service";
import { ESCOLAS } from "@/constants/escolas";
import { LINHAS } from "@/constants/linhas";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // resolver linha nome
    const linhaObj = LINHAS.find((l) => l.id === body.linha);
    const linhaNome = linhaObj?.nome ?? "";

    // resolver escolaNOme de cada filho
    const filhosComNome = body.filhos.map((f: any) => {
      const escola = ESCOLAS.find((e) => e.id === f.escolaId);
      return {
        ...f,
        escolaNome: escola?.nome ?? "",
      };
    });

    const dadosParaSalvar = {
      ...body,
      linhaNome,
      filhos: filhosComNome,
    };

    const id = await salvarCadastro(dadosParaSalvar);

    return NextResponse.json({
      ok: true,
      id: id,
    });
  } catch (error) {
    console.error("erro ao salvar o arquivo", error);
    return NextResponse.json(
      { ok: false, error: "Erro ao salvar cadastro" },
      { status: 500 },
    );
  }
}
