"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  tone: string;
  image: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: "vomero-18",
    name: "Vomero 18",
    category: "Road running shoes",
    price: "$150",
    tone: "Sail / Bright Crimson",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
    badge: "New",
  },
  {
    id: "pegasus-41",
    name: "Pegasus 41",
    category: "Road running shoes",
    price: "$140",
    tone: "Black / Anthracite",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "air-max-dn8",
    name: "Air Max Dn8",
    category: "Men's shoes",
    price: "$170",
    tone: "White / Metallic Silver",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85",
  },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 8.5h13l1 12h-15l1-12Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export default function Home() {
  const [bagCount, setBagCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="site-shell">
      <div className="utility-bar">
        <p>Free delivery on orders over $75</p>
        <nav aria-label="Utility navigation">
          <a href="#help">Help</a>
          <a href="#join">Join Us</a>
          <a href="#signin">Sign In</a>
        </nav>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Nike home">
          NIKE<span>®</span>
        </a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="#new">New & Featured</a>
          <a href="#men">Men</a>
          <a href="#women">Women</a>
          <a href="#kids">Kids</a>
          <a href="#sale">Sale</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-button" onClick={() => setSearchOpen((open) => !open)} aria-label="Search" aria-expanded={searchOpen}>
            <SearchIcon />
          </button>
          <button className="icon-button bag-button" onClick={() => setBagCount((count) => count + 1)} aria-label={`Shopping bag, ${bagCount} items`}>
            <BagIcon />
            {bagCount > 0 && <span className="bag-count">{bagCount}</span>}
          </button>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span /> <span />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-panel">
          <label htmlFor="site-search">What are you looking for?</label>
          <div className="search-input-wrap">
            <SearchIcon />
            <input id="site-search" autoFocus placeholder="Search shoes, clothing, and more" />
            <button onClick={() => setSearchOpen(false)} aria-label="Close search">Esc</button>
          </div>
        </div>
      )}

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Bridge the gap</p>
          <h1 id="hero-title">Find your<br /><em>fast.</em></h1>
          <p className="hero-description">The latest generation of Air cushioning helps you go beyond your best with every stride.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#shop">Shop running</a>
            <a className="text-link" href="#story">Explore the story <span>↗</span></a>
          </div>
        </div>
        <div className="hero-art" role="img" aria-label="A runner wearing bright Nike running shoes">
          <div className="art-glow" />
          <div className="floating-label label-top">Air Zoom<br /><strong>ReactX</strong></div>
          <div className="floating-label label-bottom">Engineered<br /><strong>for motion</strong></div>
          <div className="hero-shoe" />
          <div className="hero-swoosh">✓</div>
          <p className="art-caption">01 — Built for the long run</p>
        </div>
      </section>

      <section className="product-section" id="shop" aria-labelledby="product-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The latest</p>
            <h2 id="product-title">Move your way</h2>
          </div>
          <a className="text-link desktop-link" href="#all">Shop all <span>→</span></a>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <a className="product-image" href={`#${product.id}`} style={{ backgroundImage: `url(${product.image})` }} aria-label={`View ${product.name}`}>
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button className="heart-button" aria-label={`Favorite ${product.name}`}>♡</button>
              </a>
              <div className="product-details">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <small>{product.tone}</small>
                </div>
                <strong>{product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="statement-section" id="story">
        <div className="statement-copy">
          <p className="eyebrow">Nike Running</p>
          <h2>Run the day.<br /><em>Not the other way around.</em></h2>
          <a className="button button-light" href="#collection">Shop the collection</a>
        </div>
        <div className="statement-mark" aria-hidden="true">NIKE<span>®</span></div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">NIKE<span>®</span></div>
        <div className="footer-links"><a href="#find">Find a Store</a><a href="#support">Support</a><a href="#orders">Orders</a><a href="#feedback">Feedback</a></div>
        <p>© 2025 Nike, Inc. All Rights Reserved</p>
      </footer>
    </main>
  );
}
