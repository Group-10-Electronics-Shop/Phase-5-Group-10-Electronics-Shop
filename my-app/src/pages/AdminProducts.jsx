import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

console.log("[DEV] AdminProducts.jsx loaded, API_BASE=", API_BASE);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      console.log("[DEV] fetchProducts -> fetching", `${API_BASE}/api/products`);
      const res = await fetch(`${API_BASE}/api/products`);
      console.log("[DEV] fetchProducts -> status", res.status);
      if (!res.ok) {
        const txt = await res.text().catch(()=>"(no body)");
        throw new Error(`API error ${res.status}: ${txt}`);
      }
      const j = await res.json().catch(()=>({}));
      const arr = (j?.data?.products) || [];
      console.log("[DEV] fetchProducts -> count", arr.length);
      setProducts(arr);
    } catch (err) {
      console.error("[DEV] Failed to fetch products", err);
      setError(err?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  function goToCreate() {
    window.location.href = "/admin/products/new";
  }

  function handleEdit(id) {
    console.log("[DEV] AdminProducts: handleEdit", id);
    window.location.href = `/admin/products/${id}/edit`;
  }

  async function handleDelete(id) {
    console.log("[DEV] AdminProducts: handleDelete start", id);
    if (!confirm("Delete this product? This is a soft delete.")) {
      console.log("[DEV] AdminProducts: delete cancelled", id);
      return;
    }
    try {
      const token = localStorage.getItem("access_token") || "";
      console.log("[DEV] AdminProducts: token present:", !!token);
      if (!token) {
        alert("No access token found in localStorage. Please login first.");
        console.warn("[DEV] No access token in localStorage");
        return;
      }

      console.log("[DEV] AdminProducts: sending DELETE", `${API_BASE}/api/products/${id}`);
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      let j = {};
      try { j = await res.json(); } catch (e) { /* ignore non-json */ }
      console.log("[DEV] AdminProducts: DELETE response", res.status, j);

      if (!res.ok) {
        const msg = j?.message || `Delete failed (${res.status})`;
        alert(msg);
        return;
      }

      // 1) remove locally (coerce types just in case id is string/number mismatch)
      setProducts(prev => prev.filter(p => Number(p?.id) !== Number(id)));

      // 2) optionally re-sync with server to be safe
      // (useful when other filters/pagination might affect the list)
      // await fetchProducts();

      alert("Product deleted");
    } catch (err) {
      console.error("[DEV] Delete failed", err);
      alert(err?.message || "Delete failed");
    }
  }

  if (loading) return <div>Loading products…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Admin — Products</h1>
      <button type="button" onClick={goToCreate}>Create product</button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12, marginTop: 12 }}>
        {products.length === 0 && <div>No products found.</div>}
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={() => handleEdit(p.id)}
            onDelete={() => handleDelete(p.id)}
          />
        ))}
      </div>
    </div>
  );
}