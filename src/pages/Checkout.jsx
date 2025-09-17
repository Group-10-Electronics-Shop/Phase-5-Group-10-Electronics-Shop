import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  if (cartItems.length === 0)
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <p className="text-gray-500">Your cart is empty.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Continue Shopping</Link>
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <p>{item.name}</p>
            <p>KES {item.price.toLocaleString()}</p>
          </div>
        ))}
        <p className="font-bold text-right text-lg">Total: KES {total.toLocaleString()}</p>

        <div className="mt-4 space-y-2 text-sm">
          <p><strong>M-Pesa:</strong> Send payment to 0712345678. Use your order ID as reference.</p>
          <p><strong>Airtel Money:</strong> Send payment to 0701234567. Include order ID.</p>
          <p><strong>PayPal:</strong> Pay via PayPal to payments@electronics-shop.com. Include order ID.</p>
          <p><strong>Card:</strong> Enter your card details securely here.</p>
        </div>

        <button className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Complete Payment
        </button>
      </div>
    </div>
  );
}
