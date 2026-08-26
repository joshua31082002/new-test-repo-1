const projects = [
  {
    title: "Field Notes",
    type: "Editorial identity · 2024",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    className: "project-large",
  },
  {
    title: "Cedar House",
    type: "Digital home · 2024",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    className: "project-small",
  },
  {
    title: "Common Ground",
    type: "Campaign · 2023",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85",
    className: "project-small",
  },
];

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

export default function Home() {
  return (
    <main className="site-shell">
      <header className="container site-header">
        <a className="wordmark" href="#top" aria-label="Atelier North home">ATELIER<br />NORTH<span>.</span></a>
        <nav aria-label="Main navigation" className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="menu-link" href="#contact">Start a project <Arrow /></a>
      </header>

      <section id="top" className="container hero">
        <div className="hero-copy reveal">
          <p className="eyebrow">Independent creative studio · Est. 2012</p>
          <h1 className="display">Good ideas<br /><em>need room</em><br />to grow.</h1>
          <p className="body-copy hero-intro">We build distinct identities, digital spaces, and stories for people shaping a more thoughtful world.</p>
          <a className="text-link" href="#work">Explore selected work <Arrow /></a>
        </div>
        <div className="hero-art reveal delay-2" aria-label="Sunlit modernist interior" role="img">
          <div className="hero-art-label">01 / 03</div>
          <div className="hero-art-note">Make space<br />for better.</div>
        </div>
      </section>

      <section id="work" className="container work-section">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <p className="section-index">A small selection of recent collaborations <span>↓</span></p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a className={`project-card ${project.className}`} href="#contact" key={project.title}>
              <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
                <span className="project-arrow"><Arrow /></span>
              </div>
              <div className="project-meta"><h2>{project.title}</h2><p>{project.type}</p></div>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container about-inner">
          <p className="eyebrow">A little about us</p>
          <div className="about-content">
            <h2>We believe the best work feels <em>inevitable.</em></h2>
            <div>
              <p className="body-copy">Not louder. Not busier. Just clear, considered, and completely itself. Atelier North is a compact team of strategists, designers, and makers working across brand and digital.</p>
              <a className="text-link light-link" href="#contact">More about the studio <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="container footer">
        <div>
          <p className="eyebrow">Have a good one?</p>
          <h2>Let&apos;s make<br /><em>space.</em></h2>
        </div>
        <div className="footer-contact">
          <a className="contact-email" href="mailto:hello@ateliernorth.studio">hello@ateliernorth.studio <Arrow /></a>
          <div className="footer-bottom"><span>© 2024 Atelier North</span><span>New York · Everywhere</span><a href="#top">Back to top ↑</a></div>
        </div>
      </footer>
    </main>
  );
}
