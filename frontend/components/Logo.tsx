import { useId } from "react";

// Marca do ExpenseFlow: um "E" feito de três barras (o fluxo do dinheiro)
// com uma moeda verde. Mesma arte do ícone da aba (app/icon.svg).
export function LogoMark({ size = 36 }: { size?: number }) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
      <rect x="10" y="11" width="18" height="4" rx="2" fill="#fff" />
      <rect x="10" y="18" width="12" height="4" rx="2" fill="#fff" />
      <rect x="10" y="25" width="18" height="4" rx="2" fill="#fff" />
      <circle cx="30" cy="20" r="3.2" fill="#34d399" />
    </svg>
  );
}

export default function Logo({
  size = 36,
  light = false,
}: {
  size?: number;
  /** Texto branco, para fundos escuros ou coloridos */
  light?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span
        className={`text-xl font-extrabold tracking-tight ${
          light ? "text-white" : "text-gray-900"
        }`}
      >
        Expense
        <span
          className={
            light
              ? "text-emerald-300"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          }
        >
          Flow
        </span>
      </span>
    </span>
  );
}
