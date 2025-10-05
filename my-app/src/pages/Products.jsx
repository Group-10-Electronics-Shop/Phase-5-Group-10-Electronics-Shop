import React from 'react';
import ProductGrid from '../components/ProductGrid';
import sample from '../data/sampleProducts.json';

export default function Products(){
  const products = sample || [];
  return (
    <div style={{padding:20}}>
      <h1>Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}