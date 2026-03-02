/**
 * Remove acentos de uma string e converte para minúsculo.
 * @param text Texto a ser normalizado
 * @returns Texto sem acentos e em minúsculo
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
