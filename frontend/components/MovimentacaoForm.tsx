"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ApiError,
  api,
  type Category,
  type TransactionInput,
  type TransactionType,
} from "@/lib/api";
import { categoryEmoji } from "@/lib/categories";

type Props = {
  title: string;
  submitLabel: string;
  initial?: TransactionInput;
  onSubmit: (values: TransactionInput) => Promise<void>;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const TIPOS: { value: TransactionType; label: string; icon: string; on: string }[] =
  [
    {
      value: "INCOME",
      label: "Entrada",
      icon: "📈",
      on: "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-100",
    },
    {
      value: "EXPENSE",
      label: "Saída",
      icon: "📉",
      on: "border-rose-500 bg-rose-50 text-rose-700 ring-4 ring-rose-100",
    },
  ];

// Formulário usado por "Nova movimentação" e "Editar movimentação"
export default function MovimentacaoForm({
  title,
  submitLabel,
  initial,
  onSubmit,
}: Props) {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [tipo, setTipo] = useState<TransactionType>(initial?.type ?? "EXPENSE");
  const [descricao, setDescricao] = useState(initial?.description ?? "");
  const [valor, setValor] = useState(initial ? String(initial.amount) : "");
  const [categoriaId, setCategoriaId] = useState(
    initial ? String(initial.categoryId) : "",
  );
  const [data, setData] = useState(initial?.date ?? "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api<Category[]>("/categories")
      .then((lista) => {
        setCategorias(lista);
        // Sem categoria escolhida (tela nova), sugere a primeira da lista
        setCategoriaId((atual) => atual || String(lista[0]?.id ?? ""));
      })
      .catch((err) =>
        setErro(err instanceof ApiError ? err.message : "Erro inesperado"),
      );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!descricao.trim()) return setErro("Digite uma descrição.");
    if (!valor || Number(valor) <= 0) {
      return setErro("Digite um valor maior que zero.");
    }
    if (!categoriaId) return setErro("Selecione uma categoria.");
    if (!data) return setErro("Selecione uma data.");

    setSalvando(true);
    try {
      await onSubmit({
        type: tipo,
        description: descricao.trim(),
        amount: Number(valor),
        date: data,
        categoryId: Number(categoriaId),
      });
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro inesperado");
      setSalvando(false);
    }
  }

  const categoriaAtual = categorias.find((c) => String(c.id) === categoriaId);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href="/movimentacoes"
        className="text-sm font-medium text-gray-600 hover:text-indigo-700"
      >
        ← Voltar para as movimentações
      </Link>

      <h1 className="mt-3 animate-fade-up text-2xl font-bold text-gray-900 sm:text-3xl">
        {title}
      </h1>

      <form
        className="mt-6 animate-fade-up space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
        noValidate
      >
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">
            Tipo
          </legend>

          <div className="mt-2 grid grid-cols-2 gap-3" role="radiogroup">
            {TIPOS.map((opcao) => {
              const ativo = tipo === opcao.value;
              return (
                <button
                  key={opcao.value}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => setTipo(opcao.value)}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition active:scale-95 ${
                    ativo
                      ? opcao.on
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span aria-hidden="true">{opcao.icon}</span>
                  {opcao.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>

          <input
            id="description"
            type="text"
            maxLength={200}
            placeholder="Ex.: Salário, mercado, conta de luz"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Valor
          </label>

          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-4 top-2 flex items-center font-semibold text-gray-500"
            >
              R$
            </span>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              max="99999999.99"
              step="0.01"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className={`${inputClass} pl-12`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Categoria
          </label>

          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-2 flex h-full items-center text-xl"
            >
              {categoriaAtual ? categoryEmoji(categoriaAtual.name) : "🏷️"}
            </span>
            <select
              id="category"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={`${inputClass} pl-12`}
            >
              {categorias.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Data
          </label>

          <input
            id="date"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={inputClass}
          />
        </div>

        {erro && (
          <p
            role="alert"
            className="animate-pop rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:translate-y-0 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : submitLabel}
        </button>
      </form>
    </main>
  );
}
