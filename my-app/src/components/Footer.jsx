import React from "react";

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand">Electronics Shop</div>
          <div className="muted">Delivering quality electronics with fast shipping and excellent customer service.</div>
        </div>

        <div className="footer-contact">
          <h4>Support</h4>
          <div>electronicsshop@gmail.com</div>
          <div>+254 7110123456</div>
        </div>

        <div className="footer-links">
          <h4>Quick links</h4>
          <div>Account · My Account · Orders · Wishlist</div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2025 Electronics Shop. All rights reserved.</div>
      </div>
    </footer>
  );
}