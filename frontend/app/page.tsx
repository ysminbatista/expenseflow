"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  // Quem ja esta logado vai direto para o dashboard
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">ExpenseFlow</h1>

        <p className="mt-3 text-gray-600">
          Controle suas entradas e saidas, organize por categorias e acompanhe
          o seu saldo.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
