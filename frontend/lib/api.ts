const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "expenseflow_token";

export type User = { id: number; name: string; email: string };
export type AuthResponse = { accessToken: string; user: User };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage indisponivel: nada a limpar
  }
}

// Mensagem de erro da API (string ou lista do ValidationPipe) -> texto unico
function errorMessage(body: unknown, fallback: string): string {
  const message = (body as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) return message.join(". ");
  return message ?? fallback;
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = getToken();
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor", 0);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      errorMessage(body, "Erro inesperado"),
      response.status,
    );
  }
  return body as T;
}

export function login(email: string, password: string) {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function register(name: string, email: string, password: string) {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export type Category = { id: number; name: string };

export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: number;
  type: TransactionType;
  description: string;
  amount: string; // Decimal serializado como texto pela API
  date: string; // ISO, ex.: 2026-10-05T00:00:00.000Z
  categoryId: number;
  category: Category;
};

export type TransactionInput = {
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  categoryId: number;
};

export type Summary = { income: string; expense: string; balance: string };

export function formatMoney(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// "2026-10-05T00:00:00.000Z" -> "05/10/2026" (sem converter fuso)
export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

// Baixa um arquivo de uma rota protegida (o link direto nao envia o token)
export async function downloadFile(path: string, filename: string) {
  const token = getToken();
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor", 0);
  }
  if (!response.ok) throw new ApiError("Não foi possível exportar", response.status);

  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
