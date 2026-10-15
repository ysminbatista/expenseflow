"use client";

import { useEffect, useState } from "react";

export default function Categorias() {
  const [categorias, setCategorias] = useState<string[]>([
    "Trabalho",
    "Casa",
    "Transporte",
    "Alimentacao",
    "Outros",
  ]);

  const [novaCategoria, setNovaCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState<string | null>(
    null
  );
  const [nomeEditando, setNomeEditando] = useState("");

  useEffect(() => {
    const categoriasSalvas = localStorage.getItem("categorias");

    if (categoriasSalvas) {
      setCategorias(JSON.parse(categoriasSalvas));
    } else {
      localStorage.setItem(
        "categorias",
        JSON.stringify(categorias)
      );
    }
  }, []);

  function adicionarCategoria(e: React.FormEvent) {
    e.preventDefault();

    const nome = novaCategoria.trim();

    if (!nome) {
      alert("Digite o nome da categoria.");
      return;
    }

    const categoriaJaExiste = categorias.some(
      (categoria) =>
        categoria.toLowerCase() === nome.toLowerCase()
    );

    if (categoriaJaExiste) {
      alert("Essa categoria ja existe.");
      return;
    }

    const novasCategorias = [...categorias, nome];

    setCategorias(novasCategorias);

    localStorage.setItem(
      "categorias",
      JSON.stringify(novasCategorias)
    );

    setNovaCategoria("");
  }

  function iniciarEdicao(categoria: string) {
    setCategoriaEditando(categoria);
    setNomeEditando(categoria);
  }

  function cancelarEdicao() {
    setCategoriaEditando(null);
    setNomeEditando("");
  }

  function salvarEdicao() {
    if (!categoriaEditando) {
      return;
    }

    const novoNome = nomeEditando.trim();

    if (!novoNome) {
      alert("Digite o nome da categoria.");
      return;
    }

    const categoriaJaExiste = categorias.some(
      (categoria) =>
        categoria !== categoriaEditando &&
        categoria.toLowerCase() === novoNome.toLowerCase()
    );

    if (categoriaJaExiste) {
      alert("Essa categoria ja existe.");
      return;
    }

    const novasCategorias = categorias.map((categoria) =>
      categoria === categoriaEditando
        ? novoNome
        : categoria
    );

    setCategorias(novasCategorias);

    localStorage.setItem(
      "categorias",
      JSON.stringify(novasCategorias)
    );

    const movimentacoesSalvas =
      localStorage.getItem("movimentacoes");

    if (movimentacoesSalvas) {
      const movimentacoes = JSON.parse(movimentacoesSalvas);

      const novasMovimentacoes = movimentacoes.map(
        (movimentacao: {
          categoria: string;
        }) => {
          if (movimentacao.categoria === categoriaEditando) {
            return {
              ...movimentacao,
              categoria: novoNome,
            };
          }

          return movimentacao;
        }
      );

      localStorage.setItem(
        "movimentacoes",
        JSON.stringify(novasMovimentacoes)
      );
    }

    cancelarEdicao();
  }

  function excluirCategoria(categoria: string) {
    const movimentacoesSalvas =
      localStorage.getItem("movimentacoes");

    if (movimentacoesSalvas) {
      const movimentacoes = JSON.parse(movimentacoesSalvas);

      const categoriaEmUso = movimentacoes.some(
        (movimentacao: {
          categoria: string;
        }) => movimentacao.categoria === categoria
      );

      if (categoriaEmUso) {
        alert(
          "Nao e possivel excluir esta categoria porque ela esta sendo usada em uma movimentacao."
        );
        return;
      }
    }

    const confirmou = window.confirm(
      `Deseja excluir a categoria "${categoria}"?`
    );

    if (!confirmou) {
      return;
    }

    const novasCategorias = categorias.filter(
      (item) => item !== categoria
    );

    setCategorias(novasCategorias);

    localStorage.setItem(
      "categorias",
      JSON.stringify(novasCategorias)
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">
          ExpenseFlow
        </h1>

        <h2 className="mt-2 text-xl text-gray-800">
          Minhas categorias
        </h2>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-900">
            Nova categoria
          </h3>

          <form
            onSubmit={adicionarCategoria}
            className="mt-4 flex gap-3"
          >
            <input
              type="text"
              value={novaCategoria}
              onChange={(e) =>
                setNovaCategoria(e.target.value)
              }
              placeholder="Nome da categoria"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Adicionar
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-900">
            Categorias cadastradas
          </h3>

          <div className="mt-4 space-y-3">
            {categorias.map((categoria) => (
              <div
                key={categoria}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4"
              >
                {categoriaEditando === categoria ? (
                  <div className="flex flex-1 gap-3">
                    <input
                      type="text"
                      value={nomeEditando}
                      onChange={(e) =>
                        setNomeEditando(e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={salvarEdicao}
                      className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    >
                      Salvar
                    </button>

                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      className="rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-gray-900">
                      {categoria}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          iniciarEdicao(categoria)
                        }
                        className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          excluirCategoria(categoria)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}