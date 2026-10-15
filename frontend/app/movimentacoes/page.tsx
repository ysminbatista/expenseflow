"use client";

import { useEffect, useState } from "react";

type Movimentacao = {
  id: number;
  tipo: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
};

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  const [categorias, setCategorias] = useState<string[]>([
    "Trabalho",
    "Casa",
    "Transporte",
    "Alimentacao",
    "Outros",
  ]);

  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    const movimentacoesSalvas =
      localStorage.getItem("movimentacoes");

    if (movimentacoesSalvas) {
      setMovimentacoes(JSON.parse(movimentacoesSalvas));
    }

    const categoriasSalvas =
      localStorage.getItem("categorias");

    if (categoriasSalvas) {
      setCategorias(JSON.parse(categoriasSalvas));
    }
  }, []);

  function excluirMovimentacao(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta movimentacao?"
    );

    if (!confirmar) {
      return;
    }

    const novasMovimentacoes = movimentacoes.filter(
      (movimentacao) => movimentacao.id !== id
    );

    setMovimentacoes(novasMovimentacoes);

    localStorage.setItem(
      "movimentacoes",
      JSON.stringify(novasMovimentacoes)
    );
  }

  const movimentacoesFiltradas = movimentacoes.filter(
    (movimentacao) => {
      const correspondeCategoria =
        categoriaFiltro === "" ||
        movimentacao.categoria === categoriaFiltro;

      const correspondeDataInicial =
        dataInicial === "" ||
        movimentacao.data >= dataInicial;

      const correspondeDataFinal =
        dataFinal === "" ||
        movimentacao.data <= dataFinal;

      return (
        correspondeCategoria &&
        correspondeDataInicial &&
        correspondeDataFinal
      );
    }
  );

  function limparFiltros() {
    setCategoriaFiltro("");
    setDataInicial("");
    setDataFinal("");
  }

  function exportarCSV() {
    if (movimentacoesFiltradas.length === 0) {
      alert("Nao existem movimentacoes para exportar.");
      return;
    }

    const cabecalho =
      "Tipo;Descricao;Valor;Categoria;Data";

    const linhas = movimentacoesFiltradas.map(
      (movimentacao) => {
        return [
          movimentacao.tipo,
          movimentacao.descricao,
          movimentacao.valor.toFixed(2),
          movimentacao.categoria,
          movimentacao.data,
        ]
          .map(
            (valor) =>
              `"${String(valor).replace(/"/g, '""')}"`
          )
          .join(";");
      }
    );

    const conteudoCSV = [
      cabecalho,
      ...linhas,
    ].join("\n");

    const arquivo = new Blob(
      [conteudoCSV],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(arquivo);

    const link = document.createElement("a");

    link.href = url;
    link.download = "movimentacoes.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">
          ExpenseFlow
        </h1>

        <h2 className="mt-2 text-xl text-gray-800">
          Minhas movimentacoes
        </h2>

        {movimentacoes.length > 0 && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Filtros
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Categoria
                </label>

                <select
                  value={categoriaFiltro}
                  onChange={(e) =>
                    setCategoriaFiltro(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                >
                  <option value="">
                    Todas as categorias
                  </option>

                  {categorias.map((categoria) => (
                    <option
                      key={categoria}
                      value={categoria}
                    >
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Data inicial
                </label>

                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) =>
                    setDataInicial(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Data final
                </label>

                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) =>
                    setDataFinal(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={limparFiltros}
                className="rounded-lg bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-900"
              >
                Limpar filtros
              </button>

              <button
                onClick={exportarCSV}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Exportar CSV
              </button>
            </div>
          </div>
        )}

        {movimentacoes.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-6 text-center shadow">
            <p className="text-gray-700">
              Nenhuma movimentacao cadastrada.
            </p>

            <a
              href="/nova-movimentacao"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Nova movimentacao
            </a>
          </div>
        ) : movimentacoesFiltradas.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-6 text-center shadow">
            <p className="font-medium text-gray-800">
              Nenhuma movimentacao encontrada com esses filtros.
            </p>

            <button
              onClick={limparFiltros}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {movimentacoesFiltradas.map((movimentacao) => (
              <div
                key={movimentacao.id}
                className="rounded-xl bg-white p-5 shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {movimentacao.descricao}
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      {movimentacao.categoria} -{" "}
                      {movimentacao.data}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        movimentacao.tipo === "entrada"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {movimentacao.tipo === "entrada"
                        ? "+"
                        : "-"}{" "}
                      R$ {movimentacao.valor.toFixed(2)}
                    </p>

                    <button
                      onClick={() =>
                        excluirMovimentacao(movimentacao.id)
                      }
                      className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>

                    <button
                      onClick={() => {
                        window.location.href = `/editar-movimentacao?id=${movimentacao.id}`;
                      }}
                      className="mt-2 ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}