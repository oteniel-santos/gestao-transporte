import { LINHAS_GPX } from "@/constants/linhas-gpx";
import { carregarGPX, distanciaMetros } from "@/lib/gpx";
import { ResultadoLinha } from "@/types/cadastro";

export function useDetectarLinha() {
  async function detectarLinhaPorGPX(
    latitude: number,
    longitude: number,
  ): Promise<ResultadoLinha | null> {
    for (const linha of LINHAS_GPX) {
      if (!linha.arquivo) continue;
      const pontos = await carregarGPX(linha.arquivo, linha.id);
      for (const ponto of pontos) {
        const distancia = distanciaMetros(
          latitude,
          longitude,
          ponto.lat,
          ponto.lng,
        );
        if (distancia <= linha.raioMetros) {
          return {
            linhaId: linha.id.toString(),
            linhaNome: linha.nome,
            pontoUsado: { lat: ponto.lat, lng: ponto.lng, distancia },
          };
        }
      }
    }
    return null;
  }
  return { detectarLinhaPorGPX };
}
