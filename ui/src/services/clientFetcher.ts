const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClientFetcherOptions = RequestInit & {
  token?: string | null;
};

export async function clientFetcher<T>(
  path: string,
  options: ClientFetcherOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  async function request(accessToken?: string | null) {
    return fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  }

  let response = await request(token);

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("@finance:refreshToken");

    if (!refreshToken) {
      throw new Error("Sessão expirada.");
    }

    const refreshResponse = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const refreshData = await refreshResponse.json().catch(() => null);

    if (!refreshResponse.ok) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error(refreshData?.message ?? "Sessão expirada.");
    }

    localStorage.setItem("@finance:accessToken", refreshData.accessToken);

    localStorage.setItem("@finance:refreshToken", refreshData.refreshToken);

    response = await request(refreshData.accessToken);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Erro inesperado na requisição");
  }

  return data as T;
}
