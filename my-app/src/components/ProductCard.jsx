import React from "react";

function ProductCard({ product, isAdmin, onDelete, onEdit }) {
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col">
      <img
        src={product.image_url}
        alt={product.name}
        className="h-40 w-full object-cover rounded mb-3"
      />

      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-semibold">KES {product.price}</p>
      <p className="text-sm text-gray-500">{product.category}</p>

      {/* ✅ Admin Controls */}
      {isAdmin && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;

