"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { LINHAS } from "@/app/cristalino/constants/linhas";
import { getNomeEscola } from "@/constants/escolas";
import { LINHAS_GPX } from "@/app/cristalino/constants/linhas-gpx";
import { carregarGPX } from "@/lib/gpx";
import { Filho, Errors } from "@/types/cadastro";
import { useGeolocalizacao } from "@/hooks/useGeolocalizacao";
import { useDetectarLinha } from "@/hooks/useDetectarLinha";
import SectionTitle from "@/components/SectionTitle";
import AlunosForm from "./AlunosFormCristalino";
import { InputFloating } from "@/components/InputFloating";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";

const MapaLinha = dynamic(() => import("@/components/MapaLinha"), {
  ssr: false,
});

export default function CadastroForm() {
  const router = useRouter();
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

  const {
    latitude,
    longitude,
    localizacaoErro,
    tentouAutomatico,
    carregando,
    obterLocalizacao,
    atualizarPosicaoManual,
  } = useGeolocalizacao();
  const { detectarLinhaPorGPX } = useDetectarLinha();

  const pontoCasa = useMemo(() => {
    if (!latitude || !longitude) return undefined;
    return { lat: latitude, lng: longitude };
  }, [latitude, longitude]);

  const limparErroFilho = (index: number, campo: keyof Filho) => {
    setErrors((prev) => {
      if (!prev.filhos) return prev;
      const novosFilhos = [...prev.filhos];
      if (!novosFilhos[index]) return prev;
      novosFilhos[index] = {
        ...novosFilhos[index],
        [campo]: undefined,
      };
      return {
        ...prev,
        filhos: novosFilhos,
      };
    });
  };

  const responsavelRef = useRef<HTMLInputElement>(null);
  const enderecoRef = useRef<HTMLInputElement>(null);
  const linhaRef = useRef<HTMLInputElement>(null);
  const alunoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const linhaDetectadaRef = useRef(false);
  useEffect(() => {
    if (!latitude || !longitude) return;
    if (linhaDetectadaRef.current) return;
    if (linha) return;
    linhaDetectadaRef.current = true;
    detectarLinhaPorGPX(latitude, longitude).then((res) => {
      //PREENCHE SELECT LINHA AUTOMATICAMENTE
      // if (res) {
      //   setLinha(Number(res.linhaId));
      //   setMensagemLinha("Linha identificada automaticamente.");
      // } else {
      //   setMensagemLinha("Selecione a linha manualmente.");
      // }

      //USUÁRIO DEVE SELECIONAR A LINHA MANUALEMTEN
      setMensagemLinha("Selecione a linha manualmente.");
    });
  }, [latitude, longitude]);

  const limparFormulario = () => {
    setResponsavel("");
    setEndereco("");
    setLinha("");
    setFilhos([{ nome: "", escolaId: "", escolaNome: "", turma: "" }]);
    setErrors({});
  };

  // VALIDAR FORMULÁRIO
  function validarFormulario(): boolean {
    const novosErros: Errors = { filhos: [] };

    if (!responsavel.trim()) {
      novosErros.responsavel = "Informe o nome do responsável";
    }

    if (!endereco.trim()) {
      novosErros.endereco = "Informe o endereço";
    }

    if (!linha) {
      novosErros.linha = "Selecione a linha do transporte";
    }

    if (!latitude || !longitude) {
      //novosErros.localizacao = "Localização obrigatória";
    }

    filhos.forEach((f, i) => {
      const erroFilho: any = {};
      if (!f.nome) erroFilho.nome = "Informe o nome do aluno";
      if (!f.escolaId) erroFilho.escolaId = "Selecione a escola";
      if (!f.turma) erroFilho.turma = "Informe a turma";
      novosErros.filhos![i] = erroFilho;
    });

    setErrors(novosErros);

    // 👇 SCROLL PARA O PRIMEIRO ERRO
    setTimeout(() => {
      if (novosErros.responsavel) {
        responsavelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        responsavelRef.current?.focus();
        return;
      }

      if (novosErros.endereco) {
        enderecoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        enderecoRef.current?.focus();
        return;
      }

      // 3️⃣ PRIMEIRO FILHO COM ERRO
      const indiceFilhoComErro = novosErros.filhos?.findIndex(
        (f) => f && Object.keys(f).length > 0,
      );

      if (indiceFilhoComErro !== undefined && indiceFilhoComErro !== -1) {
        alunoRefs.current[indiceFilhoComErro]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
    }, 100);

    const temErro =
      novosErros.responsavel ||
      novosErros.linha ||
      novosErros.endereco ||
      novosErros.filhos!.some((f) => Object.keys(f).length > 0);

    return !temErro;
  }

  useEffect(() => {
    if (linha) {
      const config = LINHAS_GPX.find((l) => l.id === Number(linha));
      if (!config?.arquivo) {
        setRotaLinha([]);
        return;
      }
      carregarGPX(config.arquivo, config.id).then(setRotaLinha);
    }
  }, [linha]);

  //   const enviar = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!validarFormulario()) return;
  //     setSalvando(true);

  //     const res = await fetch("/api/cadastro", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         responsavel,
  //         endereco,
  //         linha,
  //         latitude,
  //         longitude,
  //         filhos,
  //       }),
  //     });

  //     const data = await res.json();
  //     if (data.ok) {
  //       const d = LINHAS.find((l) => l.id === Number(linha));
  //       const msg = `

  // 🚍*CADASTRO TRANSPORTE ESCOLAR-2026*

  //   *Responsável:* ${responsavel.toUpperCase()}
  //   *Endereço:* ${endereco.toUpperCase()}

  // *DADOS DA LINHA*
  //   🚌 *Linha:* ${d?.nome}
  //   🧑‍✈️ *Motorista:* ${d?.motorista}
  //   📞 *Fone Motorista:* ${d?.telefone}
  //   ( Clique no número acima para falar com o motorista)

  // *LOCALIZAÇÃO*
  //  - Latitude: ${latitude ? latitude : "Não Informada"}
  //  - Longitude: ${longitude ? longitude : "Não Informada"}

  // *ALUNOS:*
  // ${filhos.map((f, i) => `${i + 1} - ${f.nome.toUpperCase()} (${getNomeEscola(f.escolaId)} - ${f.turma})`).join("\n")}
  // ------------------------
  // 📢 CONTATO RESPONSAVEL
  // ${responsavel.toUpperCase()} - ${endereco.toUpperCase()} - ${d?.nome}

  // `;

  //       // window.location.href = `https://wa.me/5566992028229?text=${encodeURIComponent(msg)}`;

  //       window.open(
  //         `https://wa.me/5566992028229?text=${encodeURIComponent(msg)}`,
  //         "_blank",
  //       );

  //       limparFormulario();

  //       setTimeout(() => {
  //         router.replace("/sucesso");
  //       }, 300);
  //     }
  //     setSalvando(false);
  //   };

  //NOVA FUNÇÃO - ENVIAR COM FIREBASE

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setSalvando(true);

    try {
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

      console.log("STATUS API:", res.status);

      const data = await res.json();
      console.log("RETORNO API:", data);

      if (!res.ok) {
        throw new Error("Erro ao salvar cadastro");
      }

      if (!data?.id) {
        throw new Error("ID não retornado pela API");
      }

      // 👉 agora NÃO abre WhatsApp aqui
      router.replace(`/sucesso/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("⚠️ Ocorreu um erro ao enviar o cadastro. Tente novamente.");
    } finally {
      // 🔥 ISSO EVITA O SPINNER ETERNO
      setSalvando(false);
    }
  };

  //NOVA FUNÇÃO - ENVIAR COM FIREBASE

  const inputStyle = (erro?: string) => ({
    border: erro ? "1px solid red" : "1px solid #ccc",
    className: `w-full rounded-md bg-white/5 px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm`,
  });

  return (
    <div className="max-w-xl mx-auto p-2">
      <div className="">
        <img
          alt="Your Company"
          src="/CARD-MODELO.svg"
          className="mx-auto h-20 w-auto"
        />
        <p className="mt-2 text-center text-sm text-gray-700">
          Secretaria Municipal de Educação, Cultura, Esporte e Lazer <br />
          Novo Mundo - MT
        </p>
        <h2 className="p-2  text-center text-2xl font-bold tracking-tight text-cyan-900 rounded-4xl">
          CADASTRO TRANSPORTE ESCOLAR 2026 (CRISTALINO)
        </h2>
        <p className="text-center text-sm/6 text-gray-400 border-b-2 border-b-cyan-700">
          Preencha seus dados para realizar seu cadastro no Transporte Escolar
        </p>
      </div>

      <form onSubmit={enviar} className="space-y-6 mt-6">
        <SectionTitle number={1} title="Responsável" />
        <div className="space-y-1 relative">
          <InputFloating
            label="Nome do Responsável"
            ref={responsavelRef}
            value={responsavel}
            error={errors.responsavel}
            onChange={(e) => {
              setResponsavel(e.target.value);
              setErrors((prev) => ({ ...prev, responsavel: undefined }));
            }}
          />
        </div>
        <div>
          <InputFloating
            label="Endereço (nome da Fazenda, Sitio ou Chácara)"
            ref={enderecoRef}
            value={endereco}
            error={errors.endereco}
            onChange={(e) => {
              setEndereco(e.target.value);
              setErrors((prev) => ({ ...prev, endereco: undefined }));
            }}
          />
        </div>

        <div className="pt-8 ">
          <SectionTitle number={2} title="Alunos" />
          <AlunosForm
            filhos={filhos}
            setFilhos={setFilhos}
            errors={errors}
            alunoRefs={alunoRefs}
            limparErroFilho={limparErroFilho}
          />
        </div>

        <SectionTitle number={3} title="Linha" />
        <div>
          <select
            name="linhas"
            className={`
                      block w-full 
                      rounded-md border 
                      px-3 
                      py-2.5 
                      text-base
                      bg-white/5
                      text-gray-600 
                     border-gray-500
                      -outline-offset-1
                      placeholder:text-gray-500
                      focus:outline-2 
                      focus:-outline-offset-2
                      focus:outline-indigo-500 
                      sm:text-sm 
                      ${errors.linha ? "border border-red-500" : ""}`}
            value={linha}
            onChange={(e) => {
              setLinha(Number(e.target.value));
              setErrors((prev) => ({ ...prev, linha: undefined }));
            }}
          >
            <option value="">Selecione uma linha</option>
            {LINHAS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome} - Motorista: {l.motorista}
              </option>
            ))}
          </select>

          {errors.linha && (
            <p className="text-red-500 text-xs leading-tight">{errors.linha}</p>
          )}

          {rotaLinha.length > 0 && (
            <p className="text-xs ">
              Ao selecionar uma linha, o trajeto dela será mostrado no mapa
              abaixo. Você pode usa-lo para conferir qual a linha mais adequada
              para você.
            </p>
          )}
        </div>
        <div>
          <div className="h-96 border rounded flex items-center justify-center bg-gray-50 text-gray-600 text-sm relative overflow-hidden">
            {localizacaoErro ? (
              <div>
                <p className="text-center px-4">
                  🚫 A localização está bloqueada no navegador.
                  <br />
                  Clique no ícone de cadeado na barra de endereço e permita o
                  acesso.
                </p>

                <button
                  type="button"
                  onClick={() => obterLocalizacao(false)}
                  disabled={carregando}
                  className="w-full border-0 bg-yellow-300 p-2 rounded text-sm text-gray-900 hover:bg-yellow-400 mt-4 font-bold"
                >
                  {carregando
                    ? "Carregando localização..."
                    : " Tentar usar minha localização novamente"}
                </button>
              </div>
            ) : pontoCasa ? (
              <MapaLinha
                rota={rotaLinha}
                pontoCasa={pontoCasa}
                tipoMapa={tipoMapa}
                atualizarPosicaoManual={atualizarPosicaoManual}
              />
            ) : (
              <p className="text-center px-4">
                Obtendo localização automaticamente…
              </p>
            )}
          </div>

          <p className="text-xs">
            <span className="font-bold">
              O marcado azul indica a posição da sua casa.
            </span>{" "}
            Caso ela esteja incorreta,{" "}
            <b>arraste o marcador azul para o local exato de onde você mora.</b>{" "}
            Utilize a visão de satélite para facilitar sua visualização{" "}
          </p>
        </div>
        {/* BOTÕES DE CONTROLE DO MAPA */}
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => setTipoMapa("mapa")}
            className={`px-4 py-1 rounded border text-sm ${
              tipoMapa === "mapa"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
          >
            🗺️ Mapa
          </button>

          <button
            type="button"
            onClick={() => setTipoMapa("satelite")}
            className={`px-4 py-1 rounded border text-sm ${
              tipoMapa === "satelite"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
          >
            🛰️ Satélite
          </button>
        </div>

        {latitude && longitude && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            <span>Latitude: {latitude.toFixed(6)}</span>
            {" · "}
            <span>Longitude: {longitude.toFixed(6)}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={salvando}
          className={`
    w-full
    flex
    items-center
    justify-center
    gap-2
    bg-blue-600
    text-white
    p-3
    rounded
    transition
    ${salvando ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}
  `}
        >
          {salvando ? (
            <>
              <Spinner />
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </button>
      </form>
      <p className="mt-10 text-center text-sm/6 text-gray-400">
        Algum problema para preencher o cadastro? <br />
        <a
          href="https://wa.me/5566992028229?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20para%20preencher%20o%20cadastro%20do%20transporte%20escolar."
          className="font-semibold text-indigo-600 hover:text-indigo-900"
        >
          Converse com o Suporte
        </a>
      </p>
    </div>
  );
}
