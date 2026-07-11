export const GRAPH_API_VERSION = "v21.0";
export const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export class GraphApiError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly subcode?: number,
    public readonly fbtraceId?: string,
    public readonly raw?: unknown
  ) {
    super(message);
    this.name = "GraphApiError";
  }
}

type GraphErrorBody = {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
    error_user_msg?: string;
  };
};

export async function graphFetch<T>(
  path: string,
  init?: {
    method?: "GET" | "POST";
    params?: Record<string, string>;
  }
): Promise<T> {
  const method = init?.method ?? "GET";
  const url = new URL(`${GRAPH_API_BASE}${path}`);
  const body = new URLSearchParams();

  if (init?.params) {
    for (const [key, value] of Object.entries(init.params)) {
      if (method === "GET") {
        url.searchParams.set(key, value);
      } else {
        body.set(key, value);
      }
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers:
      method === "POST"
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : undefined,
    body: method === "POST" ? body.toString() : undefined,
  });

  const json = (await response.json()) as GraphErrorBody & T;

  if (!response.ok || (json as GraphErrorBody).error) {
    const err = (json as GraphErrorBody).error;
    throw new GraphApiError(
      err?.error_user_msg || err?.message || `Graph API request failed (${response.status})`,
      err?.code,
      err?.error_subcode,
      err?.fbtrace_id,
      json
    );
  }

  return json as T;
}
