import React, { useMemo } from 'react';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import sample from '../data/sampleProducts.json';

// Home should NOT mount Header or Footer — App.jsx handles those.
export default function Home(){
  const products = sample || [];

  const flashSales = useMemo(()=> products.slice(0,6), [products]);
  const bestSelling = useMemo(()=> products.slice(0,8), [products]);
  const newArrivals = useMemo(()=> products.slice(2,10), [products]);

  const handleView = (p) => { alert(`View ${p.name}`); };
  const handleEdit = (p) => { alert(`Edit ${p.name}`); };
  const handleDelete = (p) => { alert(`Delete ${p.name}`); };

  return (
    <main className="flex-1">
      <Banner />

      <section className="container">
        <ProductGrid
          title="🔥 Flash Sales"
          products={flashSales}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <section className="container">
        <ProductGrid
          title="⭐ Bestselling"
          products={bestSelling}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <section className="container">
        <ProductGrid
          title="🆕 New Arrivals"
          products={newArrivals}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}
