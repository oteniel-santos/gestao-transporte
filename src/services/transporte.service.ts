import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Tipagem dos dados do formulário
export interface TransporteFormData {
  nomeAluno: string;
  endereco: string;
  escola: string;
  turno: string;
  motorista: string;
  rota: string;
}

export async function salvarCadastroTransporte(dados: TransporteFormData) {
  try {
    const docRef = await addDoc(collection(db, "cadastrosTransporte"), {
      ...dados,
      createdAt: Timestamp.now(),
    });

    return {
      sucesso: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Erro ao salvar transporte:", error);
    return {
      sucesso: false,
      erro: error,
    };
  }
}
