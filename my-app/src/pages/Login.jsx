import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/products";

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    
    if (!email || !password) {
      setErr("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      
      // ✅ Call real backend API
      const response = await login({ email, password });
      
      if (response.success && response.data) {
        const { access_token, user } = response.data;
        
        // ✅ Store authentication data correctly
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("auth_role", user.role);
        localStorage.setItem("auth_name", `${user.first_name} ${user.last_name}`);
        
        // Trigger storage event for Header to react
        window.dispatchEvent(new Event("storage"));
        
        // Redirect based on role
        if (user.role === "admin") {
          navigate("/products", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setErr(response.message || "Login failed");
      }
    } catch (ex) {
      console.error("Login error:", ex);
      setErr(ex.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        {err && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none rounded-lg px-3 py-2"
              placeholder="admin@electronics.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none rounded-lg px-3 py-2"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
            <strong>Demo credentials:</strong><br/>
            Admin: admin@electronics.com / admin123<br/>
            Customer: customer@example.com / customer123
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition-all disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-medium hover:underline">
              Create one
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}