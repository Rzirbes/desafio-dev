const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClientFetcherOptions = RequestInit & {
  token?: string | null;
};

export async function clientFetcher<T>(
  path: string,
  options: ClientFetcherOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Erro inesperado na requisição");
  }

  return data as T;
}
