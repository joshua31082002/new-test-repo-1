const features = [
  {
    number: "01",
    title: "Find your focus",
    description: "Bring the important work into view and leave the noise behind.",
  },
  {
    number: "02",
    title: "Move together",
    description: "Give every idea a clear next step, from first spark to shipped.",
  },
  {
    number: "03",
    title: "Make it matter",
    description: "Build momentum with a workspace that feels as thoughtful as your work.",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="nav-wrap" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Orbit home">
          <span className="wordmark-mark" aria-hidden="true">✳</span>
          orbit
        </a>
        <div className="nav-links">
          <a href="#approach">Approach</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#contact">Start a project <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="eyebrow reveal reveal-delay-1"><span className="eyebrow-dot" aria-hidden="true" /> Independent digital studio · Est. 2024</div>
        <h1 className="hero-title reveal reveal-delay-2" id="hero-title">Make room for<br /><em>better</em> work.</h1>
        <div className="hero-bottom reveal reveal-delay-3">
          <p className="hero-copy">We help ambitious teams turn sharp ideas into clear, useful experiences that people remember.</p>
          <a className="circle-link" href="#approach" aria-label="Explore our approach"><span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span className="orbit-core" /><span className="orbit-ring orbit-ring-one" /><span className="orbit-ring orbit-ring-two" /></div>
      </section>

      <section className="approach-section" id="approach" aria-labelledby="approach-title">
        <div className="section-label"><span>Our approach</span><span>01 — 03</span></div>
        <div className="approach-heading"><h2 id="approach-title">Clarity is a<br /><em>competitive</em> advantage.</h2><p>Good work starts with asking better questions. We create the space to do that, then turn the answers into action.</p></div>
        <div className="feature-grid">
          {features.map((feature) => <article className="feature-card" key={feature.number}><span className="feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.description}</p><span className="feature-arrow" aria-hidden="true">↗</span></article>)}
        </div>
      </section>

      <footer className="footer" id="contact"><p>Have a good idea?</p><a href="mailto:hello@orbit.studio">hello@orbit.studio <span aria-hidden="true">↗</span></a><span className="footer-note">© 2024 Orbit Studio</span></footer>
    </main>
  );
}
