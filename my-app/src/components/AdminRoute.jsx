import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import ProductList from "../components/ProductList";
import AddProductForm from "../components/AddProductForm";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // detect admin from redux
  let isAdmin = false;
  if (user?.role) {
    const normalized = String(user.role).toLowerCase();
    isAdmin = ["admin", "superadmin", "manager"].includes(normalized);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleAdd = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Show add product form only if admin */}
      {isAdmin && <AddProductForm onAdd={handleAdd} />}

      <ProductList products={products} onDelete={handleDelete} />
    </div>
  );
}
