import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaUserCircle, FaHeart } from "react-icons/fa";

export default function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-gray-200">
        Electronics Shop
      </Link>

      {/* Center Nav Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/products" className="hover:underline">Products</Link>
        <Link to="/orders" className="hover:underline">Orders</Link>
      </div>

      {/* Right Icons / User */}
      <div className="flex items-center space-x-4">
        {user ? (
          // If logged in → Show user name linking to profile
          <Link to="/profile" className="flex items-center hover:underline">
            <FaUserCircle className="mr-1" /> {user.name}
          </Link>
        ) : (
          // If not logged in → Show Login/Register
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}

        {/* Wishlist */}
        <Link to="/wishlist" className="relative hover:text-gray-200">
          <FaHeart size={20} />
        </Link>

        {/* Cart with Count */}
        <Link to="/cart" className="relative hover:text-gray-200">
          <FaShoppingCart size={20} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
