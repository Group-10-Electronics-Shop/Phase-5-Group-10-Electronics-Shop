import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

function ProductList({ products, onDelete, onEdit }) {
  const { user } = useSelector((state) => state.auth);

  let isAdmin = false;
  if (user?.role) {
    const normalized = String(user.role).toLowerCase();
    isAdmin = ["admin", "superadmin", "manager"].includes(normalized);
  }

  if (!products || products.length === 0) {
    return <p className="text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAdmin={isAdmin}
          onDelete={onDelete}
          onEdit={onEdit} // ✅ new
        />
      ))}
    </div>
  );
}

export default ProductList;