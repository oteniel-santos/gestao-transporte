"use client";
import { Filho } from "@/types/cadastro";
import { ESCOLAS, selecionarTurmas } from "@/constants/escolas";
import { Dispatch, SetStateAction } from "react";

type AlunosFormProps = {
  filhos: Filho[];
  setFilhos: Dispatch<SetStateAction<Filho[]>>;
  errors: any;
};

export default function AlunosForm({
  filhos,
  setFilhos,
  errors,
}: AlunosFormProps) {
  const adicionarFilho = () => {
    setFilhos([
      ...filhos,
      { nome: "", escolaId: "", escolaNome: "", turma: "" },
    ]);
  };
  const removerFilho = (index: number) => {
    setFilhos(filhos.filter((_, i) => i !== index));
  };
  const atualizarFilho = (index: number, campo: keyof Filho, valor: any) => {
    const novaLista = [...filhos];
    novaLista[index] = { ...novaLista[index], [campo]: valor };
    setFilhos(novaLista);
  };

  return (
    <div className="space-y-4 mt-2">
      {filhos.map((filho, index) => (
        <div
          key={index}
          className="relative border border-gray-200 bg-white rounded-lg p-4 shadow-sm"
        >
          <label className="block text-sm font-medium text-gray-700">
            Nome do Aluno
          </label>
          <input
            className="block w-full rounded-md border px-3 py-2"
            value={filho.nome}
            onChange={(e) => atualizarFilho(index, "nome", e.target.value)}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Escola
            </label>
            <select
              className="block w-full rounded-md border px-3 py-2"
              value={filho.escolaId}
              onChange={(e) =>
                atualizarFilho(index, "escolaId", Number(e.target.value))
              }
            >
              <option value="">Selecione a escola</option>
              {ESCOLAS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Série
            </label>
            <select
              className="block w-full rounded-md border px-3 py-2"
              disabled={!filho.escolaId}
              value={filho.turma}
              onChange={(e) => atualizarFilho(index, "turma", e.target.value)}
            >
              <option value="">
                {filho.escolaId
                  ? "Selecione a Série"
                  : "Selecione a escola primeiro"}
              </option>
              {filho.escolaId &&
                selecionarTurmas(filho.escolaId).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          </div>
          {filhos.length > 1 && (
            <button
              type="button"
              onClick={() => removerFilho(index)}
              className="absolute top-2 right-2 text-red-500"
            >
              Remover
            </button>
          )}
        </div>
      ))}
      <button
        onClick={adicionarFilho}
        type="button"
        className="w-full border-2 border-dotted p-3 text-blue-600"
      >
        + Adicionar aluno
      </button>
    </div>
  );
}
