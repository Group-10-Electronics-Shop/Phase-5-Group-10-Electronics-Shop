import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';

const pickImage = (product) => {
  const DEFAULT = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8';
  try {
    const raw = product?.image_urls;
    if (Array.isArray(raw) && raw.length) return raw[0];
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw || '[]');
      if (Array.isArray(parsed) && parsed.length) return parsed[0];
    }
    return DEFAULT;
  } catch { return DEFAULT; }
};

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, status } = useSelector((s) => s.products);

  useEffect(() => { if (id) dispatch(fetchProductById(id)); }, [dispatch, id]);

  if (status === 'loading') {
    return <div className="max-w-4xl mx-auto p-6 animate-pulse"><div className="h-64 bg-gray-200 rounded mb-6" /></div>;
  }

  if (!selectedProduct) {
    return <div className="max-w-4xl mx-auto card p-6">Product not found.</div>;
  }

  const imageUrl = pickImage(selectedProduct);
  const price = selectedProduct.current_price || selectedProduct.sale_price || selectedProduct.price || 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: selectedProduct.id, quantity: 1 })).then(() => navigate('/cart'));
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="card p-6">
        <img src={imageUrl} alt={selectedProduct.name} className="product-image" />
      </div>
      <div className="p-2">
        <h1 className="text-2xl font-bold mb-2">{selectedProduct.name}</h1>
        <p className="text-sm text-gray-500 mb-3">{selectedProduct.category_name}</p>
        <p className="text-teal-600 font-bold text-xl">KES {Number(price).toLocaleString()}</p>
        <p className="mt-4 text-gray-700">{selectedProduct.description}</p>
        <div className="mt-6 flex gap-4">
          <button onClick={handleAddToCart} className="btn">Add to Cart</button>
          <button onClick={() => alert('Added to wishlist')} className="p-2 rounded-md border">Add to Wishlist</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
