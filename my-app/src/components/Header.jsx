import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getName, getRole, logout } from '../utils/auth';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // React to login/logout changes that happen elsewhere
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onStorage = () => setTick(t => t + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const authed = isAuthenticated();
  const name = getName() || 'User';
  const role = getRole();

  const handleLogout = () => {
    logout();
    if (location.pathname.startsWith('/products') && role === 'admin') {
      navigate('/'); // if admin was on product management, send home
    } else {
      navigate('/');
    }
  };

  return (
    <header className="app-header">
      {/* Top strip */}
      <div className="header-inner header-top">
        <div className="brand">Electronics Shop</div>
        <div className="top-contact muted">+254 711 012 345 · <Link to="/contact">Contact</Link></div>
      </div>

      {/* Main row */}
      <div className="header-inner header-main">
        <nav className="main-nav left-group" aria-label="primary">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/products">Products</Link>
          <Link className="nav-link" to="/orders">Orders</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          <Link className="nav-link" to="/about">About</Link>
        </nav>

        <div className="center-group">
          <form
            className="search"
            onSubmit={e => {
              e.preventDefault();
              const q = e.currentTarget.elements.q.value.trim();
              navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
            }}
          >
            <input name="q" aria-label="Search" placeholder="What are you looking for?" />
            <button className="btn-search" type="submit">Search</button>
          </form>
        </div>

        <div className="right-group">
          <Link className="icon-link" to="/wishlist">♡ Wishlist</Link>
          <Link className="icon-link" to="/cart">🛒 Cart</Link>

          {!authed ? (
            <>
              <Link className="muted" to="/login">Login</Link>
              <Link className="btn-signup" to="/signup">Sign up</Link>
            </>
          ) : (
            <>
              <Link className="muted" to="/account">
                Hello, <strong>{name}</strong>{role === 'admin' ? ' (Admin)' : ''}
              </Link>
              <button className="btn-signup" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}