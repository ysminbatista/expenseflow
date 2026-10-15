"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, api, clearToken, getToken, type User } from "@/lib/api";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/movimentacoes", label: "Movimentacoes" },
  { href: "/categorias", label: "Categorias" },
];

// Area logada: confere o token (RN11), mostra a navegacao e o botao Sair.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api<User>("/auth/me")
      .then(setUser)
      .catch((err) => {
        // Token invalido ou expirado: volta para o login.
        // Outros erros (ex.: servidor fora do ar) nao derrubam a sessao.
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/login");
        }
      });
  }, [router]);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <nav className="flex gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname.startsWith(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
