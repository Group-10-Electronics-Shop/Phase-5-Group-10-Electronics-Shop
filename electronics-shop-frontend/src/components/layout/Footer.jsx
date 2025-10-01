import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid container">
        <div>
          <h3 className="font-bold text-lg mb-2">Electronics Shop</h3>
          <p>Moi Avenue, Nairobi, Kenya</p>
          <p>Email: support@electronicsshop.co.ke</p>
          <p>Phone: +254 700 123 456</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Stay Connected</h3>
          <p>Follow us for offers and updates.</p>
          <div className="flex gap-4 mt-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Electronics Shop. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
