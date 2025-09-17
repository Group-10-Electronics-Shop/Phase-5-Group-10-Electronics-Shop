import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  if (cartItems.length === 0)
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Continue Shopping</Link>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-700 text-sm">KES {item.price.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <p className="font-bold text-right text-lg">Total: KES {total.toLocaleString()}</p>

        <div className="mt-4 text-sm space-y-2">
          <p><strong>M-Pesa:</strong> Send payment to 0712345678. Use your order ID as reference.</p>
          <p><strong>Airtel Money:</strong> Send payment to 0701234567. Include order ID.</p>
          <p><strong>PayPal:</strong> Pay via PayPal to payments@electronics-shop.com. Include order ID.</p>
          <p><strong>Card:</strong> Enter your card details securely on the checkout page.</p>
        </div>

        <Link
          to="/checkout"
          className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
