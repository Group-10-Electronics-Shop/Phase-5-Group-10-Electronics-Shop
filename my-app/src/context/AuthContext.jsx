import React, { createContext, useEffect, useState } from "react";
import client from "../api/client";
export const AuthContext = createContext({ user: null });
export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { if(!cancelled) setUser(null); return; }
        const res = await client.get('/api/auth/profile');
        if (!cancelled) setUser(res.data?.data || null);
      } catch (e) {
        if(!cancelled) setUser(null);
      } finally {
        if(!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const refreshProfile = async () => {
    try {
      const res = await client.get('/api/auth/profile');
      setUser(res.data?.data || null);
      return res.data?.data || null;
    } catch (e) {
      setUser(null);
      return null;
    }
  };

  const login = async (email, password) => {
    const res = await client.post('/api/auth/login', { email, password });
    const token = res?.data?.data?.access_token || res?.data?.token || res?.data?.access_token;
    if (token) localStorage.setItem('token', token);
    return await refreshProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>{children}</AuthContext.Provider>;
}
