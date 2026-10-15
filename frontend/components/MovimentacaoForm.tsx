"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  api,
  type Category,
  type TransactionInput,
  type TransactionType,
} from "@/lib/api";

type Props = {
  title: string;
  submitLabel: string;
  initial?: TransactionInput;
  onSubmit: (values: TransactionInput) => Promise<void>;
};

const inputClass =
  "mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900";

// Formulario usado por "Nova movimentacao" e "Editar movimentacao"
export default function MovimentacaoForm({
  title,
  submitLabel,
  initial,
  onSubmit,
}: Props) {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [tipo, setTipo] = useState<TransactionType>(initial?.type ?? "INCOME");
  const [descricao, setDescricao] = useState(initial?.description ?? "");
  const [valor, setValor] = useState(
    initial ? String(initial.amount) : "",
  );
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

    if (!descricao.trim()) return setErro("Digite uma descricao.");
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

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900">ExpenseFlow</h1>

        <h2 className="mt-2 text-xl text-gray-600">{title}</h2>

        <form
          className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo
            </label>

            <select
              id="type"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TransactionType)}
              className={inputClass}
            >
              <option value="INCOME">Entrada</option>
              <option value="EXPENSE">Saida</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descricao
            </label>

            <input
              id="description"
              type="text"
              maxLength={200}
              placeholder="Ex: Salario"
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

            <input
              id="amount"
              type="number"
              min="0.01"
              max="99999999.99"
              step="0.01"
              placeholder="Ex: 1500"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Categoria
            </label>

            <select
              id="category"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={inputClass}
            >
              {categorias.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
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
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : submitLabel}
          </button>
        </form>
      </div>
    </main>
  );
}
