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
    <header className="app-header border-b bg-white">
      {/* Top strip */}
      <div className="header-inner header-top flex items-center justify-between px-4 py-2 text-sm">
        <div className="brand font-semibold text-base">
          <NavLink to="/">Electronics Shop</NavLink>
        </div>
        <div className="top-contact text-gray-600">
          +254 711 012 345 · <NavLink to="/contact" className="underline">Contact</NavLink>
        </div>
      </div>

      {/* Main row */}
      <div className="header-inner header-main flex flex-wrap items-center gap-4 px-4 py-3">
        {/* Left: nav */}
        <nav className="main-nav" aria-label="primary">
          <ul className="flex flex-wrap items-center gap-4">
            <li><NavLink to="/" className="hover:underline">Home</NavLink></li>
            <li><NavLink to="/products" className="hover:underline">Products</NavLink></li>
            <li><NavLink to="/orders" className="hover:underline">Orders</NavLink></li>
            <li><NavLink to="/contact" className="hover:underline">Contact</NavLink></li>
            <li><NavLink to="/about" className="hover:underline">About</NavLink></li>
          </ul>
        </nav>

        {/* Center: search */}
        <form onSubmit={onSearchSubmit} className="ml-auto flex w-full max-w-xl">
          <input
            name="q"
            placeholder="What are you looking for?"
            aria-label="Search"
            className="flex-1 border rounded-l px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button type="submit" className="px-4 py-2 border border-l-0 rounded-r bg-black text-white">
            Search
          </button>
        </form>

        {/* Right: actions */}
        <div className="right-group flex items-center gap-4 ml-auto">
          <NavLink className="hover:underline" to="/wishlist">Wishlist</NavLink>
          <NavLink className="hover:underline" to="/cart">Cart</NavLink>
          <NavLink className="text-gray-600 hover:underline" to="/login">Login</NavLink>
          <NavLink className="px-3 py-1 rounded bg-black text-white" to="/signup">Sign up</NavLink>
        </div>
      </div>

      {/* Category row */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => goCat(cat)}
              className="px-3 py-1.5 rounded-full border hover:bg-gray-50 text-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}