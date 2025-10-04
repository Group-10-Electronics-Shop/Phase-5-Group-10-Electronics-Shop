import React from "react";

export default function ProductCard({ product = {}, onEdit, onDelete }) {
  const price = (product?.current_price != null)
    ? product.current_price
    : (product?.price != null ? product.price : 0);
  const formatted = "KES " + Number(price || 0).toLocaleString();

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ margin: "0 0 8px 0" }}>{product?.name}</h3>
      <p style={{ margin: "0 0 6px 0" }}>{product?.description}</p>
      <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>{formatted}</p>
      <p style={{ margin: "0 0 8px 0", color: "#666" }}>{product?.category_name || product?.category_id || "Category:"}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={() => {
          console.log("[DEV] ProductCard: Edit clicked", product?.id, "onEdit:", typeof onEdit);
          if (typeof onEdit === "function") onEdit(product?.id);
        }}>Edit</button>

        <button type="button" onClick={() => {
          console.log("[DEV] ProductCard: Delete clicked", product?.id, "onDelete:", typeof onDelete);
          if (typeof onDelete === "function") onDelete(product?.id);
        }} style={{ background: "#ff6b6b", color: "#fff" }}>
          Delete
        </button>
      </div>
    </div>
  );
}