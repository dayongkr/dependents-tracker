export async function fetcher(url: string, options?: RequestInit & { retries?: number }): Promise<Response> {
  const retries = options?.retries ?? 3;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);

      if (res.ok) {
        return res;
      }
    } catch (e) {
      console.error(`Failed to fetch ${url} (retry ${i + 1}/${retries}): ${e}`);
    }
  }

  throw new Error('Failed to fetch');
}
