import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ title, products = [], onView }){
  return (
    <section className="container product-section">
      <div className="section-head">
        <h3>{title}</h3>
      </div>

      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} onView={onView} />)}
      </div>
    </section>
  );
}
