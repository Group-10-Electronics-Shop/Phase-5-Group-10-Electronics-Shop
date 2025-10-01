import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, Heart } from 'lucide-react';

function Header() {
  return (
    <header className="header shadow">
      <div className="header-inner container mx-auto">
        <Link to="/" className="logo">
          <img src="https://img.icons8.com/color/96/electronics.png" alt="Electronics Shop Logo" />
          <span>Electronics Shop</span>
        </Link>
        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-teal-400 font-bold' : '')}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-teal-400 font-bold' : '')}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'text-teal-400 font-bold' : '')}>Contact</NavLink>
          <NavLink to="/account" className={({ isActive }) => (isActive ? 'text-teal-400 font-bold' : '')}>Account</NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-teal-400 font-bold' : '')}>Login</NavLink>
        </nav>
        <div className="flex gap-4 items-center">
          <Link to="/wishlist" className="relative">
            <Heart className="w-6 h-6" />
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
          </Link>
          <Link to="/account">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
