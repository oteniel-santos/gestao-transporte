import { adminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function salvarCadastro(dados: any) {
  const batch = adminDb.batch();
  
  // 1. Criar referência para o cadastro principal
  const cadastroRef = adminDb.collection("cadastrosTransporte").doc();
  
  batch.set(cadastroRef, {
    ...dados,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  });

  // 2. Criar entradas individuais para cada aluno na coleção dados_transporte
  if (dados.filhos && Array.isArray(dados.filhos)) {
    dados.filhos.forEach((filho: any) => {
      const alunoRef = adminDb.collection("dados_transporte").doc();
      
      batch.set(alunoRef, {
        aluno_nome: filho.nome || "",
        ativo: true,
        cadastro_id: cadastroRef.id,
        endereco: dados.endereco || "",
        escola_id: filho.escolaId || "",
        escola_nome: filho.escolaNome || "",
        id_omega: filho.omegaId || "",
        latitude: dados.latitude || null,
        linha_id: dados.linha || "",
        linha_nome: dados.linhaNome || "",
        longitude: dados.longitude || null,
        responsavel_cadastro: dados.responsavel || "",
        responsavel_omega: filho.omegaResponsavel || "",
        turma: filho.turma || "",
        updatedAt: admin.firestore.Timestamp.now(),
      });
    });
  }

  // 3. Executar o batch
  await batch.commit();

  return cadastroRef.id;
}
