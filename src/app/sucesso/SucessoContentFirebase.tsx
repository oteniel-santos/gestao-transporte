"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LINHAS } from "@/constants/linhas";
import { getNomeEscola } from "@/constants/escolas";

export default function SucessoContentFirebase() {
  const { id } = useParams<{ id: string }>();
  console.log("ID SUCESSO:", id);

  const router = useRouter();

  const [cadastro, setCadastro] = useState<any>(null);
  const [contador, setContador] = useState(5);

  // 1️⃣ Buscar dados do cadastro
  useEffect(() => {
    if (!id) return;

    fetch(`/api/cadastro/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar cadastro");
        return res.json();
      })
      .then(setCadastro)
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // 2️⃣ Contador regressivo
  useEffect(() => {
    if (!cadastro) return;

    if (contador <= 0) {
      redirecionarWhatsapp();
      return;
    }

    const timer = setTimeout(() => {
      setContador((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [contador, cadastro]);

  // 3️⃣ Montar mensagem REAL
  if (!cadastro) {
    return <p className="p-6 text-center">Carregando dados…</p>;
  }
  const linha = LINHAS.find((l) => l.id === Number(cadastro.linha));
  const mensagem = `

    🚍*CADASTRO TRANSPORTE ESCOLAR-2026*

     *Responsável:* ${cadastro.responsavel.toUpperCase()}
     *Endereço:* ${cadastro.endereco.toUpperCase()}

   *DADOS DA LINHA*
     🚌 *Linha:* ${linha?.nome}
     🧑‍✈️ *Motorista:* ${linha?.motorista}
     📞 *Fone Motorista:* ${linha?.telefone}
     ( Clique no número acima para falar com o motorista)

 *LOCALIZAÇÃO*
    - Latitude: ${cadastro.latitude ? cadastro.latitude : "Não Informada"}
    - Longitude: ${cadastro.longitude ? cadastro.longitude : "Não Informada"}

   *ALUNOS:*
   ${cadastro.filhos.map((f: { nome: string; escolaId: number; turma: any }, i: number) => `${i + 1} - ${f.nome.toUpperCase()} (${getNomeEscola(f.escolaId)} - ${f.turma})`).join("\n")}
   ------------------------
   📢 CONTATO RESPONSAVEL
   ${cadastro.responsavel.toUpperCase()} - ${cadastro.endereco.toUpperCase()} - Linha: ${linha?.nome}

   `;

  const whatsappUrl = `https://wa.me/5566992028229?text=${encodeURIComponent(
    mensagem,
  )}`;

  const redirecionarWhatsapp = () => {
    window.location.replace(whatsappUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center space-y-4">
        <div className="text-4xl">🚍</div>

        <h1 className="text-xl font-bold">Cadastro salvo com sucesso</h1>

        <p className="text-sm text-gray-600">
          Você será redirecionado para o WhatsApp em
        </p>

        <div className="text-3xl font-bold text-green-600">{contador}</div>

        <p className="text-sm text-gray-600">
          Ao abrir o WhatsApp, toque em <strong>ENVIAR</strong> para concluir.
        </p>

        <button
          onClick={redirecionarWhatsapp}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
        >
          📲 Enviar agora pelo WhatsApp
        </button>
      </div>
    </div>
  );
}
