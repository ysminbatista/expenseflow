"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CategoryBadge from "@/components/CategoryBadge";
import { useToast } from "@/components/Toast";
import { ApiError, api, type Category } from "@/lib/api";

const inputClass =
  "rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function Categorias() {
  const toast = useToast();
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

  // Executa uma ação na API e recarrega a lista; devolve true se deu certo
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
    if (ok) {
      setNovaCategoria("");
      toast(`Categoria "${nome}" criada!`);
    }
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
    if (ok) {
      cancelarEdicao();
      toast("Categoria atualizada!");
    }
  }

  async function excluirCategoria(categoria: Category) {
    if (!window.confirm(`Deseja excluir a categoria "${categoria.name}"?`)) {
      return;
    }
    setErro("");
    try {
      await api(`/categories/${categoria.id}`, { method: "DELETE" });
      await carregar();
      toast("Categoria excluída.", "info");
    } catch (err) {
      // 409: categoria em uso, pede o destino das movimentações
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
    if (ok) {
      setRemovendo(null);
      toast("Movimentações movidas e categoria excluída.", "info");
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Minhas categorias
        </h1>
        <p className="mt-1 text-gray-600">
          Organize as suas movimentações do jeito que fizer sentido para você.
        </p>
      </div>

      {erro && (
        <p
          role="alert"
          className="mt-4 animate-pop rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          {erro}
        </p>
      )}

      <section className="mt-6 animate-fade-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Nova categoria</h2>

        <form
          onSubmit={adicionarCategoria}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            aria-label="Nome da nova categoria"
            value={novaCategoria}
            maxLength={50}
            onChange={(e) => setNovaCategoria(e.target.value)}
            placeholder="Ex.: Saúde, Lazer, Pets"
            className={`${inputClass} flex-1`}
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Adicionar
          </button>
        </form>
      </section>

      {removendo && (
        <section
          role="alertdialog"
          aria-label="Escolha o destino das movimentações"
          className="mt-6 animate-pop rounded-2xl border border-amber-300 bg-amber-50 p-6"
        >
          <p className="font-medium text-gray-900">
            A categoria &quot;{removendo.name}&quot; está sendo usada em
            movimentações. Para excluí-la, escolha para qual categoria elas
            serão movidas:
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <select
              aria-label="Categoria de destino"
              value={destinoId}
              onChange={(e) => setDestinoId(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900"
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
              className="rounded-xl bg-rose-600 px-4 py-2.5 font-semibold text-white transition hover:bg-rose-700 active:scale-95 disabled:opacity-50"
            >
              Mover e excluir
            </button>

            <button
              type="button"
              onClick={() => setRemovendo(null)}
              className="rounded-xl bg-gray-500 px-4 py-2.5 font-semibold text-white transition hover:bg-gray-600 active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </section>
      )}

      <section className="mt-6 animate-fade-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Categorias cadastradas
        </h2>

        {carregando && (
          <p className="mt-4 text-gray-600">Carregando...</p>
        )}

        <ul className="mt-4 space-y-3">
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className="flex animate-pop flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30"
            >
              {editandoId === categoria.id ? (
                <div className="flex flex-1 flex-wrap gap-3">
                  <input
                    type="text"
                    aria-label="Novo nome da categoria"
                    value={nomeEditando}
                    maxLength={50}
                    onChange={(e) => setNomeEditando(e.target.value)}
                    className={`${inputClass} min-w-0 flex-1 py-2`}
                  />

                  <button
                    type="button"
                    onClick={salvarEdicao}
                    className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                  >
                    Salvar
                  </button>

                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    className="rounded-xl bg-gray-500 px-4 py-2 font-semibold text-white transition hover:bg-gray-600 active:scale-95"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <p className="flex min-w-0 items-center gap-3 font-medium text-gray-900">
                    <CategoryBadge name={categoria.name} />
                    <span className="min-w-0 break-words">{categoria.name}</span>
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(categoria)}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 font-semibold text-white transition hover:bg-amber-600 active:scale-95 sm:px-4"
                    >
                      <Pencil aria-hidden="true" className="h-4 w-4" />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => excluirCategoria(categoria)}
                      className="flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 font-semibold text-white transition hover:bg-rose-700 active:scale-95 sm:px-4"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
