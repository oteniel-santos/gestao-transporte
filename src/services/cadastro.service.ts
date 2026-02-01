import { adminDb } from "@/lib/firebase-admin";

export async function salvarCadastro(dados: any) {
  const docRef = await adminDb.collection("cadastrosTransporte").add({
    ...dados,
    createdAt: new Date(),
  });

  return docRef.id;
}
