"use client";

import { useRouter } from "next/navigation";
import MovimentacaoForm from "@/components/MovimentacaoForm";
import { useToast } from "@/components/Toast";
import { api, type TransactionInput } from "@/lib/api";

export default function NovaMovimentacao() {
  const router = useRouter();
  const toast = useToast();

  async function salvar(values: TransactionInput) {
    await api("/transactions", { method: "POST", body: values });
    toast(
      values.type === "INCOME"
        ? "Entrada registrada! 🎉"
        : "Saída registrada!",
    );
    router.push("/movimentacoes");
  }

  return (
    <MovimentacaoForm
      title="Nova movimentação"
      submitLabel="Salvar movimentação"
      onSubmit={salvar}
    />
  );
}
