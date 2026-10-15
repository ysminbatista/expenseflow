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

export default function Dashboard() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  useEffect(() => {
    const movimentacoesSalvas =
      localStorage.getItem("movimentacoes");

    if (movimentacoesSalvas) {
      setMovimentacoes(JSON.parse(movimentacoesSalvas));
    }
  }, []);

  const entradas = movimentacoes
    .filter((movimentacao) => movimentacao.tipo === "entrada")
    .reduce((total, movimentacao) => total + movimentacao.valor, 0);

  const saidas = movimentacoes
    .filter((movimentacao) => movimentacao.tipo === "saida")
    .reduce((total, movimentacao) => total + movimentacao.valor, 0);

  const saldo = entradas - saidas;

  const gastosPorCategoria: { [categoria: string]: number } = {};

  movimentacoes
    .filter((movimentacao) => movimentacao.tipo === "saida")
    .forEach((movimentacao) => {
      if (gastosPorCategoria[movimentacao.categoria]) {
        gastosPorCategoria[movimentacao.categoria] +=
          movimentacao.valor;
      } else {
        gastosPorCategoria[movimentacao.categoria] =
          movimentacao.valor;
      }
    });

  function formatarValor(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">
          ExpenseFlow
        </h1>

        <h2 className="mt-2 text-xl text-gray-800">
          Dashboard
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="font-medium text-gray-800">
              Saldo
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatarValor(saldo)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="font-medium text-gray-800">
              Entradas
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatarValor(entradas)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="font-medium text-gray-800">
              Saidas
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatarValor(saidas)}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-900">
            Gastos por categoria
          </h3>

          {Object.keys(gastosPorCategoria).length === 0 ? (
            <p className="mt-4 text-gray-700">
              Nenhuma movimentacao cadastrada.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {Object.entries(gastosPorCategoria).map(
                ([categoria, valor]) => (
                  <div
                    key={categoria}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <span className="font-medium text-gray-900">
                      {categoria}
                    </span>

                    <span className="font-semibold text-gray-900">
                      {formatarValor(valor)}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}