// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaClipboardList, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Get total items count from Redux store
  const cartItemCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + (item.quantity || 1), 0)
  );

  const leftLinks = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/products" },
    { name: "Login", to: "/login" },
    { name: "Register", to: "/register" },
  ];

  const rightLinks = [
    { name: "Cart", to: "/cart", icon: <FaShoppingCart />, badge: cartItemCount },
    { name: "Orders", to: "/orders", icon: <FaClipboardList /> },
    { name: "Profile", to: "/profile", icon: <FaUserCircle /> },
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="text-3xl font-bold text-white hover:text-yellow-300 transition duration-300"
        >
          Electronics Shop
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex flex-1 justify-between items-center gap-4">
          <div className="flex gap-3">
            {leftLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`px-4 py-2 bg-blue-700 rounded-full font-semibold hover:bg-yellow-400 hover:text-blue-800 transition-all duration-300 ${
                  location.pathname === link.to ? "ring-2 ring-yellow-300" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-3">
            {rightLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`relative flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-full font-semibold hover:bg-yellow-400 hover:text-blue-800 transition-all duration-300 ${
                  location.pathname === link.to ? "ring-2 ring-yellow-300" : ""
                }`}
              >
                {link.icon} {link.name}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            {menuOpen ? "✖️" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 shadow-inner rounded-b-lg">
          <div className="flex flex-col p-4 gap-2">
            {[...leftLinks, ...rightLinks].map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-yellow-400 hover:text-blue-800 transition-all duration-300 ${
                  location.pathname === link.to ? "ring-2 ring-yellow-300" : ""
                }`}
              >
                {link.icon} {link.name}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
