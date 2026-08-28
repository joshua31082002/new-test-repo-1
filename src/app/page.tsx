const projects = [
  {
    id: "01",
    title: "Aster House",
    type: "Brand world · 2024",
    className: "project-card project-card--tall",
    artClass: "project-art project-art--aster",
  },
  {
    id: "02",
    title: "Lumen Objects",
    type: "Campaign · 2023",
    className: "project-card",
    artClass: "project-art project-art--lumen",
  },
  {
    id: "03",
    title: "Field Notes",
    type: "Editorial · 2023",
    className: "project-card",
    artClass: "project-art project-art--field",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Mara Venn home">
          MV<span className="wordmark-dot">.</span>
        </a>
        <div className="nav-links">
          <a href="#work">Selected work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="#contact">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <p className="eyebrow hero-eyebrow">Independent art direction · New York / Everywhere</p>
        <h1 id="hero-title">
          Ideas with<br />
          <em>somewhere</em><br />
          to go<span className="hero-mark">✳</span>
        </h1>
        <div className="hero-footer">
          <p className="hero-intro">
            I&apos;m Mara Venn, a creative director and visual storyteller building identities,
            campaigns, and digital worlds for curious people.
          </p>
          <a className="scroll-link" href="#work">
            <span className="scroll-line" aria-hidden="true" />
            Scroll to explore
          </a>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">01 / Selected work</p>
          <h2 id="work-title">A few things<br /><em>made with intent.</em></h2>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className={project.className} key={project.id}>
              <a href="#contact" className="project-link" aria-label={`Ask about ${project.title}`}>
                <div className={project.artClass} aria-hidden="true">
                  <span className="art-label">{project.id}</span>
                  {project.id === "01" && <span className="aster-word">ASTER<br />HOUSE</span>}
                  {project.id === "02" && <span className="lumen-shape" />}
                  {project.id === "03" && <span className="field-word">FIELD<br /><em>notes</em></span>}
                </div>
                <div className="project-meta">
                  <h3>{project.title}</h3>
                  <p>{project.type}</p>
                  <span className="project-arrow" aria-hidden="true">↗</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-label"><p className="eyebrow">02 / A little context</p></div>
        <div className="about-copy">
          <h2 id="about-title">Good work starts with a <em>clear feeling.</em></h2>
          <p>
            I work at the intersection of strategy, image, and language — helping ambitious
            brands find the visual language that feels most like them, only sharper.
          </p>
          <p>
            From a first sketch to the final detail, I like the thoughtful bits. The unexpected
            crop. The typeface that changes the temperature. The idea that earns its place.
          </p>
          <a className="text-link" href="#contact">More about Mara <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <p className="eyebrow">03 / Start a conversation</p>
        <h2 id="contact-title">Have a good<br /><em>feeling about this?</em></h2>
        <a className="contact-link" href="mailto:hello@maravenn.studio">
          hello@maravenn.studio <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <span>© 2024 Mara Venn Studio</span>
        <span>Made for the in-between</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
