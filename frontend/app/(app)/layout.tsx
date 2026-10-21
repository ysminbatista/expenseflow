"use client";

import { ArrowLeftRight, LayoutDashboard, LogOut, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo, { LogoMark } from "@/components/Logo";
import { UserProvider } from "@/components/UserContext";
import { ApiError, api, clearToken, getToken, type User } from "@/lib/api";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/movimentacoes", label: "Movimentações", icon: ArrowLeftRight },
  { href: "/categorias", label: "Categorias", icon: Tags },
];

// Área logada: confere o token (RN11), mostra a navegação e o botão Sair.
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
        // Token inválido ou expirado: volta para o login.
        // Outros erros (ex.: servidor fora do ar) não derrubam a sessão.
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
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="animate-pulse">
          <LogoMark size={56} />
        </div>
        <p className="text-sm text-gray-600">Carregando...</p>
      </main>
    );
  }

  return (
    <UserProvider value={user}>
      <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/dashboard" aria-label="ExpenseFlow, ir para o dashboard">
            <Logo size={34} />
          </Link>

          <div className="flex items-center gap-3 text-sm sm:order-3">
            <span className="hidden max-w-[10rem] truncate font-medium text-gray-700 sm:inline">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Sair</span>
            </button>
          </div>

          <nav
            aria-label="Principal"
            className="grid w-full grid-cols-3 gap-1 sm:order-2 sm:flex sm:w-auto"
          >
            {LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex flex-col items-center justify-center gap-0.5 whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium transition sm:flex-row sm:gap-2 sm:px-3 sm:text-sm ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <link.icon
                    aria-hidden="true"
                    className="h-5 w-5 transition group-hover:scale-110"
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </UserProvider>
  );
}
