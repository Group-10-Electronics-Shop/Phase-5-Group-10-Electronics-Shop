import React, { useEffect, useState } from "react";
import { api } from "../api/client";

/**
 * AdminProducts page
 * - Fetches products
 * - Allows editing (inline modal) and soft-delete (is_active=false) via API
 *
 * Assumptions:
 * - The API endpoint GET /api/products returns success response where
 *   products are at res.data.data.products (fallbacks included).
 * - The Axios instance `api` is configured in src/api/client.js and attaches Authorization header.
 */

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // id currently being edited/deleted
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/products");
      // handle both response shapes
      const fetched = res?.data?.data?.products ?? res?.data?.products ?? [];
      setProducts(fetched);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this product? This will disable (soft-delete) it.");
    if (!ok) return;

    setBusyId(id);
    setError(null);
    setSuccessMsg(null);

    // optimistic update: keep a copy in case API fails
    const prev = [...products];
    setProducts(products.filter((p) => p.id !== id));

    try {
      await api.delete(`/api/products/${id}`);
      setSuccessMsg("Product deleted successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete product. Reverting changes.");
      setProducts(prev); // revert
    } finally {
      setBusyId(null);
      // clear messages after a bit
      setTimeout(() => {
        setSuccessMsg(null);
        setError(null);
      }, 3500);
    }
  }

  function openEdit(product) {
    setEditProduct({
      id: product.id,
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? 0,
      stock_quantity: product.stock_quantity ?? 0,
      brand: product.brand ?? "",
      category_id: product.category_id ?? null,
      is_active: product.is_active ?? true,
    });
    setEditing(true);
  }

  function closeEdit() {
    setEditing(false);
    setEditProduct(null);
    setError(null);
    setSuccessMsg(null);
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editProduct || !editProduct.id) return;
    setSaving(true);
    setBusyId(editProduct.id);
    setError(null);
    setSuccessMsg(null);

    try {
      // Only send fields we allow editing
      const payload = {
        name: editProduct.name,
        description: editProduct.description,
        price: Number(editProduct.price),
        stock_quantity: Number(editProduct.stock_quantity),
        brand: editProduct.brand,
        // optional: category_id, is_active if you want to allow
      };

      const res = await api.put(`/api/products/${editProduct.id}`, payload);
      // update local state with returned product where possible
      const returned = res?.data?.data ?? null;

      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? (returned ?? { ...p, ...payload }) : p))
      );

      setSuccessMsg("Product updated successfully.");
      closeEdit();
    } catch (err) {
      console.error("Update failed", err);
      // try to surface a message
      const apiMsg = err?.response?.data?.message || err?.message;
      setError(`Failed to update product: ${apiMsg}`);
    } finally {
      setSaving(false);
      setBusyId(null);
      setTimeout(() => {
        setSuccessMsg(null);
        setError(null);
      }, 3500);
    }
  }

  // tiny helper: safe display price
  function fmtPrice(val) {
    if (val == null) return "-";
    // assume price in whole currency units
    return val.toLocaleString();
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin — Products</h1>

      {loading ? (
        <div>Loading products…</div>
      ) : (
        <>
          {error && (
            <div style={{ color: "white", background: "#ef4444", padding: 8, borderRadius: 6, marginBottom: 12 }}>
              {error}
            </div>
          )}
          {successMsg && (
            <div style={{ color: "white", background: "#10b981", padding: 8, borderRadius: 6, marginBottom: 12 }}>
              {successMsg}
            </div>
          )}

          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: 12,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    background: "#fff",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                    <div style={{ width: 96, height: 72, background: "#f3f4f6", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 12 }}>
                      Image
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{p.description}</div>
                      <div style={{ marginTop: 6, fontSize: 14 }}>
                        <strong>KES {fmtPrice(p.price)}</strong> · <span style={{ color: "#374151" }}>{p.category_name ?? "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => openEdit(p)}
                      disabled={busyId === p.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #2563eb",
                        background: "#2563eb",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={busyId === p.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #ef4444",
                        background: "#fff",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      {busyId === p.id ? "Working…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Modal (very small) */}
      {editing && editProduct && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            zIndex: 60,
            padding: 20,
          }}
          onClick={(e) => {
            // close when clicking outside content
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <form
            onSubmit={saveEdit}
            style={{
              width: 760,
              maxWidth: "100%",
              background: "#ffffff",
              padding: 18,
              borderRadius: 8,
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>Edit product — #{editProduct.id}</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={closeEdit} style={{ padding: "6px 10px", borderRadius: 6 }}>
                  Cancel
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Name</label>
                <input
                  value={editProduct.name}
                  onChange={(e) => setEditProduct((s) => ({ ...s, name: e.target.value }))}
                  required
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                />

                <label style={{ display: "block", fontSize: 13, marginTop: 10, marginBottom: 6 }}>Description</label>
                <textarea
                  value={editProduct.description}
                  onChange={(e) => setEditProduct((s) => ({ ...s, description: e.target.value }))}
                  rows={4}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                />

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Brand</label>
                    <input
                      value={editProduct.brand}
                      onChange={(e) => setEditProduct((s) => ({ ...s, brand: e.target.value }))}
                      style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                    />
                  </div>

                  <div style={{ width: 160 }}>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Price (KES)</label>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct((s) => ({ ...s, price: e.target.value }))}
                      required
                      style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Stock quantity</label>
                <input
                  type="number"
                  value={editProduct.stock_quantity}
                  onChange={(e) => setEditProduct((s) => ({ ...s, stock_quantity: e.target.value }))}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb", marginBottom: 12 }}
                />

                <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Active</label>
                <select
                  value={editProduct.is_active ? "true" : "false"}
                  onChange={(e) => setEditProduct((s) => ({ ...s, is_active: e.target.value === "true" }))}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb", marginBottom: 12 }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>

                <div style={{ marginTop: 20 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>

                {error && <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>}
                {successMsg && <div style={{ color: "#10b981", marginTop: 8 }}>{successMsg}</div>}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
EOFmkdir -p my-app/src/pages
cat > my-app/src/pages/AdminProducts.jsx <<'EOF'
import React, { useEffect, useState } from "react";
import { api } from "../api/client";

/**
 * AdminProducts page
 * - Fetches products
 * - Allows editing (inline modal) and soft-delete (is_active=false) via API
 *
 * Assumptions:
 * - The API endpoint GET /api/products returns success response where
 *   products are at res.data.data.products (fallbacks included).
 * - The Axios instance `api` is configured in src/api/client.js and attaches Authorization header.
 */

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // id currently being edited/deleted
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/products");
      // handle both response shapes
      const fetched = res?.data?.data?.products ?? res?.data?.products ?? [];
      setProducts(fetched);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this product? This will disable (soft-delete) it.");
    if (!ok) return;

    setBusyId(id);
    setError(null);
    setSuccessMsg(null);

    // optimistic update: keep a copy in case API fails
    const prev = [...products];
    setProducts(products.filter((p) => p.id !== id));

    try {
      await api.delete(`/api/products/${id}`);
      setSuccessMsg("Product deleted successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete product. Reverting changes.");
      setProducts(prev); // revert
    } finally {
      setBusyId(null);
      // clear messages after a bit
      setTimeout(() => {
        setSuccessMsg(null);
        setError(null);
      }, 3500);
    }
  }

  function openEdit(product) {
    setEditProduct({
      id: product.id,
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? 0,
      stock_quantity: product.stock_quantity ?? 0,
      brand: product.brand ?? "",
      category_id: product.category_id ?? null,
      is_active: product.is_active ?? true,
    });
    setEditing(true);
  }

  function closeEdit() {
    setEditing(false);
    setEditProduct(null);
    setError(null);
    setSuccessMsg(null);
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editProduct || !editProduct.id) return;
    setSaving(true);
    setBusyId(editProduct.id);
    setError(null);
    setSuccessMsg(null);

    try {
      // Only send fields we allow editing
      const payload = {
        name: editProduct.name,
        description: editProduct.description,
        price: Number(editProduct.price),
        stock_quantity: Number(editProduct.stock_quantity),
        brand: editProduct.brand,
        // optional: category_id, is_active if you want to allow
      };

      const res = await api.put(`/api/products/${editProduct.id}`, payload);
      // update local state with returned product where possible
      const returned = res?.data?.data ?? null;

      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? (returned ?? { ...p, ...payload }) : p))
      );

      setSuccessMsg("Product updated successfully.");
      closeEdit();
    } catch (err) {
      console.error("Update failed", err);
      // try to surface a message
      const apiMsg = err?.response?.data?.message || err?.message;
      setError(`Failed to update product: ${apiMsg}`);
    } finally {
      setSaving(false);
      setBusyId(null);
      setTimeout(() => {
        setSuccessMsg(null);
        setError(null);
      }, 3500);
    }
  }

  // tiny helper: safe display price
  function fmtPrice(val) {
    if (val == null) return "-";
    // assume price in whole currency units
    return val.toLocaleString();
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin — Products</h1>

      {loading ? (
        <div>Loading products…</div>
      ) : (
        <>
          {error && (
            <div style={{ color: "white", background: "#ef4444", padding: 8, borderRadius: 6, marginBottom: 12 }}>
              {error}
            </div>
          )}
          {successMsg && (
            <div style={{ color: "white", background: "#10b981", padding: 8, borderRadius: 6, marginBottom: 12 }}>
              {successMsg}
            </div>
          )}

          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: 12,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    background: "#fff",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                    <div style={{ width: 96, height: 72, background: "#f3f4f6", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 12 }}>
                      Image
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{p.description}</div>
                      <div style={{ marginTop: 6, fontSize: 14 }}>
                        <strong>KES {fmtPrice(p.price)}</strong> · <span style={{ color: "#374151" }}>{p.category_name ?? "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => openEdit(p)}
                      disabled={busyId === p.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #2563eb",
                        background: "#2563eb",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={busyId === p.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #ef4444",
                        background: "#fff",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      {busyId === p.id ? "Working…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Modal (very small) */}
      {editing && editProduct && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            zIndex: 60,
            padding: 20,
          }}
          onClick={(e) => {
            // close when clicking outside content
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <form
            onSubmit={saveEdit}
            style={{
              width: 760,
              maxWidth: "100%",
              background: "#ffffff",
              padding: 18,
              borderRadius: 8,
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>Edit product — #{editProduct.id}</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={closeEdit} style={{ padding: "6px 10px", borderRadius: 6 }}>
                  Cancel
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Name</label>
                <input
                  value={editProduct.name}
                  onChange={(e) => setEditProduct((s) => ({ ...s, name: e.target.value }))}
                  required
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                />

                <label style={{ display: "block", fontSize: 13, marginTop: 10, marginBottom: 6 }}>Description</label>
                <textarea
                  value={editProduct.description}
                  onChange={(e) => setEditProduct((s) => ({ ...s, description: e.target.value }))}
                  rows={4}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                />

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Brand</label>
                    <input
                      value={editProduct.brand}
                      onChange={(e) => setEditProduct((s) => ({ ...s, brand: e.target.value }))}
                      style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                    />
                  </div>

                  <div style={{ width: 160 }}>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Price (KES)</label>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct((s) => ({ ...s, price: e.target.value }))}
                      required
                      style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb" }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Stock quantity</label>
                <input
                  type="number"
                  value={editProduct.stock_quantity}
                  onChange={(e) => setEditProduct((s) => ({ ...s, stock_quantity: e.target.value }))}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb", marginBottom: 12 }}
                />

                <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Active</label>
                <select
                  value={editProduct.is_active ? "true" : "false"}
                  onChange={(e) => setEditProduct((s) => ({ ...s, is_active: e.target.value === "true" }))}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e5e7eb", marginBottom: 12 }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>

                <div style={{ marginTop: 20 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>

                {error && <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>}
                {successMsg && <div style={{ color: "#10b981", marginTop: 8 }}>{successMsg}</div>}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
