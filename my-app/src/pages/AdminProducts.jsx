import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api/api';
import ProductGrid from '../components/ProductGrid';
import ProductForm from '../components/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getProducts('?limit=200');
      setProducts(data?.products || data || []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally { setLoading(false); }
  }

  async function handleDelete(prod) {
    if (!confirm(`Delete ${prod.name}?`)) return;
    const prev = products;
    setProducts(p => p.filter(x => x.id !== prod.id));
    try { await deleteProduct(prod.id); } catch (e) { alert('Delete failed — reverting.'); setProducts(prev); }
  }

  function openCreate() { setEditing(null); setShowForm(true); }
  function openEdit(prod) { setEditing(prod); setShowForm(true); }

  async function handleSaved(resp) {
    setShowForm(false);
    // reload list — safer than merging
    await load();
  }

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Admin — Products</h2>
        <div>
          <button onClick={openCreate} className="px-3 py-2 bg-green-600 text-white rounded">Add product</button>
        </div>
      </div>

      <ProductGrid products={products} onView={()=>{}} onEdit={openEdit} onDelete={handleDelete} />

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start md:items-center justify-center p-4 z-30">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Product' : 'Create Product'}</h3>
            <ProductForm product={editing} onSaved={handleSaved} onCancel={()=>setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}