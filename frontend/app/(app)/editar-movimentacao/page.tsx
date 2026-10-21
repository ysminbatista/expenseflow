"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MovimentacaoForm from "@/components/MovimentacaoForm";
import { useToast } from "@/components/Toast";
import {
  ApiError,
  api,
  type Transaction,
  type TransactionInput,
} from "@/lib/api";

function Editar() {
  const router = useRouter();
  const toast = useToast();
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
            ? "Movimentação não encontrada."
            : err instanceof ApiError
              ? err.message
              : "Erro inesperado",
        ),
      );
  }, [id]);

  async function salvar(values: TransactionInput) {
    await api(`/transactions/${id}`, { method: "PATCH", body: values });
    toast("Alterações salvas!");
    router.push("/movimentacoes");
  }

  if (!id || erro) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <span
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500"
          >
            <SearchX className="h-8 w-8" />
          </span>
          <p className="mt-3 text-gray-800">
            {erro || "Movimentação não informada."}
          </p>
          <Link
            href="/movimentacoes"
            className="mt-4 inline-block font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Voltar para as movimentações
          </Link>
        </div>
      </main>
    );
  }

  if (!initial) {
    return (
      <main className="flex-1 px-4 py-8">
        <p className="text-center text-gray-600">Carregando...</p>
      </main>
    );
  }

  return (
    <MovimentacaoForm
      title="Editar movimentação"
      submitLabel="Salvar alterações"
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
