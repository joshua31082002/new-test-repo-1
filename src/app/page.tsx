const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="icon icon-small">
    <path d="M3 13 13 3M5 3h8v8" />
  </svg>
);

const Spark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-spark">
    <path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2Z" />
  </svg>
);

export default function Home() {
  return (
    <main>
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Nook home">
          <span className="brand-mark">N</span>
          <span>nook</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#manifesto">Manifesto</a>
          <a href="#pricing">Pricing</a>
        </div>
        <a className="button button-dark button-nav" href="#start">
          Get started <ArrowUpRight />
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Spark /> A calmer way to work</p>
          <h1>Make space for<br /><em>good work.</em></h1>
          <p className="hero-intro">Nook brings your team&apos;s projects, ideas, and momentum into one thoughtful workspace. Less noise. More of what matters.</p>
          <div className="hero-actions" id="start">
            <a className="button button-dark" href="#pricing">Start for free <ArrowUpRight /></a>
            <a className="text-link" href="#features">See how it works <span>↓</span></a>
          </div>
          <div className="trust-row"><span className="avatar-stack" aria-hidden="true"><i>J</i><i>M</i><i>A</i><i>+</i></span><span>Loved by 2,000+ thoughtful teams</span></div>
        </div>
        <div className="hero-art" aria-label="A preview of the Nook workspace">
          <div className="sun-orb" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="workspace-card">
            <div className="workspace-top"><span className="mini-brand"><span className="brand-mark">N</span> nook</span><span className="status-dot">Live</span></div>
            <div className="workspace-content"><span className="card-label">Tuesday, October 8</span><h2>Good morning,<br /><span>Alex.</span></h2><p>Here&apos;s what&apos;s moving today.</p><div className="progress-line"><span /><span /><span /></div><div className="card-foot"><span>3 things in focus</span><span>09:41</span></div></div>
          </div>
          <span className="art-note note-one">a little room<br />to think</span>
          <span className="art-note note-two">✦</span>
        </div>
      </section>

      <section className="logo-strip" aria-label="Customer logos"><span>Teams finding their flow</span><strong>arc<span>°</span></strong><strong>planwise</strong><strong>STUDIO / 04</strong><strong className="serif-logo">Morrow</strong></section>

      <section className="features-section" id="features">
        <div className="section-heading"><p className="eyebrow">The Nook approach</p><h2>Everything you need.<br /><em>Nothing you don&apos;t.</em></h2></div>
        <div className="feature-grid">
          <article className="feature-card feature-card-dark"><span className="feature-number">01</span><div className="feature-icon grid-icon" aria-hidden="true"><i /><i /><i /><i /></div><h3>See the whole picture.</h3><p>Projects, notes, and decisions live together, so your team always knows what&apos;s happening and why.</p><a href="#pricing" className="feature-link">Explore the workspace <ArrowUpRight /></a></article>
          <article className="feature-card feature-card-lilac"><span className="feature-number">02</span><div className="feature-icon breathe-icon" aria-hidden="true"><i /><i /><i /></div><h3>Find your focus.</h3><p>Gentle structure and quiet defaults help you protect attention — individually and together.</p><a href="#pricing" className="feature-link">Meet focus mode <ArrowUpRight /></a></article>
          <article className="feature-card feature-card-paper"><span className="feature-number">03</span><div className="feature-icon spark-icon"><Spark /></div><h3>Move with intention.</h3><p>Turn good thinking into clear next steps with a rhythm that feels natural, not forced.</p><a href="#pricing" className="feature-link">See what&apos;s possible <ArrowUpRight /></a></article>
        </div>
      </section>

      <section className="manifesto" id="manifesto"><div className="manifesto-mark">“</div><blockquote>We believe the best work happens when there&apos;s room for it to happen.</blockquote><p>— The Nook team</p></section>

      <section className="cta-section" id="pricing"><div><p className="eyebrow"><Spark /> Your best work is waiting</p><h2>Ready to make<br /><em>some room?</em></h2></div><div className="cta-side"><p>Join a growing community of teams choosing clarity over chaos.</p><a className="button button-light" href="mailto:hello@nook.work">Get started free <ArrowUpRight /></a><small>No credit card required · Set up in 2 minutes</small></div></section>

      <footer><a className="brand" href="#top"><span className="brand-mark">N</span><span>nook</span></a><span>© 2024 Nook, Inc.</span><div><a href="#features">Features</a><a href="#manifesto">About</a><a href="mailto:hello@nook.work">Contact</a></div></footer>
    </main>
  );
}
