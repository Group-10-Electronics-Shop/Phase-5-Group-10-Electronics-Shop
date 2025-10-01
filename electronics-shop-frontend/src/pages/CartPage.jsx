import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const pickImage = (product) => {
  try {
    const raw = product.image_urls;
    if (Array.isArray(raw) && raw.length) return raw[0];
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw || '[]');
      if (Array.isArray(parsed) && parsed.length) return parsed[0];
    }
  } catch {}
  return 'https://via.placeholder.com/120';
};

const getPrice = (product) => product.current_price || product.sale_price || product.price || 0;

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.cart);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  if (status === 'loading') {
    return <div className="max-w-4xl mx-auto p-6 animate-pulse"><div className="h-8 bg-gray-200 w-1/3 mb-4" /></div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto card p-6 text-center">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link to="/" className="btn mt-4">Continue Shopping</Link>
      </div>
    );
  }

  const total = items.reduce((s, it) => {
    const product = it.product || it;
    const qty = it.quantity || it.qty || 1;
    return s + getPrice(product) * qty;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product || item;
            const qty = item.quantity || item.qty || 1;
            const price = getPrice(product);
            return (
              <div key={product.id} className="card p-4 flex gap-4 items-center">
                <img src={pickImage(product)} alt={product.name} className="w-28 h-28 object-contain bg-white p-2 rounded" />
                <div className="flex-1">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-500">KES {Number(price).toLocaleString()}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => dispatch(updateCartItem({ itemId: item.id || product.id, payload: { quantity: Math.max(1, qty - 1) } }))} className="px-2 py-1 border rounded">-</button>
                    <input value={qty} readOnly className="w-12 text-center border rounded" />
                    <button onClick={() => dispatch(updateCartItem({ itemId: item.id || product.id, payload: { quantity: qty + 1 } }))} className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">KES {(price * qty).toLocaleString()}</p>
                  <button onClick={() => dispatch(removeFromCart(item.id || product.id))} className="text-sm text-red-500 mt-2">Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card p-4">
          <h3 className="font-bold text-lg mb-3">Order Summary</h3>
          <div className="flex justify-between mb-2"><span>Subtotal</span><span>KES {total.toLocaleString()}</span></div>
          <div className="flex justify-between mb-2"><span>Shipping</span><span>{total > 10000 ? 'Free' : 'KES 500'}</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-3"><span>Total</span><span>KES {(total + (total > 10000 ? 0 : 500)).toLocaleString()}</span></div>
          <button onClick={() => navigate('/checkout')} className="btn w-full mt-4">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
