import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginAs } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState("user"); 
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/products";

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!email || !pwd) {
      setErr("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      
      loginAs({
        role,
        name: email.split("@")[0] || "User",
      });

      navigate(from, { replace: true });
    } catch (ex) {
      console.error(ex);
      setErr("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl border p-6 shadow">
        <h1 className="text-2xl font-semibold mb-1">Login</h1>
        <p className="text-sm text-gray-500 mb-4">
          Sign in to continue.
        </p>

        {err && <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={pwd}
              onChange={(e)=>setPwd(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin (CRUD)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            <Link to="/signup" className="text-sm text-gray-600 hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}