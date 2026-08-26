import Link from "next/link";

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="icon">
    <path d="M3 13 13 3M5 3h8v8" />
  </svg>
);

const ArrowRight = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="icon">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const Spark = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="spark-icon">
    <path d="m10 1 1.5 7.5L19 10l-7.5 1.5L10 19l-1.5-7.5L1 10l7.5-1.5L10 1Z" />
  </svg>
);

const features = [
  {
    number: "01",
    title: "One calm place for every moving part.",
    text: "Give every project a home that feels focused, not crowded. Keep the brief, the work, and the decisions close.",
    link: "Explore spaces",
  },
  {
    number: "02",
    title: "Momentum you can actually see.",
    text: "Turn scattered updates into a living view of what is moving, what is blocked, and where your team needs you.",
    link: "See momentum",
  },
  {
    number: "03",
    title: "Decisions that stay in the room.",
    text: "Capture the why behind the work so the next person can pick up the thread without another meeting.",
    link: "Learn about context",
  },
];

const logos = ["KIN", "northstar", "Morrow", "fieldwork", "arc / 09"];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="wordmark" href="#top" aria-label="Luma home">
          <span className="wordmark-mark" aria-hidden="true">✳</span> luma
        </Link>
        <div className="nav-links">
          <Link href="#product">Product</Link>
          <Link href="#stories">Stories</Link>
          <Link href="#pricing">Pricing</Link>
        </div>
        <div className="nav-actions">
          <Link className="nav-login" href="#login">Log in</Link>
          <Link className="button button-dark button-small" href="#demo">Book a demo <ArrowUpRight /></Link>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> The workspace for forward motion</div>
          <h1>Make space for<br /><em>better work.</em></h1>
          <p className="hero-text">Luma brings your team&apos;s work, context, and momentum into one clear, considered space.</p>
          <div className="hero-actions">
            <Link className="button button-lime" href="#demo">Start building <ArrowUpRight /></Link>
            <Link className="text-link" href="#product">Take the tour <ArrowRight /></Link>
          </div>
          <p className="microcopy">No credit card required <span>·</span> Free for 14 days</p>
        </div>
        <div className="hero-art" aria-label="Abstract illustration of connected work" role="img">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="art-core"><Spark /><span>in flow</span></div>
          <div className="art-note note-one"><span className="note-line" /> Brief ready</div>
          <div className="art-note note-two"><span className="note-line lime-line" /> Launch plan</div>
          <div className="art-note note-three"><span className="note-avatar">AM</span> Alex moved a card</div>
          <span className="art-star star-one">✦</span><span className="art-star star-two">✦</span>
        </div>
      </section>

      <section className="logo-strip" aria-label="Teams using Luma">
        <p>Trusted by teams who care about how work feels</p>
        <div className="logos">{logos.map((logo) => <span key={logo}>{logo}</span>)}</div>
      </section>

      <section className="intro-section" id="product">
        <div className="section-label">A better default</div>
        <div>
          <h2>Good work needs<br /><em>room to breathe.</em></h2>
          <p className="intro-text">The best teams are not doing more. They are making fewer things harder than they need to be. Luma is a softer, smarter place to move work forward.</p>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-visual" aria-label="Luma workspace preview" role="img">
          <div className="window-bar"><span /><span /><span /><b>luma / launch week</b></div>
          <div className="workspace-grid">
            <aside><div className="mini-logo">✳</div><div className="side-line active" /><div className="side-line" /><div className="side-line short" /><div className="side-spacer" /><div className="side-line" /><div className="side-line short" /></aside>
            <div className="board"><div className="board-head"><span>Launch week</span><small>8 people · updated just now</small></div><div className="progress"><i /><span>72% in motion</span></div><div className="board-cards"><article><small>IN PROGRESS</small><strong>Shape the story</strong><span className="card-avatar">AM</span></article><article><small>UP NEXT</small><strong>Share with the team</strong><span className="card-dots">•••</span></article><article className="lime-card"><small>SHIPPED</small><strong>Build the thing</strong><span className="card-check">✓</span></article></div></div>
          </div>
        </div>
        <div className="feature-list">{features.map((feature) => <article className="feature-item" key={feature.number}><span className="feature-number">{feature.number}</span><div><h3>{feature.title}</h3><p>{feature.text}</p><Link className="text-link" href="#demo">{feature.link} <ArrowRight /></Link></div></article>)}</div>
      </section>

      <section className="quote-section" id="stories">
        <div className="quote-mark">“</div>
        <blockquote>Luma gives us the rare feeling that the work is working for us — not the other way around.</blockquote>
        <div className="quote-person"><span className="person-avatar">JW</span><div><strong>Jamie Wong</strong><span>Head of Brand, Morrow</span></div></div>
      </section>

      <section className="cta-section" id="demo">
        <div className="cta-orb" aria-hidden="true" /><div className="section-label light-label">Make room</div><h2>Bring your best<br /><em>ideas with you.</em></h2><p>Start with a clearer space for the work that matters.</p><Link className="button button-lime" href="mailto:hello@luma.work">Let&apos;s get to work <ArrowUpRight /></Link>
      </section>

      <footer className="site-footer" id="pricing"><div className="footer-top"><Link className="wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true">✳</span> luma</Link><p>Work, with room to think.</p><div className="footer-links"><Link href="#product">Product</Link><Link href="#stories">Stories</Link><Link href="#pricing">Pricing</Link><Link href="mailto:hello@luma.work">Contact</Link></div></div><div className="footer-bottom"><span>© 2025 Luma Workspaces</span><span>Made for the in-between moments.</span></div></footer>
    </main>
  );
}
