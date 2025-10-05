import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import sample from '../data/sampleProducts.json';
import ProductGrid from '../components/ProductGrid';

const fmtKES = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 });

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

 
  const product = useMemo(() => {
    if (!id) return null;
    const byId = sample.find(p => String(p.id) === String(id));
    if (byId) return byId;
    const needle = decodeURIComponent(id).toLowerCase().replace(/[-_]+/g, ' ').trim();
    return sample.find(p => p.name.toLowerCase() === needle) || null;
  }, [id]);


  if (!product) {
    return (
      <div className="p-6">
        <p className="mb-3">Product not found.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const [qty, setQty] = useState(1);
  const price = product.price ?? 0; 


  const related = useMemo(() => {
    const pool = product.category
      ? sample.filter(p => p.category === product.category && p.id !== product.id)
      : sample.filter(p => p.id !== product.id);
    return pool.slice(0, 8);
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline">Home</Link> <span>/</span>{' '}
        <Link to="/products" className="hover:underline">Product</Link> <span>/</span>{' '}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white border rounded-xl p-6 flex items-center justify-center">
          {/* Use product.image if provided; fallback to placeholder */}
          {/* You already have /public/images/placeholder.png */}
          <img
            src={product.image || '/images/placeholder.png'}
            alt={product.name}
            className="max-h-96 object-contain"
            onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-semibold mb-1">{product.name}</h1>
          <div className="text-sm text-gray-500 mb-3">(150 Reviews) • In Stock</div>

          <div className="text-2xl font-bold mb-4">{fmtKES.format(price)}</div>

          <p className="text-gray-700 mb-6">
            PlayStation 5 Controller Skin. High quality vinyl with air-channel adhesive for easy
            bubble-free install & mess-free removal. Pressure sensitive.
          </p>

          {/* Colour / Size selectors (demo only) */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="min-w-16 text-sm text-gray-600">Colours:</span>
              <button className="w-6 h-6 rounded-full border bg-black" aria-label="Black" />
              <button className="w-6 h-6 rounded-full border bg-gray-300" aria-label="Silver" />
              <button className="w-6 h-6 rounded-full border bg-red-500" aria-label="Red" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="min-w-16 text-sm text-gray-600">Size:</span>
              {['XS','S','M','L','XL'].map(s => (
                <button key={s} className="px-3 py-1 border rounded hover:bg-gray-50">{s}</button>
              ))}
            </div>
          </div>

          {/* Quantity + Actions */}
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center border rounded-lg overflow-hidden">
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setQty(q => Math.max(1, q - 1))}
              >−</button>
              <input
                value={qty}
                onChange={e => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                className="w-14 text-center outline-none"
              />
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setQty(q => q + 1)}
              >+</button>
            </div>

            <button className="px-5 py-2 rounded bg-black text-white">Buy Now</button>
            <button className="px-5 py-2 rounded border">Add To Cart</button>
          </div>

          {/* Delivery / Returns */}
          <div className="grid gap-3">
            <div className="border rounded-lg p-3">
              <div className="font-medium">Free Delivery</div>
              <div className="text-sm text-gray-600">
                Enter your postal code for delivery availability
              </div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-medium">Return Delivery</div>
              <div className="text-sm text-gray-600">
                Free 30 days delivery returns. Details
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-sm text-gray-600">
            Support: <span className="font-medium">electronicsshop@gmail.com</span> ·{' '}
            <span className="font-medium">+254 711 012 3456</span> ·{' '}
            <span className="font-medium">00134 Nairobi</span>
          </div>
        </div>
      </div>

      {/* Related Items */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Related Items</h2>
          <Link to="/products" className="text-sm underline">View All</Link>
        </div>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}