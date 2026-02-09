import { Escola } from "@/types/cadastro";

export const ESCOLAS: Escola[] = [
  { id: 10, nome: "São João" },
  { id: 11, nome: "Dante Martins" },
  { id: 12, nome: "Não sei" },
];

export function getNomeEscola(escolaId: number | ""): string {
  if (!escolaId) return "";
  const escola = ESCOLAS.find((e) => e.id === escolaId);
  return escola ? escola.nome : "";
}

export function selecionarTurmas(idEscola: number): string[] {
  switch (idEscola) {
    case 10:
      return ["4º ano", "5º ano", "6º ano"];
    case 11:
      return ["Pré II", "1º ano", "2º ano", "3º ano"];
    case 12:
      return ["Não sei"];
    default:
      return [
        "Pré I e II",
        "1º Ano",
        "2º Ano",
        "3º Ano",
        "4º Ano",
        "5º Ano",
        "6º Ano",
        "7º Ano",
        "8º Ano",
        "9º Ano",
      ];
  }
}
