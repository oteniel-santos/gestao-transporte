import { useState, useEffect, useCallback } from "react";
import { normalizeText } from "@/utils/normalize";

export interface StudentSuggestion {
  id: string;
  nome: string;
  nomeBusca: string;
  responsavel: string;
  turma: string;
  escola: string;
}

export function useStudentAutocomplete() {
  const [students, setStudents] = useState<StudentSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/alunos/omega/alunos.json");
        if (!response.ok) {
          throw new Error("Falha ao carregar base de alunos Ômega");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error("Erro ao carregar alunos:", err);
        setError("Não foi possível carregar a base de dados do Ômega.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const search = useCallback((query: string) => {
    if (!query || query.length < 4) return [];

    const normalizedQuery = normalizeText(query);
    return students.filter(student => 
      student.nomeBusca.includes(normalizedQuery)
    ).slice(0, 10); // Limit to top 10 results
  }, [students]);

  return { search, loading, error };
}
