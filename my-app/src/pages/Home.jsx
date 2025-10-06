import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const CATEGORIES = [
  "All","Phones","Televisions","Computers","Accessories","Cameras",
  "Tablets","Audio","Gaming","Wearables","Desktops","Laptops","Kitchenware"
];

export default function Header(){
  const navigate = useNavigate();

  function onSearchSubmit(e){
    e.preventDefault();
    const q = e.target.q.value.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  function goCat(cat){
    navigate(cat === "All" ? "/products" : `/products?category=${encodeURIComponent(cat)}`);
  }

  return (
    <header className="app-header border-b bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm">
      {/* Top strip */}
      <div className="header-inner header-top flex items-center justify-between px-6 py-3 text-sm bg-slate-900 text-white">
        <div className="brand font-bold text-lg tracking-wide">
          <NavLink to="/" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
              ES
            </div>
            Electronics Shop
          </NavLink>
        </div>
        <div className="top-contact text-slate-200 flex items-center gap-2">
          <span className="text-blue-300">📞</span>
          <span>+254 711 012 345</span>
          <span className="mx-2">·</span>
          <NavLink to="/contact" className="underline hover:text-blue-300 transition-colors">Contact</NavLink>
        </div>
      </div>

      {/* Main row */}
      <div className="header-inner header-main flex flex-wrap items-center gap-4 px-6 py-4">
        {/* Left: nav */}
        <nav className="main-nav" aria-label="primary">
          <ul className="flex flex-wrap items-center gap-6">
            <li><NavLink to="/" className="font-medium hover:text-blue-600 transition-colors">Home</NavLink></li>
            <li><NavLink to="/products" className="font-medium hover:text-blue-600 transition-colors">Products</NavLink></li>
            <li><NavLink to="/orders" className="font-medium hover:text-blue-600 transition-colors">Orders</NavLink></li>
            <li><NavLink to="/contact" className="font-medium hover:text-blue-600 transition-colors">Contact</NavLink></li>
            <li><NavLink to="/about" className="font-medium hover:text-blue-600 transition-colors">About</NavLink></li>
          </ul>
        </nav>

        {/* Center: search */}
        <form onSubmit={onSearchSubmit} className="ml-auto flex w-full max-w-xl relative group">
          <input
            name="q"
            placeholder="What are you looking for?"
            aria-label="Search"
            className="flex-1 border-2 border-slate-200 rounded-l-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <button type="submit" className="px-6 py-2.5 border-2 border-l-0 border-slate-200 rounded-r-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all group-focus-within:border-blue-500">
            Search
          </button>
        </form>

        {/* Right: actions */}
        <div className="right-group flex items-center gap-3 ml-auto">
          <NavLink className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white transition-all font-medium" to="/wishlist">
            <span className="text-lg">♡</span>
            Wishlist
          </NavLink>
          <NavLink className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white transition-all font-medium" to="/cart">
            <span className="text-lg">🛒</span>
            Cart
          </NavLink>
          <NavLink className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:bg-white rounded-lg transition-all font-medium" to="/login">
            <span className="text-lg">👤</span>
            Login
          </NavLink>
          <NavLink className="px-4 py-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 text-white font-medium hover:from-slate-900 hover:to-black transition-all shadow-md" to="/signup">
            Sign up
          </NavLink>
        </div>
      </div>

      {/* Category row */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => goCat(cat)}
              className="px-4 py-2 rounded-full border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium transition-all shadow-sm hover:shadow"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}