import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/auth';

export default function ProductCard({ product, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="w-full h-40 object-contain" />
      <div className="mt-2">
        <h3 className="font-medium">{product.name}</h3>
        <div className="text-sm text-gray-500">{product.category}</div>
        <div className="mt-1 font-semibold">KES {product.price.toLocaleString()}</div>
        <div className="mt-2 flex gap-2">
          <Link className="btn-sm" to={`/products/${product.id}`}>View</Link>
          {isAdmin() && (
            <>
              <button className="btn-sm" onClick={() => onEdit ? onEdit(product) : navigate(`/products/${product.id}/edit`)}>
                Edit
              </button>
              <button className="btn-sm danger" onClick={() => onDelete && onDelete(product.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}