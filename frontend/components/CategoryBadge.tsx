import { categoryIconElement } from "@/lib/categories";

const TONES = {
  brand: "bg-indigo-50 text-indigo-600",
  income: "bg-emerald-50 text-emerald-600",
  expense: "bg-rose-50 text-rose-600",
} as const;

const SIZES = {
  sm: "h-9 w-9 rounded-lg [&>svg]:h-5 [&>svg]:w-5",
  md: "h-12 w-12 rounded-xl [&>svg]:h-6 [&>svg]:w-6",
} as const;

// Ícone da categoria dentro de um quadrado colorido
export default function CategoryBadge({
  name,
  tone = "brand",
  size = "sm",
}: {
  name: string;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center ${TONES[tone]} ${SIZES[size]}`}
    >
      {categoryIconElement(name)}
    </span>
  );
}
