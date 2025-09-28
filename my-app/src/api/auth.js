import client from "./client";
export async function register(payload){ const r = await client.post('/api/auth/register', payload); return r.data; }
export async function login(payload){
  const r = await client.post('/api/auth/login', payload);
  const token = r?.data?.data?.access_token || r?.data?.token || r?.data?.access_token;
  if (token) localStorage.setItem('token', token);
  return r.data;
}
export function logout(){ localStorage.removeItem('token'); }
