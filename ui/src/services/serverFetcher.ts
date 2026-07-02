import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ServerFetcherOptions = RequestInit;

export async function serverFetcher<T>(
  path: string,
  options: ServerFetcherOptions = {},
): Promise<T> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Erro inesperado na requisição");
  }

  return data as T;
}
