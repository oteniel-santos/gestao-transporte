import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { normalizeText } from "../src/utils/normalize";

const DADOS_OMEGA_DIR = path.join(__dirname, "../dados_omega");
const OUTPUT_DIR = path.join(__dirname, "../public/alunos/omega");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "alunos.json");

// Define column indices based on manual verification
const COL_INDICES = {
  ID: 438,
  NOME: 10,
  RESPONSAVEL: 268,
  TURMA: 33,
  ESCOLA: 30,
  SITUACAO: 15,
  SERIE: 31,
  AEE: 39
};

interface Student {
  id: string;
  nome: string;
  nomeBusca: string;
  responsavel: string;
  turma: string;
  escola: string;
}

async function extractData() {
  console.log("Iniciando extração de dados do Sistema Ômega com filtros...");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Diretório criado: ${OUTPUT_DIR}`);
  }

  const files = fs.readdirSync(DADOS_OMEGA_DIR).filter(file => file.toLowerCase().endsWith(".csv"));
  console.log(`Arquivos encontrados: ${files.join(", ")}`);

  const allStudents: Student[] = [];

  for (const file of files) {
    console.log(`Processando arquivo: ${file}`);
    const filePath = path.join(DADOS_OMEGA_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    try {
      const records = parse(fileContent, {
        delimiter: "|",
        skip_empty_lines: true,
        from_line: 2, // Skip header
        bom: true
      });

      console.log(`  Registros totais no arquivo ${file}: ${records.length}`);

      let fileAddedCount = 0;
      for (const record of records) {
        const id = record[COL_INDICES.ID];
        const nome = record[COL_INDICES.NOME];
        const responsavel = record[COL_INDICES.RESPONSAVEL];
        const turma = record[COL_INDICES.TURMA];
        const escola = record[COL_INDICES.ESCOLA];
        const situacao = record[COL_INDICES.SITUACAO];
        const serie = record[COL_INDICES.SERIE] || "";
        const aee = record[COL_INDICES.AEE];

        // Apply filters
        if (situacao !== "CURSANDO") continue;
        if (aee === "S") continue;
        if (serie.toUpperCase().includes("ATIVIDADE COMPLEMENTAR")) continue;

        if (nome && id) {
          allStudents.push({
            id: id,
            nome: nome,
            nomeBusca: normalizeText(nome),
            responsavel: responsavel || "",
            turma: turma || "",
            escola: escola || ""
          });
          fileAddedCount++;
        }
      }
      console.log(`  Alunos adicionados do arquivo ${file}: ${fileAddedCount}`);
    } catch (error) {
      console.error(`  Erro ao processar o arquivo ${file}:`, error);
    }
  }

  console.log(`Total de alunos extraídos: ${allStudents.length}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allStudents, null, 2), "utf-8");
  console.log(`Arquivo salvo em: ${OUTPUT_FILE}`);
}

extractData().catch(console.error);
