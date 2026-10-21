"use client";

import {
  Plus,
  Rocket,
  PartyPopper,
  Scale,
  Sprout,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AnimatedMoney from "@/components/AnimatedMoney";
import CategoryBadge from "@/components/CategoryBadge";
import { useUser } from "@/components/UserContext";
import {
  ApiError,
  api,
  formatMoney,
  type Summary,
  type Transaction,
} from "@/lib/api";
import { greeting } from "@/lib/categories";

type Dados = { summary: Summary; gastos: [string, number][] };

// Frase (com ícone) que acompanha o saldo
function humor(saldo: number, temMovimentacao: boolean) {
  if (!temMovimentacao) {
    return {
      icon: Rocket,
      color: "text-indigo-500",
      text: "Cadastre a sua primeira movimentação para começar",
    };
  }
  if (saldo > 0) {
    return {
      icon: PartyPopper,
      color: "text-emerald-500",
      text: "Você está no azul! Continue assim",
    };
  }
  if (saldo < 0) {
    return {
      icon: TriangleAlert,
      color: "text-rose-500",
      text: "Atenção: as saídas passaram das entradas",
    };
  }
  return {
    icon: Scale,
    color: "text-gray-500",
    text: "Tudo zerado: entradas e saídas empatadas",
  };
}

export default function Dashboard() {
  const user = useUser();
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState("");
  const [barras, setBarras] = useState(false);

  useEffect(() => {
    Promise.all([
      api<Summary>("/transactions/summary"),
      api<Transaction[]>("/transactions?type=EXPENSE"),
    ])
      .then(([summary, saidas]) => {
        // Soma as saídas por categoria, do maior gasto para o menor
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
        // Libera a animação das barras depois do primeiro desenho
        requestAnimationFrame(() => requestAnimationFrame(() => setBarras(true)));
      })
      .catch((err) =>
        setErro(err instanceof ApiError ? err.message : "Erro inesperado"),
      );
  }, []);

  const saldo = Number(dados?.summary.balance ?? 0);
  const entradas = Number(dados?.summary.income ?? 0);
  const saidas = Number(dados?.summary.expense ?? 0);
  const totalGastos = dados?.gastos.reduce((soma, [, v]) => soma + v, 0) ?? 0;
  const primeiroNome = user?.name.split(" ")[0];
  const saudacao = greeting();
  const mood = dados ? humor(saldo, entradas + saidas > 0) : null;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            <saudacao.icon
              aria-hidden="true"
              className="h-7 w-7 text-amber-500"
            />
            {saudacao.text}, {primeiroNome}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-gray-600">
            {mood ? (
              <>
                <mood.icon
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 ${mood.color}`}
                />
                {mood.text}
              </>
            ) : (
              "Buscando os seus números..."
            )}
          </p>
        </div>

        <Link
          href="/nova-movimentacao"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
          Nova movimentação
        </Link>
      </div>

      {erro && (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {erro}
        </p>
      )}

      {dados && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div
              className={`animate-fade-up rounded-2xl p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                saldo < 0
                  ? "bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/30"
                  : "bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-500/30"
              }`}
            >
              <p className="flex items-center gap-2 font-medium text-white/85">
                <Wallet aria-hidden="true" className="h-5 w-5" /> Saldo
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight">
                <AnimatedMoney value={saldo} />
              </p>
            </div>

            <div
              style={{ animationDelay: "90ms" }}
              className="animate-fade-up rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="flex items-center gap-2 font-medium text-gray-700">
                <TrendingUp aria-hidden="true" className="h-5 w-5 text-emerald-600" /> Entradas
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-emerald-600">
                <AnimatedMoney value={entradas} />
              </p>
            </div>

            <div
              style={{ animationDelay: "180ms" }}
              className="animate-fade-up rounded-2xl border border-rose-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="flex items-center gap-2 font-medium text-gray-700">
                <TrendingDown aria-hidden="true" className="h-5 w-5 text-rose-600" /> Saídas
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-rose-600">
                <AnimatedMoney value={saidas} />
              </p>
            </div>
          </div>

          <section
            style={{ animationDelay: "270ms" }}
            className="mt-6 animate-fade-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900">
              Gastos por categoria
            </h2>

            {dados.gastos.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-2 py-6 text-center">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
                >
                  <Sprout className="h-8 w-8" />
                </span>
                <p className="text-gray-700">Nenhuma saída cadastrada ainda.</p>
              </div>
            ) : (
              <ul className="mt-5 space-y-5">
                {dados.gastos.map(([categoria, valor]) => {
                  const percentual = totalGastos ? (valor / totalGastos) * 100 : 0;
                  return (
                    <li key={categoria}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2 font-medium text-gray-900">
                          <CategoryBadge name={categoria} />
                          <span className="truncate">{categoria}</span>
                        </span>

                        <span className="shrink-0 text-right">
                          <span className="font-semibold text-gray-900">
                            {formatMoney(valor)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {percentual.toFixed(0)}%
                          </span>
                        </span>
                      </div>

                      <div
                        className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100"
                        role="img"
                        aria-label={`${categoria}: ${percentual.toFixed(0)}% dos gastos`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-1000 ease-out"
                          style={{ width: barras ? `${percentual}%` : "0%" }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {!dados && !erro && (
        <div className="mt-8 grid gap-4 md:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-gray-200/70"
            />
          ))}
        </div>
      )}
    </main>
  );
}
