import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { orders } from '../api';
import { useNavigate } from 'react-router-dom';

const getPrice = (p) => p.current_price || p.sale_price || p.price || 0;
const pickImage = (p) => {
  try {
    const raw = p.image_urls;
    if (Array.isArray(raw) && raw.length) return raw[0];
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw || '[]');
      if (Array.isArray(parsed) && parsed.length) return parsed[0];
    }
  } catch {}
  return 'https://via.placeholder.com/100';
};

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart);
  const [form, setForm] = useState({ fullName: '', phone: '+254', address: '', city: 'Nairobi', paymentMethod: 'mpesa' });

  const subtotal = cart.items.reduce((acc, it) => {
    const product = it.product || it;
    const qty = it.quantity || it.qty || 1;
    return acc + getPrice(product) * qty;
  }, 0);

  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const payload = {
      items: cart.items.map((it) => ({ product_id: (it.product || it).id, quantity: it.quantity || it.qty || 1 })),
      customer: form,
      total,
    };
    try {
      await orders.create(payload);
      dispatch(clearCart());
      navigate('/account');
    } catch (err) {
      alert('Order failed. Please ensure backend is running and reachable.');
    }
  };

  if (!cart.items || cart.items.length === 0) return <div className="max-w-4xl mx-auto card p-6 text-center">Your cart is empty.</div>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="md:col-span-2 card p-6">
        <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" className="input" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" required />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input" required />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input" required />
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input">
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>
          <button type="submit" className="btn w-full">Place Order (KES {total.toLocaleString()})</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {cart.items.map((it) => {
            const p = it.product || it;
            const qty = it.quantity || it.qty || 1;
            return (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={pickImage(p)} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">x {qty}</div>
                  </div>
                </div>
                <div className="font-semibold text-teal-600">KES {(getPrice(p) * qty).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `KES ${shipping}`}</span></div>
          <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
