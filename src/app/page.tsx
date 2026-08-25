const features = [
  { number: "01", title: "See the signal", copy: "Turn scattered inputs into a shared view of what matters next.", art: "circle" },
  { number: "02", title: "Move with intent", copy: "Give every idea a home, an owner, and a clear path forward.", art: "bars" },
  { number: "03", title: "Make it yours", copy: "A flexible workspace that bends to the way your team already works.", art: "sun" },
];

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

export default function Home() {
  return (
    <main>
      <section className="hero grid-lines">
        <div className="shell">
          <nav className="nav" aria-label="Main navigation">
            <a className="logo" href="#top" aria-label="Aster home"><span className="logo-mark" aria-hidden="true" />aster</a>
            <div className="nav-links"><a href="#why">Why Aster</a><a href="#how">How it works</a><a href="#stories">Stories</a></div>
            <a className="nav-cta" href="#start">Get started <span aria-hidden="true">↗</span></a>
          </nav>
          <div className="hero-content" id="top">
            <div className="hero-copy">
              <div className="eyebrow">A calmer way to work / 2024</div>
              <h1>Make space for <span>better work.</span></h1>
              <p>Aster gives ambitious teams the clarity to focus, the context to collaborate, and the confidence to move forward.</p>
              <a className="button" href="#start">Start making space <Arrow /></a>
              <div className="hero-note">No credit card. Just a better way in.</div>
            </div>
            <div className="app-window" aria-label="Preview of the Aster workspace">
              <div className="window-bar"><i className="window-dot" /><i className="window-dot" /><i className="window-dot" /><span className="window-label">aster / overview</span></div>
              <div className="app-body"><aside className="app-sidebar"><div className="side-title">aster</div><div className="side-link active">Overview</div><div className="side-link">Projects</div><div className="side-link">Notes</div><div className="side-link">People</div></aside><div className="app-main"><div className="eyebrow eyebrow-light">Monday, 09 Sep</div><h3>Good morning, Maya.</h3><div className="app-sub">Here&apos;s the shape of your week.</div><div className="progress"><i /></div><div className="card-row"><div className="mini-card large"><div className="mini-label">Focus this week</div><div className="mini-value">68%</div><div className="spark"><i style={{ height: "35%" }} /><i style={{ height: "60%" }} /><i style={{ height: "45%" }} /><i style={{ height: "80%" }} /><i style={{ height: "65%" }} /><i style={{ height: "100%" }} /><i style={{ height: "78%" }} /></div></div><div className="mini-card"><div className="mini-label">Open loops</div><div className="mini-value">12</div></div><div className="mini-card"><div className="mini-label">In motion</div><div className="mini-value">08</div></div></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker"><div className="ticker-inner"><span>Less noise</span><span>More signal</span><span>Good work, together</span><span>Less noise</span></div></div>

      <section className="section shell" id="why"><div className="section-head"><div><div className="eyebrow">The Aster difference</div><h2>Clarity is a team sport.</h2></div><p>Everything you need to make good work feel a little easier, together.</p></div><div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.number}><div className="feature-number">{feature.number}</div><h3>{feature.title}</h3><p>{feature.copy}</p><div className={`feature-art art-${feature.art}`} aria-hidden="true">{feature.art === "bars" ? <div className="art-bars"><i style={{ height: "30%" }} /><i style={{ height: "62%" }} /><i style={{ height: "46%" }} /><i style={{ height: "84%" }} /></div> : feature.art === "circle" ? <div className="art-circle" /> : <div className="art-sun" />}</div></article>)}</div></section>

      <section className="section shell" id="how"><div className="split"><div><div className="eyebrow">A better rhythm</div><p className="quote">Less managing. More <em>making.</em></p><p className="body-copy">Aster connects the dots between your big picture and today&apos;s next step — so momentum becomes a habit, not a heroic effort.</p><a className="button" href="#start">See how it works <Arrow /></a></div><div className="process"><article className="process-item"><strong>01</strong><div><h3>Capture the thinking</h3><p>Get ideas out of heads and into a shared, living space.</p></div><span className="process-icon">↗</span></article><article className="process-item"><strong>02</strong><div><h3>Find the throughline</h3><p>Connect the details to the goals that make them matter.</p></div><span className="process-icon">↗</span></article><article className="process-item"><strong>03</strong><div><h3>Keep good work moving</h3><p>Make progress visible without adding another meeting.</p></div><span className="process-icon">↗</span></article></div></div></section>

      <section className="testimonial" id="stories"><div className="shell testimonial-inner"><div><div className="eyebrow eyebrow-light">From the field</div><blockquote>&quot;Aster helped us trade <span>busywork</span> for the work that actually moves us forward.&quot;</blockquote><div className="person"><div className="avatar">JB</div><small>Jordan Bell / COO, Common Thread</small></div></div><div className="testimonial-art" aria-hidden="true"><b>✳</b></div></div></section>

      <section className="footer-cta shell" id="start"><div className="eyebrow">Your next chapter starts here</div><h2>Make room for <span>what&apos;s next.</span></h2><a className="button" href="mailto:hello@aster.work">Get started with Aster <Arrow /></a></section>
      <footer className="footer shell"><a className="logo" href="#top"><span className="logo-mark" aria-hidden="true" />aster</a><small>© 2024 Aster Systems / Built for better work</small><small>Made with intention.</small></footer>
    </main>
  );
}
