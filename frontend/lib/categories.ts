// Emoji de cada categoria, reconhecido pelo nome (sem acento e sem diferenciar
// maiúsculas). Categorias criadas pelo usuário recebem um emoji genérico.
const EMOJIS: [RegExp, string][] = [
  [/trabalho|salario|freela/, "💼"],
  [/casa|moradia|aluguel|condominio/, "🏠"],
  [/transporte|carro|uber|onibus|combustivel/, "🚌"],
  [/alimentacao|mercado|restaurante|comida/, "🍽️"],
  [/saude|farmacia|medic/, "💊"],
  [/educacao|curso|escola|livro/, "📚"],
  [/lazer|viagem|cinema|jogo/, "🎮"],
  [/pet|animal/, "🐾"],
  [/outros/, "📦"],
];

export function categoryEmoji(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  return EMOJIS.find(([pattern]) => pattern.test(normalized))?.[1] ?? "🏷️";
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
