"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthShell from "@/components/AuthShell";
import { getToken } from "@/lib/api";

const FEATURES = [
  { icon: "💸", text: "Registre entradas e saídas em segundos" },
  { icon: "🏷️", text: "Organize tudo por categorias" },
  { icon: "📊", text: "Acompanhe o saldo e para onde vai o dinheiro" },
  { icon: "📄", text: "Exporte seus dados em CSV" },
];

export default function Home() {
  const router = useRouter();

  // Quem já está logado vai direto para o dashboard
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  return (
    <AuthShell
      title="Seu dinheiro, no controle"
      subtitle="Controle financeiro pessoal, simples e bonito."
    >
      <ul className="space-y-3">
        {FEATURES.map((feature, index) => (
          <li
            key={feature.text}
            style={{ animationDelay: `${150 + index * 90}ms` }}
            className="flex animate-fade-up items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800"
          >
            <span className="text-xl" aria-hidden="true">
              {feature.icon}
            </span>
            {feature.text}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-center font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          Entrar
        </Link>

        <Link
          href="/cadastro"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800 transition hover:-translate-y-0.5 hover:bg-gray-50 active:translate-y-0"
        >
          Criar conta
        </Link>
      </div>
    </AuthShell>
  );
}
