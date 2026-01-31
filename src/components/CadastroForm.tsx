"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { LINHAS } from "@/constants/linhas";
import { getNomeEscola } from "@/constants/escolas";
import { LINHAS_GPX } from "@/constants/linhas-gpx";
import { carregarGPX } from "@/lib/gpx";
import { Filho, Errors } from "@/types/cadastro";
import { useGeolocalizacao } from "@/hooks/useGeolocalizacao";
import { useDetectarLinha } from "@/hooks/useDetectarLinha";
import SectionTitle from "./SectionTitle";
import AlunosForm from "./AlunosForm";

const MapaLinha = dynamic(() => import("./MapaLinha"), { ssr: false });

export default function CadastroForm() {
  const [responsavel, setResponsavel] = useState("");
  const [endereco, setEndereco] = useState("");
  const [linha, setLinha] = useState<number | "">("");
  const [filhos, setFilhos] = useState<Filho[]>([
    { nome: "", escolaId: "", escolaNome: "", turma: "" },
  ]);
  const [errors, setErrors] = useState<Errors>({});
  const [salvando, setSalvando] = useState(false);
  const [tipoMapa, setTipoMapa] = useState<"mapa" | "satelite">("mapa");
  const [rotaLinha, setRotaLinha] = useState<{ lat: number; lng: number }[]>(
    [],
  );
  const [mensagemLinha, setMensagemLinha] = useState("");

  const { latitude, longitude } = useGeolocalizacao();
  const { detectarLinhaPorGPX } = useDetectarLinha();

  const pontoCasa = useMemo(() => {
    if (!latitude || !longitude) return undefined;
    return { lat: latitude, lng: longitude };
  }, [latitude, longitude]);

  const linhaDetectadaRef = useRef(false);
  useEffect(() => {
    if (!latitude || !longitude) return;
    if (linhaDetectadaRef.current) return;
    if (linha) return;
    linhaDetectadaRef.current = true;
    detectarLinhaPorGPX(latitude, longitude).then((res) => {
      if (res) {
        setLinha(Number(res.linhaId));
        setMensagemLinha("Linha identificada automaticamente.");
      } else {
        setMensagemLinha("Selecione a linha manualmente.");
      }
    });
  }, [latitude, longitude]);

  useEffect(() => {
    if (linha) {
      const config = LINHAS_GPX.find((l) => l.id === Number(linha));
      if (config?.arquivo)
        carregarGPX(config.arquivo, config.id).then(setRotaLinha);
    }
  }, [linha]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    const res = await fetch("/api/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responsavel,
        endereco,
        linha,
        latitude,
        longitude,
        filhos,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      const d = LINHAS.find((l) => l.id === Number(linha));
      const msg = `*CADASTRO 2026*\n*Responsável:* ${responsavel}\n*Linha:* ${d?.nome}\n*Alunos:*\n${filhos.map((f) => `- ${f.nome} (${getNomeEscola(f.escolaId)})`).join("\n")}`;
      window.location.href = `https://wa.me/5566992028229?text=${encodeURIComponent(msg)}`;
    }
    setSalvando(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={enviar} className="space-y-6">
        <SectionTitle number={1} title="Responsável" />
        <input
          className="w-full border p-2"
          placeholder="Nome"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
        />
        <input
          className="w-full border p-2"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
        <SectionTitle number={2} title="Alunos" />
        <AlunosForm filhos={filhos} setFilhos={setFilhos} errors={errors} />
        <SectionTitle number={3} title="Linha" />
        <select
          className="w-full border p-2"
          value={linha}
          onChange={(e) => setLinha(Number(e.target.value))}
        >
          <option value="">Selecione uma linha</option>
          {LINHAS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome}
            </option>
          ))}
        </select>
        <div className="h-64 border">
          {rotaLinha.length > 0 && latitude && (
            <MapaLinha
              rota={rotaLinha}
              pontoCasa={pontoCasa}
              tipoMapa={tipoMapa}
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {salvando ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
