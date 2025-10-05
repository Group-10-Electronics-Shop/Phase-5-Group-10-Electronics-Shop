import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  // Palette
  const bg = "#111827";        // gray-900
  const text = "#D1D5DB";      // gray-300
  const textMuted = "#9CA3AF"; // gray-400
  const white = "#FFFFFF";
  const divider = "#1F2937";   // gray-800

  // Layout styles
  const outer = { backgroundColor: bg, color: text, width: "100%" };
  const container = { maxWidth: 1120, margin: "0 auto", padding: "48px 16px" };
  const cols = { display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", alignItems: "flex-start" };
  const col = { minWidth: 220, flex: "1 1 220px" };
  const h = { color: white, fontWeight: 600, fontSize: 16, marginBottom: 12 };
  const list = { listStyle: "none", margin: 0, padding: 0, lineHeight: 1.8, fontSize: 14 };
  const link = { color: text, textDecoration: "none", cursor: "pointer" };
  const bottom = {
    borderTop: `1px solid ${divider}`,
    padding: "16px 0",
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
    color: textMuted,
  };

  // Simple modal logic (accessible)
  const [openPanel, setOpenPanel] = useState(null); // 'privacy' | 'terms' | 'faq' | null
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenPanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Prevent scroll when modal open
  useEffect(() => {
    if (openPanel) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [openPanel]);

  // Reusable modal
  const Modal = ({ title, children }) => {
    if (!openPanel) return null;
    return (
      <div
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) setOpenPanel(null); }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "grid",
          placeItems: "center",
          zIndex: 50
        }}
        aria-modal="true"
        role="dialog"
      >
        <div
          style={{
            width: "min(800px, 92vw)",
            maxHeight: "80vh",
            overflow: "auto",
            background: "#0B1220",
            color: "#E5E7EB",
            border: `1px solid ${divider}`,
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${divider}` }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h3>
            <button
              onClick={() => setOpenPanel(null)}
              aria-label="Close"
              style={{ background: "transparent", border: 0, color: "#9CA3AF", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: 20, lineHeight: 1.7, fontSize: 14 }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <footer style={outer}>
      <div style={container}>
        {/* Top columns */}
        <div style={cols}>
          {/* Brand / Contact */}
          <div style={col}>
            <h3 style={{ ...h, fontSize: 18 }}>Electronics Shop</h3>
            <ul style={list}>
              <li>00134 Nairobi, Kenya</li>
              <li>+254 7110123456</li>
              <li>
                <a
                  href="mailto:electronicsshop@gmail.com"
                  style={link}
                  onMouseOver={e => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseOut={e => (e.currentTarget.style.textDecoration = "none")}
                >
                  electronicsshop@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <nav aria-label="Account" style={col}>
            <h4 style={h}>Account</h4>
            <ul style={list}>
              <li><Link to="/account" style={link}>My Account</Link></li>
              <li><Link to="/orders" style={link}>Orders</Link></li>
              <li><Link to="/wishlist" style={link}>Wishlist</Link></li>
              <li><Link to="/cart" style={link}>View Cart</Link></li>
              <li><Link to="/checkout" style={link}>CheckOut</Link></li>
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Quick Links" style={col}>
            <h4 style={h}>Quick Links</h4>
            <ul style={list}>
              <li><Link to="/" style={link}>Home</Link></li>
              <li><Link to="/products" style={link}>Products</Link></li>
              <li><Link to="/about" style={link}>About</Link></li>
              <li><Link to="/contact" style={link}>Contact</Link></li>
              <li><Link to="/signup" style={link}>Sign Up</Link></li>
            </ul>
          </nav>

          {/* Info */}
          <div style={col}>
            <h4 style={h}>Info</h4>
            <ul style={list}>
              <li>Free delivery for orders over KSh 14,000</li>
              <li>24/7 customer support</li>
              <li>30-day money-back guarantee</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={bottom}>
          <p>© 2025 Electronics Shop. All rights reserved.</p>
          <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <button style={link} onClick={() => setOpenPanel("privacy")}>Privacy Policy</button>
            <button style={link} onClick={() => setOpenPanel("terms")}>Terms of Use</button>
            <button style={link} onClick={() => setOpenPanel("faq")}>FAQ</button>
          </nav>
        </div>
      </div>

      {/* PRIVACY MODAL */}
      {openPanel === "privacy" && (
        <Modal title="Privacy Policy">
          <p><strong>Effective Date:</strong> January 2025</p>
          <p>
            At <strong>Electronics Shop</strong>, your privacy matters. We collect only the information needed to process
            orders, deliver products, and improve your experience. We do not sell, rent, or share your personal data
            except with delivery and payment partners to complete your purchase.
          </p>
          <p><strong>We collect:</strong> name, contact details and address, payment details (processed securely by our providers),
            and browsing/purchase history to improve service.</p>
          <p>
            You may request access, correction, or deletion of your data any time at
            <a href="mailto:electronicsshop@gmail.com" style={{ color: text, marginLeft: 6 }}>electronicsshop@gmail.com</a>.
          </p>
        </Modal>
      )}

      {/* TERMS MODAL */}
      {openPanel === "terms" && (
        <Modal title="Terms of Use">
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            <li>Prices are in Kenyan Shillings (KSh) and may change without notice.</li>
            <li>Orders are confirmed when payment is received and verified.</li>
            <li>We may cancel orders due to stock issues or suspected fraud.</li>
            <li>You are responsible for accurate delivery information at checkout.</li>
            <li>All site content is the property of Electronics Shop and may not be reused without permission.</li>
          </ol>
          <p style={{ marginTop: 12 }}>
            Questions? Email <a href="mailto:electronicsshop@gmail.com" style={{ color: text }}>electronicsshop@gmail.com</a>.
          </p>
        </Modal>
      )}

      {/* FAQ MODAL */}
      {openPanel === "faq" && (
        <Modal title="Frequently Asked Questions">
          <p><strong>Delivery times</strong>: Nairobi 1–2 business days; upcountry 3–5 days.</p>
          <p><strong>Payments</strong>: M-Pesa, Airtel Money, bank transfer, and cash on delivery (select locations).</p>
          <p><strong>Returns</strong>: 30-day returns for unused items in original packaging.</p>
          <p><strong>Order tracking</strong>: We send an SMS/email with a tracking link when your order ships.</p>
          <p><strong>Support</strong>: <a href="mailto:electronicsshop@gmail.com" style={{ color: text }}>electronicsshop@gmail.com</a> · +254 711 012 3456 (Mon–Sat, 9am–6pm)</p>
        </Modal>
      )}
    </footer>
  );
}