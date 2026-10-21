import Logo from "@/components/Logo";

// Moldura das telas públicas (início, login, cadastro): fundo colorido com
// formas flutuantes e um cartão branco no centro.
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-4">
      {/* Formas decorativas */}
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-72 w-72 animate-float rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-20 h-96 w-96 animate-float rounded-full bg-emerald-300/20 blur-3xl [animation-delay:-3s]"
      />

      <div className="relative w-full max-w-md animate-pop rounded-3xl bg-white p-8 shadow-2xl shadow-indigo-900/30">
        <div className="flex justify-center">
          <Logo size={44} />
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-center text-gray-600">{subtitle}</p>
        )}

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
