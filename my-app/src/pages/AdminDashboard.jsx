import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import { fetchProducts, deleteProduct, updateProduct, createProduct } from "../api/product.js";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false); // ✅ state for create modal
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProduct(editingProduct.id, editingProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingProduct(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ✅ Handle Create
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await createProduct(newProduct);
      setProducts((prev) => [...prev, created]);
      setNewProduct({ name: "", description: "", price: "", category: "" });
      setCreatingProduct(false);
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* ✅ Create Product Button */}
      <button
        onClick={() => setCreatingProduct(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Create Product
      </button>

      {/* ✅ Product List */}
      <ProductList
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* ✅ Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded shadow-lg w-96"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Name"
            />

            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
              className="w-full border p-2 mb-2"
              placeholder="Description"
            />

            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Price"
            />

            <input
              type="text"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
              className="w-full border p-2 mb-2"
              placeholder="Category"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Create Modal */}
      {creatingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded shadow-lg w-96"
          >
            <h2 className="text-xl font-semibold mb-4">Create Product</h2>

            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Name"
              required
            />

            <textarea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Description"
            />

            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Price"
              required
            />

            <input
              type="text"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="w-full border p-2 mb-2"
              placeholder="Category"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreatingProduct(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
