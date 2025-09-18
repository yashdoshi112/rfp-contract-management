export function getToken() { return localStorage.getItem('token'); }
export function setToken(t: string) { localStorage.setItem('token', t); }

export function getUser(): any | null {
  const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null;
}

export function setUser(u: any) { localStorage.setItem('user', JSON.stringify(u)); }
export function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); }
