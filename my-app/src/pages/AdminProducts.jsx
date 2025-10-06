import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../api/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: 0,
    sku: '',
    brand: '',
    is_active: true
  });

  useEffect(() => { 
    loadData(); 
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [prodResp, catResp] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      
      setProducts(prodResp.data?.products || []);
      setCategories(catResp.data || []);
    } catch (e) {
      console.error('Load error:', e);
      alert('Failed to load data: ' + e.message);
    } finally { 
      setLoading(false); 
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete ${product.name}?`)) return;
    
    try {
      await deleteProduct(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      alert('Product deleted successfully');
    } catch (e) {
      console.error('Delete error:', e);
      alert('Delete failed: ' + e.message);
    }
  }

  function openCreate() {
    setEditing(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: categories[0]?.id || '',
      stock_quantity: 0,
      sku: '',
      brand: '',
      is_active: true
    });
    setShowForm(true);
  }

  function openEdit(product) {
    setEditing(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity || 0,
      sku: product.sku || '',
      brand: product.brand || '',
      is_active: product.is_active !== false
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      category_id: parseInt(formData.category_id)
    };

    try {
      if (editing) {
        await updateProduct(editing.id, payload);
        alert('Product updated successfully');
      } else {
        await createProduct(payload);
        alert('Product created successfully');
      }
      
      setShowForm(false);
      await loadData();
    } catch (e) {
      console.error('Save error:', e);
      alert('Failed to save: ' + e.message);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Admin - Products Management</h2>
        <button 
          onClick={openCreate} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(prod => (
              <tr key={prod.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{prod.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{prod.name}</td>
                <td className="px-4 py-3 text-sm">{prod.category_name || '-'}</td>
                <td className="px-4 py-3 text-sm">KES {prod.price?.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{prod.stock_quantity}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${prod.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {prod.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-2">
                  <button 
                    onClick={() => openEdit(prod)} 
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(prod)} 
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editing ? 'Edit Product' : 'Create Product'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU *</label>
                  <input
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="PROD-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                />
                <label htmlFor="is_active" className="text-sm">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editing ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}