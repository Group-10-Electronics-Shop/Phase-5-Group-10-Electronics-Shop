import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/products/ProductCard';
import { fetchProducts } from '../store/slices/productsSlice';

function HomePage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const sampleProducts = [
    { id: 101, name: 'Demo Laptop', category_name: 'Laptops', current_price: 89999, image_urls: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8']) },
    { id: 102, name: 'Demo Phone', category_name: 'Smartphones', current_price: 59999, image_urls: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9']) },
  ];

  const displayProducts = status === 'succeeded' && items.length > 0 ? items : sampleProducts;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome to Electronics Shop</h1>
      <p className="mb-6 text-gray-600">Quality electronics and fast delivery across Kenya.</p>

      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((n) => (
            <div key={n} className="card p-4 animate-pulse">
              <div className="bg-gray-200 h-40 w-full rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {status !== 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}

export default HomePage;
