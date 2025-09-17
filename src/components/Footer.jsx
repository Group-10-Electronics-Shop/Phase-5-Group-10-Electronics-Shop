import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-10">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:underline">My Account</Link></li>
            <li><Link to="/login" className="hover:underline">Login/Register</Link></li>
            <li><Link to="/cart" className="hover:underline">Cart</Link></li>
            <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="hover:underline">Terms of Use</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Electronics Shop</h3>
          <p className="text-sm">Delivering quality electronics with fast shipping and excellent customer service.</p>
        </div>
      </div>

      <div className="text-center text-xs py-4 bg-gray-900">
        &copy; {new Date().getFullYear()} Electronics Shop. All rights reserved.
      </div>
    </footer>
  );
}
