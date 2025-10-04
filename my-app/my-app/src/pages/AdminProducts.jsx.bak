import React, { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/products");
      // response shape: { success, message, data: { products, pagination } }
      const list = res.data?.data?.products ?? [];
      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError(err?.response?.data?.message || err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this product? This will soft-delete (disable) it.")) return;
    try {
      await api.delete(`/api/products/${id}`);
      // optimistic UI: remove locally
      setProducts((p) => p.filter((x) => x.id !== id));
      alert("Product deleted");
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  }

  function handleEdit(id) {
    // adapt if you have in-app routing (react-router). This simply navigates.
    window.location.href = `/admin/products/${id}/edit`;
  }

  if (loading) return <div>Loading products…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Admin — Products</h1>
      <button onClick={() => (window.location.href = "/admin/products/new")}>Create product</button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12, marginTop: 12 }}>
        {products.length === 0 && <div>No products found.</div>}
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{p.name}</h3>
            <p style={{ margin: "0 0 6px 0" }}>{p.description}</p>
            <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>{`KES ${Number(p.price).toLocaleString()}`}</p>
            <p style={{ margin: "0 0 8px 0", color: "#666" }}>{p.category_name || p.category_id}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleEdit(p.id)}>Edit</button>
              <button onClick={() => handleDelete(p.id)} style={{ background: "#ff6b6b", color: "#fff" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
