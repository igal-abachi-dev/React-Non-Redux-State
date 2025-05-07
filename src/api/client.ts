function buildHeaders(orig?: HeadersInit): Headers {
  const headers = new Headers(orig || {});
  headers.set("Content-Type", "application/json");

  const token = localStorage.getItem("authToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

const API_BASE = import.meta.env.DEV ? '/api' : '/api';

/*
  const todos = await apiFetch<Todo[]>('/api/todos');
   */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: buildHeaders(options.headers),
    //credentials: 'include', 
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  if (response.status === 204) {//Expected JSON response but got 204 No Content
    return undefined as unknown as T;
  }  
  
  const contentType = response.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {//Expected JSON response but got other Content-Type
    return response.json() as Promise<T>;
  }
  return undefined as unknown as T;
}

/*
await post<NewUser>('/users', { name: 'Alice', email: 'a@b.com' });

const user = await post<NewUser, CreatedUser>('/users',
  { name: 'Bob', email: 'b@c.com' }
);
 */
export async function apiPost<Body, Res = void>(
  url: string,
  body: Body,
  options: Omit<RequestInit, "method" | "body"> = {}
): Promise<Res> {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    ...options,
    headers: buildHeaders(options.headers),
    body: JSON.stringify(body),
    //credentials: 'include', 
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  if (response.status === 204) {//Expected JSON response but got 204 No Content
    return undefined as unknown as Res;
  }
  const contentType = response.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {//Expected JSON response but got other Content-Type
    return response.json() as Promise<Res>;
  }
  return undefined as unknown as Res;
}
