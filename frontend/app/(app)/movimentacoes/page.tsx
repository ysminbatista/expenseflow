"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import {
  ApiError,
  api,
  downloadFile,
  formatDate,
  formatMoney,
  type Category,
  type Transaction,
} from "@/lib/api";
import { categoryEmoji } from "@/lib/categories";

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function Movimentacoes() {
  const toast = useToast();
  const [movimentacoes, setMovimentacoes] = useState<Transaction[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const temFiltro = Boolean(categoriaFiltro || dataInicial || dataFinal);

  // Filtros enviados ao backend (a filtragem é feita no servidor)
  const querystring = useCallback(() => {
    const params = new URLSearchParams();
    if (categoriaFiltro) params.set("categoryId", categoriaFiltro);
    if (dataInicial) params.set("from", dataInicial);
    if (dataFinal) params.set("to", dataFinal);
    const texto = params.toString();
    return texto ? `?${texto}` : "";
  }, [categoriaFiltro, dataInicial, dataFinal]);

  useEffect(() => {
    api<Category[]>("/categories")
      .then(setCategorias)
      .catch(() => {
        // sem categorias o filtro some, mas a lista continua funcionando
      });
  }, []);

  const carregar = useCallback(async () => {
    try {
      setMovimentacoes(await api<Transaction[]>(`/transactions${querystring()}`));
      setErro("");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro inesperado");
    } finally {
      setCarregando(false);
    }
  }, [querystring]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  async function excluirMovimentacao(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta movimentação?")) {
      return;
    }
    try {
      await api(`/transactions/${id}`, { method: "DELETE" });
      await carregar();
      toast("Movimentação excluída.", "info");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro inesperado");
    }
  }

  function limparFiltros() {
    setCategoriaFiltro("");
    setDataInicial("");
    setDataFinal("");
  }

  async function exportarCSV() {
    if (movimentacoes.length === 0) {
      toast("Não há movimentações para exportar.", "error");
      return;
    }
    try {
      await downloadFile(
        `/transactions/export${querystring()}`,
        "movimentacoes.csv",
      );
      toast("Arquivo CSV baixado! 📄");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro inesperado");
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex animate-fade-up flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Minhas movimentações
          </h1>
          <p className="mt-1 text-gray-600">
            Tudo o que entrou e saiu, do mais recente ao mais antigo.
          </p>
        </div>

        <Link
          href="/nova-movimentacao"
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          + Nova movimentação
        </Link>
      </div>

      {erro && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          {erro}
        </p>
      )}

      <section
        aria-labelledby="titulo-filtros"
        className="mt-6 animate-fade-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 id="titulo-filtros" className="text-lg font-semibold text-gray-900">
          Filtros
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="filtro-categoria"
              className="block text-sm font-medium text-gray-800"
            >
              Categoria
            </label>

            <select
              id="filtro-categoria"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className={inputClass}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filtro-inicio"
              className="block text-sm font-medium text-gray-800"
            >
              Período: de
            </label>

            <input
              id="filtro-inicio"
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="filtro-fim"
              className="block text-sm font-medium text-gray-800"
            >
              Período: até
            </label>

            <input
              id="filtro-fim"
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          O período mostra as movimentações cuja data está entre as duas datas,
          incluindo elas. Preencha só &quot;de&quot; para ver a partir de um
          dia, ou só &quot;até&quot; para ver até um dia. Para ver um único dia,
          use a mesma data nos dois campos.
        </p>

        {dataInicial && dataFinal && dataInicial > dataFinal && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            A data &quot;de&quot; está depois da data &quot;até&quot;, por isso
            nada aparece.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {temFiltro && (
            <button
              onClick={limparFiltros}
              className="rounded-xl bg-gray-800 px-4 py-2 font-semibold text-white transition hover:bg-gray-900 active:scale-95"
            >
              Limpar filtros
            </button>
          )}

          <button
            onClick={exportarCSV}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
          >
            📄 Exportar CSV
          </button>
        </div>
      </section>

      {carregando ? (
        <div className="mt-8 space-y-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-gray-200/70"
            />
          ))}
        </div>
      ) : movimentacoes.length === 0 ? (
        <div className="mt-8 animate-pop rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <span className="text-5xl" aria-hidden="true">
            {temFiltro ? "🔍" : "🪙"}
          </span>
          <p className="mt-3 font-medium text-gray-800">
            {temFiltro
              ? "Nenhuma movimentação encontrada com esses filtros."
              : "Nenhuma movimentação cadastrada ainda."}
          </p>
          {!temFiltro && (
            <Link
              href="/nova-movimentacao"
              className="mt-4 inline-block font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Cadastrar a primeira
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {movimentacoes.map((movimentacao, index) => (
            <li
              key={movimentacao.id}
              style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
              className="animate-fade-up rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                      movimentacao.type === "INCOME"
                        ? "bg-emerald-50"
                        : "bg-rose-50"
                    }`}
                  >
                    {categoryEmoji(movimentacao.category.name)}
                  </span>

                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold text-gray-900">
                      {movimentacao.description}
                    </h3>

                    <p className="mt-0.5 text-sm text-gray-600">
                      {movimentacao.category.name} ·{" "}
                      {formatDate(movimentacao.date)}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p
                    className={`text-lg font-bold ${
                      movimentacao.type === "INCOME"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    <span className="sr-only">
                      {movimentacao.type === "INCOME" ? "Entrada de " : "Saída de "}
                    </span>
                    {movimentacao.type === "INCOME" ? "+" : "−"}{" "}
                    {formatMoney(movimentacao.amount)}
                  </p>

                  <div className="mt-1 flex gap-4 sm:justify-end">
                    <Link
                      href={`/editar-movimentacao?id=${movimentacao.id}`}
                      className="py-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => excluirMovimentacao(movimentacao.id)}
                      className="py-1 text-sm font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
