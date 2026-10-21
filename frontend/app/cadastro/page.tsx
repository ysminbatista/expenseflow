"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/AuthShell";
import PasswordInput from "@/components/PasswordInput";
import { ApiError, register, setToken } from "@/lib/api";

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

// Força da senha: 0 (vazia) a 4, só para orientar quem está criando a conta
function passwordStrength(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(score, 1);
}

const STRENGTH = [
  { label: "", color: "bg-gray-200" },
  { label: "Fraca", color: "bg-rose-500" },
  { label: "Razoável", color: "bg-amber-500" },
  { label: "Boa", color: "bg-lime-500" },
  { label: "Forte", color: "bg-emerald-500" },
];

export default function Cadastro() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { accessToken } = await register(name, email, password);
      setToken(accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Crie a sua conta" subtitle="Leva menos de um minuto">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>

          <input
            id="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como devemos te chamar?"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>

          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>

          <div className="mt-2">
            <PasswordInput
              id="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Medidor de força da senha */}
          <div className="mt-3 flex items-center gap-3" aria-live="polite">
            <div className="flex flex-1 gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    strength >= level ? STRENGTH[strength].color : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="w-16 text-right text-xs font-medium text-gray-600">
              {STRENGTH[strength].label}
            </span>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="animate-pop rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:translate-y-0 disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
