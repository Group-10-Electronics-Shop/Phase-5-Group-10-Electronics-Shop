import React, { useState, useMemo } from "react";
import CategoryList from "./CategoryList";

const CAROUSEL_IMAGES = [
  "/images/34_213.png",
  "/images/142_1508.png",
  "/images/142_1509.png",
  "/images/142_1510.png",
  "/images/142_1511.png"
];

export default function Banner(){
  const [idx, setIdx] = useState(0);
  const images = useMemo(()=> CAROUSEL_IMAGES, []);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <section className="banner-grid">
      <aside className="banner-sidebar" aria-hidden={false}>
        <CategoryList />
      </aside>

      <div className="banner-carousel" role="region" aria-roledescription="carousel" aria-label="Featured images">
        <div className="carousel-inner">
          <button className="carousel-nav left" onClick={prev} aria-label="Previous">‹</button>

          <div className="carousel-slide">
            <img
              src={images[idx] || "/images/placeholder.png"}
              alt={`Slide ${idx+1}`}
              onError={(e)=> e.currentTarget.src = "/images/placeholder.png"}
            />
            <div className="carousel-caption">
              <div className="hero-topline">Featured electronics</div>
              <h1>Best Deals on Electronics</h1>
              <p className="hero-tagline">Quality gadgets &amp; fast delivery</p>
              <div className="hero-ctas">
                <button className="btn">Shop now</button>
                <button className="btn-outline">View flash sales</button>
              </div>
            </div>
          </div>

          <button className="carousel-nav right" onClick={next} aria-label="Next">›</button>
        </div>

        <div className="carousel-dots">
          {images.map((_, i) => (
            <button key={i} className={`dot ${i===idx ? "active" : ""}`} onClick={()=>setIdx(i)} aria-label={`Go to slide ${i+1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}