import React from "react";

export default function Header(){
  return (
    <header className="app-header">
      <div className="header-inner header-top">
        <div className="brand">Electronics Shop</div>
        <div className="top-contact muted">+88015-88888-9999 · <a href="/contact">Contact</a></div>
      </div>

      <div className="header-inner header-main">
        <div className="left-group">
          <nav className="main-nav" aria-label="primary">
            <a href="/" className="nav-link">Home</a>
            <a href="/products" className="nav-link">Products</a>
            <a href="/orders" className="nav-link">Orders</a>
            <a href="/contact" className="nav-link">Contact</a>
            <a href="/about" className="nav-link">About</a>
          </nav>
        </div>

        <div className="center-group">
          <div className="search">
            <input aria-label="Search" placeholder="What are you looking for?" />
            <button className="btn-search">Search</button>
          </div>
        </div>

        <div className="right-group">
          <a className="icon-link" href="/wishlist">♡ Wishlist</a>
          <a className="icon-link" href="/cart">🛒 Cart</a>
          <a className="muted" href="/login">Login</a>
          <a className="btn-signup" href="/signup">Sign up</a>
        </div>
      </div>
    </header>
  );
}