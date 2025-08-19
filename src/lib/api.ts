export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function postJSON<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // quita credentials si no usas cookies; añádelo si luego activas sesión por cookies
    // credentials: 'include',
    mode: 'cors',
    body: JSON.stringify(data),
  });
  
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  
  if (!res.ok) {
    const msg = json?.error || `Error ${res.status}`;
    throw new Error(msg);
  }
  
  return json as T;
}

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });
  
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  
  if (!res.ok) {
    const msg = json?.error || `Error ${res.status}`;
    throw new Error(msg);
  }
  
  return json as T;
}