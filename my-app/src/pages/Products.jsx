import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import { deleteProduct, updateProduct, createProduct } from "../api";

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: 1,
    stock_quantity: 0,
    sku: "",
  });
  
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    
    try {
      await deleteProduct(id);
      dispatch(fetchProducts());
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category_id: product.category_id || 1,
      stock_quantity: product.stock_quantity || 0,
      sku: product.sku,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      
      dispatch(fetchProducts());
      setEditingProduct(null);
      setCreatingProduct(false);
      resetForm();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: 1,
      stock_quantity: 0,
      sku: "",
    });
  };

  if (status === "loading") return <p className="text-center py-10">Loading...</p>;

  const categories = [...new Set(products.map((p) => p.category_name || p.category).filter(Boolean))];
  const filteredProducts = selectedCategory
    ? products.filter((p) => (p.category_name || p.category) === selectedCategory)
    : products;

  return (
    <div className="container mx-auto px-4 py-8">
      {isAdmin && (
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <button
            onClick={() => setCreatingProduct(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Product
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-3">Categories</h2>
          <ul className="space-y-2">
            <li
              onClick={() => setSelectedCategory(null)}
              className={`cursor-pointer font-medium ${!selectedCategory ? "text-blue-600" : ""}`}
            >
              All
            </li>
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer font-medium ${selectedCategory === cat ? "text-blue-600" : ""}`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Grid */}
        <main className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg shadow p-4">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image_url || product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="h-48 w-full object-cover rounded mb-3"
                  />
                  <h2 className="text-lg font-bold">{product.name}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  <p className="font-semibold text-lg mt-2">KES {product.price?.toLocaleString()}</p>
                </Link>

                {isAdmin && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {(editingProduct || creatingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}
            </h2>
            
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
              required
            />
            
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
              rows="3"
            />
            
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
              required
            />
            
            <input
              type="number"
              placeholder="Stock Quantity"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              className="w-full border p-2 mb-2 rounded"
            />
            
            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full border p-2 mb-4 rounded"
              required
            />
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setCreatingProduct(false);
                  resetForm();
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {editingProduct ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}