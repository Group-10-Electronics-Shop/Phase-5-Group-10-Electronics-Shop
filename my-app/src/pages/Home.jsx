import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import homeBanner from "../assets/home-banner.jpg";

export default function Home() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  if (status === "loading")
    return <p className="text-center py-10">Loading products...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500 py-10">Failed to load products.</p>;

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const flashSales = filteredProducts.filter((p) => p.tags?.includes("flash"));
  const bestselling = filteredProducts.filter((p) =>
    p.tags?.includes("bestselling")
  );
  const newArrivals = filteredProducts.filter((p) => p.tags?.includes("new"));

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Banner */}
      <div className="relative">
        <img
          src={homeBanner}
          alt="Banner"
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-30 text-white text-center p-4">
          <h1 className="text-3xl md:text-5xl font-bold">Welcome to Electronics Shop</h1>
          <p className="mt-2 text-lg md:text-2xl">Best Deals on Electronics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-gray-100 p-4 rounded-lg shadow space-y-6">
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

        {/* Main Content */}
        <main className="col-span-3 space-y-10">
          {flashSales.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">🔥 Flash Sales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashSales.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="p-4 border rounded-lg shadow hover:shadow-lg block"
                  >
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="mb-2 rounded h-48 w-full object-contain bg-gray-100"
                    />
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-700 text-sm mb-1">{item.description}</p>
                    <p className="text-red-500 font-bold">KES {item.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {bestselling.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">⭐ Bestselling</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bestselling.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="p-4 border rounded-lg shadow hover:shadow-lg block"
                  >
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="mb-2 rounded h-48 w-full object-contain bg-gray-100"
                    />
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-700 text-sm mb-1">{item.description}</p>
                    <p className="text-blue-600 font-bold">KES {item.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {newArrivals.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">🆕 New Arrivals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {newArrivals.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="p-4 border rounded-lg shadow hover:shadow-lg block"
                  >
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="mb-2 rounded h-48 w-full object-contain bg-gray-100"
                    />
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-700 text-sm mb-1">{item.description}</p>
                    <p className="text-green-600 font-bold">KES {item.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
