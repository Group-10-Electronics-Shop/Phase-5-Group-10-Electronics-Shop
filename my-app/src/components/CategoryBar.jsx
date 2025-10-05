import React from "react";
import { NavLink } from "react-router-dom";
import categories from "../data/categories";

export default function CategoryBar() {
  
  const wrap = {
    width: "100%",
    background: "#fff",
    borderBottom: "1px solid #eee",
  };
  const rail = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    overflowX: "auto",
    whiteSpace: "nowrap",
    padding: "10px 8px",
    WebkitOverflowScrolling: "touch",
  };
  const pill = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    padding: "0 14px",
    border: "1px solid #E5E7EB",
    borderRadius: 9999,
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    textDecoration: "none",
    cursor: "pointer",
  };
  const active = {
    ...pill,
    background: "#111827",
    color: "#fff",
    borderColor: "#111827",
  };

  return (
    <div style={wrap} aria-label="Browse by category">
      <div style={rail}>
        {/* “All” goes to /products, others go to /category/:slug */}
        <NavLink
          to="/products"
          end
          style={({ isActive }) => (isActive ? active : pill)}
        >
          All
        </NavLink>

        {categories
          .filter(c => c.slug !== "all")
          .map(c => (
            <NavLink
              key={c.slug}
              to={`/category/${c.slug}`}
              style={({ isActive }) => (isActive ? active : pill)}
            >
              {c.label}
            </NavLink>
          ))}
      </div>
    </div>
  );
}