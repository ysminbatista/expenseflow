"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MovimentacaoForm from "@/components/MovimentacaoForm";
import {
  ApiError,
  api,
  type Transaction,
  type TransactionInput,
} from "@/lib/api";

function Editar() {
  const router = useRouter();
  const id = useSearchParams().get("id");

  const [initial, setInitial] = useState<TransactionInput | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;
    api<Transaction>(`/transactions/${id}`)
      .then((t) =>
        setInitial({
          type: t.type,
          description: t.description,
          amount: Number(t.amount),
          date: t.date.slice(0, 10),
          categoryId: t.categoryId,
        }),
      )
      .catch((err) =>
        setErro(
          err instanceof ApiError && err.status === 404
            ? "Movimentacao nao encontrada."
            : err instanceof ApiError
              ? err.message
              : "Erro inesperado",
        ),
      );
  }, [id]);

  async function salvar(values: TransactionInput) {
    await api(`/transactions/${id}`, { method: "PATCH", body: values });
    router.push("/movimentacoes");
  }

  if (!id || erro) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-xl rounded-xl bg-white p-6 text-center shadow">
          <p className="text-gray-800">{erro || "Movimentacao nao informada."}</p>
          <Link
            href="/movimentacoes"
            className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-800"
          >
            Voltar para movimentacoes
          </Link>
        </div>
      </main>
    );
  }

  if (!initial) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <p className="text-center text-gray-600">Carregando...</p>
      </main>
    );
  }

  return (
    <MovimentacaoForm
      title="Editar movimentacao"
      submitLabel="Salvar alteracao"
      initial={initial}
      onSubmit={salvar}
    />
  );
}

export default function EditarMovimentacao() {
  return (
    <Suspense>
      <Editar />
    </Suspense>
  );
}
