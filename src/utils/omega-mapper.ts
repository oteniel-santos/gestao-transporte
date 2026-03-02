import { ESCOLAS } from "@/constants/escolas";

/**
 * Maps school names from the Ômega system to internal school IDs.
 */
export function mapOmegaSchoolToId(omegaSchoolName: string): number | "" {
  const name = omegaSchoolName.toUpperCase();

  if (name.includes("ALCIDES")) return 2;
  if (name.includes("SÃO JOÃO") || name.includes("SAO JOAO")) return 9;
  if (name.includes("MUNDO MÁGICO") || name.includes("MUNDO MAGICO")) return 1;
  if (name.includes("INOVAÇÃO") || name.includes("INOVACAO")) return 3;
  if (name.includes("NHANDU")) return 4;
  if (name.includes("ANDRÉ MAGGI") || name.includes("ANDRE MAGGI")) return 5;
  if (name.includes("ÁGUA AZUL") || name.includes("AGUA AZUL")) return 6;
  if (name.includes("TELES PIRES")) return 7;
  if (name.includes("ZITA VILELA")) return 8;
  if (name.includes("DANTE MARTINS")) return 10;

  // Try to find by name match
  const found = ESCOLAS.find(e => 
    name.includes(e.nome.toUpperCase()) || 
    e.nome.toUpperCase().includes(name)
  );

  return found ? found.id : "";
}

/**
 * Normalizes Ômega class names to match application class names.
 */
export function normalizeOmegaTurma(omegaTurma: string): string {
  let turma = omegaTurma.toUpperCase();

  // Handle common patterns
  if (turma.includes("1º ANO") || turma.includes("1O ANO")) return "1º ano";
  if (turma.includes("2º ANO") || turma.includes("2O ANO")) return "2º ano";
  if (turma.includes("3º ANO") || turma.includes("3O ANO")) return "3º ano";
  if (turma.includes("4º ANO") || turma.includes("4O ANO")) return "4º ano";
  if (turma.includes("5º ANO") || turma.includes("5O ANO")) return "5º ano";
  if (turma.includes("6º ANO") || turma.includes("6O ANO")) return "6º ano";
  if (turma.includes("7º ANO") || turma.includes("7O ANO")) return "7º ano";
  if (turma.includes("8º ANO") || turma.includes("8O ANO")) return "8º ano";
  if (turma.includes("9º ANO") || turma.includes("9O ANO")) return "9º ano";
  
  if (turma.includes("PRÉ I") || turma.includes("PRE I")) {
    if (turma.includes("II")) return "Pré II";
    return "Pré I";
  }
  
  if (turma.includes("CRECHE I")) {
     if (turma.includes("II")) {
       if (turma.includes("III")) {
          if (turma.includes("IV")) return "Creche IV";
          return "Creche III";
       }
       return "Creche II";
     }
     return "Creche I";
  }

  // If no match, return as is (case formatted)
  return omegaTurma;
}
