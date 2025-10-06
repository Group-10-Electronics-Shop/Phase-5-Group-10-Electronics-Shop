import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ProductCard({ product, isAdmin, onDelete, onEdit }) {
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url || product.image || "https://via.placeholder.com/300"}
          alt={product.name}
          className="h-48 w-full object-cover rounded mb-3"
        />
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        <p className="font-semibold text-lg mt-2">KES {product.price?.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{product.category_name || product.category}</p>
      </Link>

      {isAdmin && onEdit && onDelete && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(product);
            }}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(product.id);
            }}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ProductList({ products, onDelete, onEdit }) {
  const { user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAdmin={isAdmin}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default ProductList;