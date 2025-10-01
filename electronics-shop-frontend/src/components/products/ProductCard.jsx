import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const DEFAULT_MAP = {
  Smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  Laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  Audio: 'https://images.unsplash.com/photo-1518441902116-3d9f6b0b55b2',
  Gaming: 'https://images.unsplash.com/photo-1606813902804-8f1e6f4bfb7e',
  Tablets: 'https://images.unsplash.com/photo-1523475496153-3d6ccf56f8d8',
  Wearables: 'https://images.unsplash.com/photo-1519741499004-7acb1f5f8e3b',
};

function pickImage(product) {
  let url = 'https://via.placeholder.com/400';
  try {
    if (!product) return url;
    const raw = product.image_urls;
    if (Array.isArray(raw) && raw.length > 0) {
      url = raw[0];
    } else if (typeof raw === 'string') {
      const parsed = JSON.parse(raw || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) url = parsed[0];
    }
    if (url && url.includes('example.com')) {
      const fallback = DEFAULT_MAP[product.category_name] || DEFAULT_MAP[product.category] || DEFAULT_MAP['Smartphones'];
      url = fallback;
    }
  } catch {
    url = DEFAULT_MAP[product?.category_name] || DEFAULT_MAP['Smartphones'];
  }
  return url;
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const imageUrl = pickImage(product);
  const price = product?.current_price || product?.sale_price || product?.price || 0;

  const handleAdd = () => {
    const payload = { product_id: product.id, quantity: 1 };
    dispatch(addToCart(payload));
  };

  return (
    <div className="card p-4 flex flex-col">
      <Link to={`/product/${product.id}`}>
        <img src={imageUrl} alt={product.name} className="product-image mx-auto" loading="lazy" />
      </Link>
      <div className="mt-3 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.category_name || product.category}</p>
        <p className="text-teal-600 font-bold mt-2">KES {Number(price).toLocaleString()}</p>
      </div>
      <div className="flex justify-between items-center mt-3">
        <button onClick={handleAdd} className="btn flex gap-2">
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <Heart className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
