"use client";

import { useEffect, useState } from "react";

export default function NovaMovimentacao() {
  const [tipo, setTipo] = useState("entrada");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("Trabalho");
  const [data, setData] = useState("");

  const [categorias, setCategorias] = useState<string[]>([
    "Trabalho",
    "Casa",
    "Transporte",
    "Alimentacao",
    "Outros",
  ]);

  useEffect(() => {
    const categoriasSalvas =
      localStorage.getItem("categorias");

    if (categoriasSalvas) {
      setCategorias(JSON.parse(categoriasSalvas));
    }
  }, []);

  function salvarMovimentacao(e: React.FormEvent) {
    e.preventDefault();

    if (!descricao.trim()) {
      alert("Digite uma descricao.");
      return;
    }

    if (!valor || Number(valor) <= 0) {
      alert("Digite um valor maior que zero.");
      return;
    }

    if (!categoria) {
      alert("Selecione uma categoria.");
      return;
    }

    if (!data) {
      alert("Selecione uma data.");
      return;
    }

    const novaMovimentacao = {
      id: Date.now(),
      tipo,
      descricao,
      valor: Number(valor),
      categoria,
      data,
    };

    const movimentacoesSalvas =
      localStorage.getItem("movimentacoes");

    const movimentacoes = movimentacoesSalvas
      ? JSON.parse(movimentacoesSalvas)
      : [];

    movimentacoes.push(novaMovimentacao);

    localStorage.setItem(
      "movimentacoes",
      JSON.stringify(movimentacoes)
    );

    alert("Movimentacao salva com sucesso!");

    setDescricao("");
    setValor("");
    setCategoria(categorias[0] || "");
    setData("");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900">
          ExpenseFlow
        </h1>

        <h2 className="mt-2 text-xl text-gray-600">
          Nova movimentacao
        </h2>

        <form
          className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow"
          onSubmit={salvarMovimentacao}
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
              onChange={(e) => setTipo(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saida</option>
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
              placeholder="Ex: Salario"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
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
              min="0"
              step="0.01"
              placeholder="Ex: 1500"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
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
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            >
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
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
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Salvar movimentacao
          </button>
        </form>
      </div>
    </main>
  );
}