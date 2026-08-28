"use client";

import { useState } from "react";

const benefits = [
  {
    number: "01",
    title: "See the signal",
    text: "Turn scattered feedback into a clear read on what deserves your team’s attention next.",
  },
  {
    number: "02",
    title: "Move with context",
    text: "Keep every decision connected to the customer insight that sparked it — no more digging.",
  },
  {
    number: "03",
    title: "Share the why",
    text: "Give everyone a confident answer when the question is simple: why are we building this?",
  },
];

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M3.333 12.667 12.667 3.333M5 3.333h7.667V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="site-shell">
      <nav className="nav-wrap" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Thread home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          thread<span className="brand-dot">.</span>
        </a>
        <div className="nav-links">
          <a href="#approach">Approach</a>
          <a href="#proof">Why Thread</a>
        </div>
        <a className="nav-cta" href="#start">
          Start free <ArrowUpRight />
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Customer clarity, finally connected</p>
          <h1>Make better<br /><em>things</em> on purpose.</h1>
          <p className="hero-intro">Thread turns the voice of your customers into a shared, living guide for what to build next.</p>
          <div className="hero-actions" id="start">
            <button className="primary-button" type="button" onClick={() => setStarted(true)} disabled={started}>
              {started ? "You’re on the list" : "Start free"}
              {!started && <ArrowUpRight />}
            </button>
            <span className="action-note">No credit card · 10 min setup</span>
          </div>
          <div className="social-proof" id="proof">
            <div className="avatar-stack" aria-hidden="true">
              <span className="avatar avatar-a">AS</span>
              <span className="avatar avatar-b">JM</span>
              <span className="avatar avatar-c">RK</span>
              <span className="avatar avatar-d">+</span>
            </div>
            <p>Trusted by product teams<br /><strong>building what matters.</strong></p>
          </div>
        </div>

        <div className="hero-visual" aria-label="A visual preview of Thread connecting customer signals to product decisions">
          <div className="visual-glow" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="signal-card signal-card-top">
            <span className="card-label">CUSTOMER SIGNAL</span>
            <p>“I wish I could see<br /><strong>the whole picture.</strong>”</p>
            <span className="signal-tag">repeated 24×</span>
          </div>
          <div className="thread-core">
            <span className="core-ring" />
            <span className="core-dot" />
            <span className="core-word">thread</span>
          </div>
          <div className="signal-card signal-card-bottom">
            <span className="card-label">NEXT BEST MOVE</span>
            <p><strong>Unify the workspace</strong></p>
            <div className="mini-bar"><span /></div>
            <span className="signal-tag">high confidence</span>
          </div>
          <span className="floating-label label-left">listen</span>
          <span className="floating-label label-right">connect</span>
        </div>
      </section>

      <section className="approach" id="approach">
        <div className="section-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> The Thread approach</p>
          <h2>From noise to<br /><em>knowing.</em></h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article className="benefit" key={benefit.number}>
              <span className="benefit-number">{benefit.number}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>thread<span className="brand-dot">.</span></span>
        <span>Built for the curious.</span>
        <span>© 2024 Thread Labs</span>
      </footer>
    </main>
  );
}
