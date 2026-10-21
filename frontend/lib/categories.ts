import { createElement, type ReactElement } from "react";
import {
  Briefcase,
  GraduationCap,
  Gamepad2,
  HeartPulse,
  House,
  Moon,
  Package,
  PawPrint,
  Sun,
  Sunset,
  Tag,
  Utensils,
  Bus,
  type LucideIcon,
} from "lucide-react";

// Ícone de cada categoria, reconhecido pelo nome (sem acento e sem diferenciar
// maiúsculas). Categorias criadas pelo usuário recebem um ícone genérico.
const ICONS: [RegExp, LucideIcon][] = [
  [/trabalho|salario|freela/, Briefcase],
  [/casa|moradia|aluguel|condominio/, House],
  [/transporte|carro|uber|onibus|combustivel/, Bus],
  [/alimentacao|mercado|restaurante|comida/, Utensils],
  [/saude|farmacia|medic/, HeartPulse],
  [/educacao|curso|escola|livro/, GraduationCap],
  [/lazer|viagem|cinema|jogo/, Gamepad2],
  [/pet|animal/, PawPrint],
  [/outros/, Package],
];

function categoryIcon(name: string): LucideIcon {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return ICONS.find(([pattern]) => pattern.test(normalized))?.[1] ?? Tag;
}

// Elemento <svg> do ícone da categoria, pronto para ser desenhado
export function categoryIconElement(name: string, className?: string): ReactElement {
  return createElement(categoryIcon(name), { className, "aria-hidden": true });
}

// Saudação e ícone de acordo com o horário
export function greeting(date = new Date()): { text: string; icon: LucideIcon } {
  const hour = date.getHours();
  if (hour < 12) return { text: "Bom dia", icon: Sun };
  if (hour < 18) return { text: "Boa tarde", icon: Sunset };
  return { text: "Boa noite", icon: Moon };
}
