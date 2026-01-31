import { Escola } from "@/types/cadastro";

export const ESCOLAS: Escola[] = [
  { id: 1, nome: "Creche Mundo Mágico" },
  { id: 2, nome: "Alcides Ferreira Primo" },
  { id: 3, nome: "Inovação" },
  { id: 4, nome: "Nhandu" },
  { id: 5, nome: "André Maggi" },
  { id: 6, nome: "Água Azul" },
  { id: 7, nome: "Teles Pires" },
  { id: 8, nome: "Zita Vilela" },
  { id: 9, nome: "Não sei" },
];

export function getNomeEscola(escolaId: number | ""): string {
  if (!escolaId) return "";
  const escola = ESCOLAS.find((e) => e.id === escolaId);
  return escola ? escola.nome : "";
}

export function selecionarTurmas(idEscola: number): string[] {
  switch (idEscola) {
    case 3:
      return ["4º ano", "5º ano", "6º ano"];
    case 2:
      return ["Pré II", "1º ano", "2º ano", "3º ano"];
    case 1:
      return ["Creche I", "Creche II", "Creche III", "Creche IV", "Pré I"];
    case 5:
      return [
        "7º Ano",
        "8º Ano",
        "9º Ano",
        "1º Ano - Ens. Médio",
        "2º Ano - Ens. Médio",
        "3º Ano - Ens. Médio",
      ];
    case 9:
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
