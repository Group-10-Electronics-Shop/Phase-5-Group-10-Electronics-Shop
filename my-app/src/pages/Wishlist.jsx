import React from 'react';
import ProductCard from '../components/ProductCard';
export default function Wishlist(){
  const items = [];
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      {items.length === 0 ? (
        <p className="mt-4 text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {items.map(i => <ProductCard key={i.id} product={i} />)}
        </div>
      )}
    </div>
  )
}
