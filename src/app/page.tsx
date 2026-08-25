"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: "Running" | "Everyday" | "Trail";
  price: number;
  color: string;
  description: string;
  image: string;
  badge?: string;
};

const products: Product[] = [
  { id: "01", name: "The Form 01", category: "Everyday", price: 180, color: "Bone / Umber", description: "A considered everyday essential. Hand-finished leather, shaped for the long way home.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85", badge: "New" },
  { id: "02", name: "The Pace 02", category: "Running", price: 195, color: "Ink / Chalk", description: "A featherlight study in movement. Responsive foam and a breathable woven upper.", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=85" },
  { id: "03", name: "The Terra 01", category: "Trail", price: 210, color: "Moss / Clay", description: "Built for weather, made for wandering. Grippy rubber with a water-resistant shell.", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=85", badge: "Field tested" },
  { id: "04", name: "The Ease 01", category: "Everyday", price: 165, color: "Oat / Sand", description: "Soft structure for slow mornings and everything that follows.", image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85" },
  { id: "05", name: "The Pace 03", category: "Running", price: 220, color: "Redwood / Bone", description: "Designed around your rhythm with an energy-returning, sculpted sole.", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=85", badge: "Best seller" },
  { id: "06", name: "The Form 02", category: "Everyday", price: 180, color: "Charcoal / Fog", description: "The quiet classic, re-cut. Full-grain suede and a naturally flexible footbed.", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85" },
];

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="icon"><path d="M3 10h13M11 4l6 6-6 6" /></svg>;
}
function BagIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon"><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
}
function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="icon"><path d="m5 5 10 10M15 5 5 15" /></svg>;
}
function PlusIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="icon"><path d="M10 4v12M4 10h12" /></svg>;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"All" | Product["category"]>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [bag, setBag] = useState<Product[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  const visibleProducts = useMemo(() => activeCategory === "All" ? products : products.filter((product) => product.category === activeCategory), [activeCategory]);
  const addToBag = (product: Product) => {
    setBag((current) => current.some((item) => item.id === product.id) ? current : [...current, product]);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <main>
      <div className="announcement"><span>Complimentary shipping on orders over $150</span><span className="announcement-detail">Designed in Copenhagen · Est. 2014</span></div>
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Morrow home">morrow<span>®</span></a>
        <div className="nav-links"><a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#journal">Journal</a></div>
        <button className="bag-button" onClick={() => setBagOpen(true)} aria-label={`Open shopping bag with ${bag.length} items`}><BagIcon /><span>Bag</span><b>{bag.length.toString().padStart(2, "0")}</b></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow reveal">A considered step forward <span>— 01 / 04</span></p><h1 className="reveal delay-one">Shoes for<br /><em>the long way.</em></h1><p className="hero-intro reveal delay-two">Thoughtful footwear for everyday movement. Made slowly, worn often, and designed to get better with time.</p><a className="text-link reveal delay-three" href="#shop">Explore the collection <ArrowIcon /></a></div>
        <div className="hero-image-wrap"><div className="hero-note">01 <span>THE FORM</span></div><img className="hero-image" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1500&q=90" alt="Red and white Morrow sneaker on a warm studio background" /><div className="hero-stamp">M<br /><span>14</span></div></div>
      </section>

      <section className="marquee" aria-label="Morrow values"><div>LESS, BUT BETTER <span>✦</span> MADE TO MOVE <span>✦</span> KEEP IT IN MOTION <span>✦</span> LESS, BUT BETTER <span>✦</span> MADE TO MOVE <span>✦</span></div></section>

      <section className="collection" id="shop">
        <div className="section-heading"><div><p className="eyebrow">The collection</p><h2>Find your <em>everyday.</em></h2></div><p className="section-description">Six silhouettes. No excess. Each one made to move through your day with a little more intention.</p></div>
        <div className="category-row" role="tablist" aria-label="Filter by category">{["All", "Running", "Everyday", "Trail"].map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category as typeof activeCategory)}>{category}<sup>{category === "All" ? products.length : products.filter((product) => product.category === category).length}</sup></button>)}</div>
        {visibleProducts.length > 0 ? <div className="product-grid">{visibleProducts.map((product, index) => <article className={`product-card reveal ${index % 2 ? "delay-one" : ""}`} key={product.id}>
          <button className="product-image-button" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`}><div className="product-image-wrap"><img src={product.image} alt={`${product.name}, ${product.color}`} /><span className="view-label">Quick view <ArrowIcon /></span>{product.badge && <span className="product-badge">{product.badge}</span>}</div></button>
          <div className="product-info"><div><h3>{product.name}</h3><p>{product.color}</p></div><strong>${product.price}</strong></div>
          <button className="add-button" onClick={() => addToBag(product)} disabled={addedId === product.id}>{addedId === product.id ? "Added to bag" : <><span>Add to bag</span><PlusIcon /></>}</button>
        </article>)}</div> : <div className="empty-state"><p className="eyebrow">A quiet moment</p><h3>No shoes here yet.</h3><p>Try another part of the collection.</p><button className="text-link" onClick={() => setActiveCategory("All")}>View all shoes <ArrowIcon /></button></div>}
      </section>

      <section className="story" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85" alt="A pair of neutral sneakers resting on a wooden bench" /></div><div className="story-copy"><p className="eyebrow">The Morrow method</p><h2>Better materials.<br /><em>Longer mornings.</em></h2><p>We believe the best things are made with patience. Our shoes start with considered materials, honest construction, and a refusal to follow a seasonal clock.</p><a className="text-link" href="#journal">Read our story <ArrowIcon /></a><div className="story-number">02 <span>/ 04</span></div></div></section>

      <footer id="journal"><div className="footer-top"><a className="wordmark" href="#top">morrow<span>®</span></a><p>Footwear for the in-between.<br />Copenhagen · Everywhere</p><a className="text-link" href="#top">Back to top <ArrowIcon /></a></div><div className="footer-bottom"><span>© 2024 Morrow Studio</span><div><a href="#top">Instagram</a><a href="#top">Contact</a><a href="#top">Shipping & returns</a></div></div></footer>

      {selectedProduct && <div className="overlay" role="presentation" onClick={() => setSelectedProduct(null)}><section className="quick-view" role="dialog" aria-modal="true" aria-labelledby="quick-view-title" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelectedProduct(null)} aria-label="Close quick view"><CloseIcon /></button><img src={selectedProduct.image} alt="" /><div className="quick-copy"><p className="eyebrow">{selectedProduct.category} · {selectedProduct.color}</p><h2 id="quick-view-title">{selectedProduct.name}</h2><p>{selectedProduct.description}</p><strong>${selectedProduct.price}</strong><button className="primary-button" onClick={() => { addToBag(selectedProduct); setSelectedProduct(null); setBagOpen(true); }}>Add to bag <ArrowIcon /></button></div></section></div>}
      {bagOpen && <div className="overlay" role="presentation" onClick={() => setBagOpen(false)}><aside className="bag-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><p className="eyebrow">Your selection</p><h2 id="bag-title">The bag <span>({bag.length})</span></h2></div><button className="close-button" onClick={() => setBagOpen(false)} aria-label="Close shopping bag"><CloseIcon /></button></div>{bag.length ? <><div className="bag-items">{bag.map((product) => <div className="bag-item" key={product.id}><img src={product.image} alt="" /><div><h3>{product.name}</h3><p>{product.color}</p><strong>${product.price}</strong></div></div>)}</div><div className="bag-total"><span>Subtotal</span><strong>${bag.reduce((sum, product) => sum + product.price, 0)}</strong></div><button className="primary-button">Continue to checkout <ArrowIcon /></button><p className="drawer-note">Complimentary shipping included.</p></> : <div className="drawer-empty"><p>Your bag is waiting for something good.</p><a className="text-link" href="#shop" onClick={() => setBagOpen(false)}>Explore the collection <ArrowIcon /></a></div>}</aside></div>}
    </main>
  );
}
