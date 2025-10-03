import React, { useState } from "react";
import { createProduct } from "../api/product.js";

export default function AddProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newProduct = await createProduct({
        name,
        price,
        category,
        description,
        image_url: imageUrl,
      });

      onAdd(newProduct); // send to AdminDashboard
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUrl("");
    } catch (err) {
      console.error("Failed to add product", err);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 🚨 Debug Banner: Remove this after confirming visibility */}
      <h1 className="bg-red-600 text-white text-center py-2 mb-4">
        🚨 TEST FORM IS RENDERING 🚨
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded-lg shadow bg-gray-50"
      >
        <h2 className="text-lg font-bold mb-4">Add New Product</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Price (KES)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
