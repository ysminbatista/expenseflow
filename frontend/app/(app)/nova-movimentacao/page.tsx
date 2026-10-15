"use client";

import { useRouter } from "next/navigation";
import MovimentacaoForm from "@/components/MovimentacaoForm";
import { api, type TransactionInput } from "@/lib/api";

export default function NovaMovimentacao() {
  const router = useRouter();

  async function salvar(values: TransactionInput) {
    await api("/transactions", { method: "POST", body: values });
    router.push("/movimentacoes");
  }

  return (
    <MovimentacaoForm
      title="Nova movimentacao"
      submitLabel="Salvar movimentacao"
      onSubmit={salvar}
    />
  );
}
