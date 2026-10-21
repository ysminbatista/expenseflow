"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, api, type Category } from "@/lib/api";

export default function Categorias() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [novaCategoria, setNovaCategoria] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nomeEditando, setNomeEditando] = useState("");

  // RN05: categoria em uso precisa de uma categoria de destino
  const [removendo, setRemovendo] = useState<Category | null>(null);
  const [destinoId, setDestinoId] = useState("");

  const carregar = useCallback(async () => {
    try {
      setCategorias(await api<Category[]>("/categories"));
      setErro("");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro inesperado");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  // Executa uma acao na API e recarrega a lista; devolve true se deu certo
  async function executar(acao: () => Promise<unknown>) {
    setErro("");
    try {
      await acao();
      await carregar();
      return true;
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro inesperado");
      return false;
    }
  }

  async function adicionarCategoria(e: React.FormEvent) {
    e.preventDefault();
    const nome = novaCategoria.trim();
    if (!nome) {
      setErro("Digite o nome da categoria.");
      return;
    }
    const ok = await executar(() =>
      api("/categories", { method: "POST", body: { name: nome } }),
    );
    if (ok) setNovaCategoria("");
  }

  function iniciarEdicao(categoria: Category) {
    setEditandoId(categoria.id);
    setNomeEditando(categoria.name);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNomeEditando("");
  }

  async function salvarEdicao() {
    if (editandoId === null) return;
    const nome = nomeEditando.trim();
    if (!nome) {
      setErro("Digite o nome da categoria.");
      return;
    }
    const ok = await executar(() =>
      api(`/categories/${editandoId}`, {
        method: "PATCH",
        body: { name: nome },
      }),
    );
    if (ok) cancelarEdicao();
  }

  async function excluirCategoria(categoria: Category) {
    if (!window.confirm(`Deseja excluir a categoria "${categoria.name}"?`)) {
      return;
    }
    setErro("");
    try {
      await api(`/categories/${categoria.id}`, { method: "DELETE" });
      await carregar();
    } catch (err) {
      // 409: categoria em uso, pede o destino das movimentacoes
      if (err instanceof ApiError && err.status === 409) {
        setRemovendo(categoria);
        setDestinoId("");
      } else {
        setErro(err instanceof ApiError ? err.message : "Erro inesperado");
      }
    }
  }

  async function confirmarRemocao() {
    if (!removendo || !destinoId) return;
    const ok = await executar(() =>
      api(`/categories/${removendo.id}?reassignTo=${destinoId}`, {
        method: "DELETE",
      }),
    );
    if (ok) setRemovendo(null);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">ExpenseFlow</h1>

        <h2 className="mt-2 text-xl text-gray-800">Minhas categorias</h2>

        {erro && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {erro}
          </p>
        )}

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-900">
            Nova categoria
          </h3>

          <form
            onSubmit={adicionarCategoria}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={novaCategoria}
              maxLength={50}
              onChange={(e) => setNovaCategoria(e.target.value)}
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

        {removendo && (
          <div className="mt-6 rounded-xl border border-yellow-300 bg-yellow-50 p-6">
            <p className="font-medium text-gray-900">
              A categoria &quot;{removendo.name}&quot; esta sendo usada em
              movimentacoes. Para exclui-la, escolha para qual categoria elas
              serao movidas:
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <select
                value={destinoId}
                onChange={(e) => setDestinoId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
              >
                <option value="">Selecione a categoria de destino</option>
                {categorias
                  .filter((c) => c.id !== removendo.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                disabled={!destinoId}
                onClick={confirmarRemocao}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Mover e excluir
              </button>

              <button
                type="button"
                onClick={() => setRemovendo(null)}
                className="rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-900">
            Categorias cadastradas
          </h3>

          <div className="mt-4 space-y-3">
            {carregando && <p className="text-gray-700">Carregando...</p>}

            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-4"
              >
                {editandoId === categoria.id ? (
                  <div className="flex flex-1 flex-wrap gap-3">
                    <input
                      type="text"
                      value={nomeEditando}
                      maxLength={50}
                      onChange={(e) => setNomeEditando(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
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
                    <p className="min-w-0 break-words font-medium text-gray-900">
                      {categoria.name}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(categoria)}
                        className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => excluirCategoria(categoria)}
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
