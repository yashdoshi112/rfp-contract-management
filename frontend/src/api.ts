const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function api(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: any = { ...(opts.headers || {}) };
  if (!(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return res.json();
}

export { API };
