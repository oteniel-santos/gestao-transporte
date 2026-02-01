"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SucessoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const offline = searchParams.get("offline");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center space-y-4">
        <div className="text-5xl">✅</div>

        <h1 className="text-2xl font-bold text-gray-800">
          Cadastro enviado com sucesso!
        </h1>

        {offline && (
          <p className="text-sm text-yellow-600">
            ⚠️ Você estava offline. O envio será concluído quando a conexão
            voltar.
          </p>
        )}

        <p className="text-sm text-gray-600">
          Seu cadastro foi salvo e a mensagem foi enviada pelo WhatsApp.
        </p>

        <button
          onClick={() => router.replace("/")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          ➕ Novo cadastro
        </button>
      </div>
    </div>
  );
}
