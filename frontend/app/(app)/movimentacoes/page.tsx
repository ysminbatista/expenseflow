"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  api,
  downloadFile,
  formatDate,
  formatMoney,
  type Category,
  type Transaction,
} from "@/lib/api";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900";

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<Transaction[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const temFiltro = Boolean(categoriaFiltro || dataInicial || dataFinal);

  // Filtros enviados ao backend (a filtragem e feita no servidor)
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
    if (!window.confirm("Tem certeza que deseja excluir esta movimentacao?")) {
      return;
    }
    try {
      await api(`/transactions/${id}`, { method: "DELETE" });
      await carregar();
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
      setErro("Nao existem movimentacoes para exportar.");
      return;
    }
    try {
      await downloadFile(
        `/transactions/export${querystring()}`,
        "movimentacoes.csv",
      );
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro inesperado");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ExpenseFlow</h1>
            <h2 className="mt-2 text-xl text-gray-800">Minhas movimentacoes</h2>
          </div>

          <Link
            href="/nova-movimentacao"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Nova movimentacao
          </Link>
        </div>

        {erro && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {erro}
          </p>
        )}

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>

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
                Periodo: de
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
                Periodo: ate
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
            O periodo mostra as movimentacoes cuja data esta entre as duas
            datas, incluindo elas. Preencha so &quot;de&quot; para ver a partir
            de um dia, ou so &quot;ate&quot; para ver ate um dia. Para ver um
            unico dia, use a mesma data nos dois campos.
          </p>

          {dataInicial && dataFinal && dataInicial > dataFinal && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              A data &quot;de&quot; esta depois da data &quot;ate&quot;, por
              isso nada aparece.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {temFiltro && (
              <button
                onClick={limparFiltros}
                className="rounded-lg bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-900"
              >
                Limpar filtros
              </button>
            )}

            <button
              onClick={exportarCSV}
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        {carregando ? (
          <p className="mt-8 text-center text-gray-600">Carregando...</p>
        ) : movimentacoes.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-6 text-center shadow">
            <p className="font-medium text-gray-800">
              {temFiltro
                ? "Nenhuma movimentacao encontrada com esses filtros."
                : "Nenhuma movimentacao cadastrada."}
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {movimentacoes.map((movimentacao) => (
              <div
                key={movimentacao.id}
                className="rounded-xl bg-white p-5 shadow"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold text-gray-900">
                      {movimentacao.description}
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      {movimentacao.category.name} -{" "}
                      {formatDate(movimentacao.date)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p
                      className={`text-lg font-bold ${
                        movimentacao.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {movimentacao.type === "INCOME" ? "+" : "-"}{" "}
                      {formatMoney(movimentacao.amount)}
                    </p>

                    <button
                      onClick={() => excluirMovimentacao(movimentacao.id)}
                      className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>

                    <Link
                      href={`/editar-movimentacao?id=${movimentacao.id}`}
                      className="mt-2 ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </Link>
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
