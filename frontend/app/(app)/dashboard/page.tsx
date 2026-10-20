"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  api,
  formatMoney,
  type Summary,
  type Transaction,
} from "@/lib/api";

type Dados = { summary: Summary; gastos: [string, number][] };

export default function Dashboard() {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([
      api<Summary>("/transactions/summary"),
      api<Transaction[]>("/transactions?type=EXPENSE"),
    ])
      .then(([summary, saidas]) => {
        // Soma as saidas por categoria, do maior gasto para o menor
        const porCategoria = new Map<string, number>();
        for (const saida of saidas) {
          const nome = saida.category.name;
          porCategoria.set(
            nome,
            (porCategoria.get(nome) ?? 0) + Number(saida.amount),
          );
        }
        const gastos = [...porCategoria.entries()].sort((a, b) => b[1] - a[1]);
        setDados({ summary, gastos });
      })
      .catch((err) =>
        setErro(err instanceof ApiError ? err.message : "Erro inesperado"),
      );
  }, []);

  const saldo = Number(dados?.summary.balance ?? 0);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">ExpenseFlow</h1>

        <h2 className="mt-2 text-xl text-gray-800">Dashboard</h2>

        {erro && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {erro}
          </p>
        )}

        {!dados && !erro && (
          <p className="mt-8 text-center text-gray-600">Carregando...</p>
        )}

        {dados && (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="font-medium text-gray-800">Saldo</p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    saldo < 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {formatMoney(dados.summary.balance)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="font-medium text-gray-800">Entradas</p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatMoney(dados.summary.income)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="font-medium text-gray-800">Saidas</p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {formatMoney(dados.summary.expense)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-900">
                Gastos por categoria
              </h3>

              {dados.gastos.length === 0 ? (
                <p className="mt-4 text-gray-700">
                  Nenhuma saida cadastrada.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {dados.gastos.map(([categoria, valor]) => (
                    <div
                      key={categoria}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <span className="font-medium text-gray-900">
                        {categoria}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatMoney(valor)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
