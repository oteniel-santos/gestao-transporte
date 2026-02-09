import CadastroFormCristalino from "./components/CadastroFormCristalino";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CadastroFormCristalino />
      <div className="text-center mt-10 mb-4 text-xs">
        Desenvolvido por:
        <a
          href="https://wa.me/5566992028229"
          className="font-semibold text-shadow-blue-500 hover:text-indigo-900"
        >
          Oteniel Santos
        </a>
        - Departamento de Transporte Escolar
      </div>
    </main>
  );
}
