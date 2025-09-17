import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { Link } from "react-router-dom";

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  if (status === "loading") return <p className="text-center py-10">Loading products...</p>;
  if (status === "failed") return <p className="text-center text-red-500 py-10">Failed to load products.</p>;

  const categories = [...new Set(products.map((p) => p.category))];
  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="col-span-1 bg-gray-100 p-4 rounded-lg shadow space-y-4">
        <h2 className="font-bold text-lg">Categories</h2>
        <ul className="space-y-2">
          <li
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer font-medium ${!selectedCategory && "text-blue-600"}`}
          >
            All
          </li>
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer font-medium ${selectedCategory === cat && "text-blue-600"}`}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Products Grid */}
      <main className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <Link key={p.id} to={`/products/${p.id}`}>
            <div className="p-4 border rounded-lg shadow hover:shadow-lg">
              <img src={p.image} alt={p.name} className="h-48 w-full object-cover mb-2 rounded" />
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-700 text-sm mb-1">{p.description}</p>
              <p className="font-bold text-blue-600">KES {p.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
