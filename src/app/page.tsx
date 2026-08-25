const projects = [
  {
    number: "01",
    title: "Morrow House",
    category: "Hospitality · Brand world",
    year: "2024",
    tone: "sunset",
  },
  {
    number: "02",
    title: "Field Notes",
    category: "Culture · Editorial platform",
    year: "2024",
    tone: "sage",
  },
  {
    number: "03",
    title: "Common Ground",
    category: "Food · Identity system",
    year: "2023",
    tone: "plum",
  },
];

const services = [
  "Brand strategy",
  "Visual identity",
  "Digital experiences",
  "Campaigns & content",
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Sonder and Form home">
          Sonder<span>+</span>Form
        </a>
        <div className="nav-links">
          <a href="#work">Selected work</a>
          <a href="#studio">Studio</a>
          <a className="nav-contact" href="#contact">Let&apos;s talk <span aria-hidden="true">↗</span></a>
        </div>
      </nav>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-kicker"><span className="eyebrow-dot" /> Independent creative studio · Est. 2018</div>
        <h1 id="hero-title">We make <em>meaningful</em><br />things <span className="hero-mark" aria-hidden="true">✳</span></h1>
        <div className="hero-bottom">
          <p>Brand identities and digital experiences for people building a more considered world.</p>
          <a className="circle-link" href="#work" aria-label="Scroll to selected work"><span>↓</span></a>
        </div>
      </section>

      <section className="intro section-pad" id="studio" aria-labelledby="intro-title">
        <p className="eyebrow">A little about us</p>
        <div className="intro-copy">
          <h2 id="intro-title">Good work starts with <em>good questions.</em></h2>
          <p>We&apos;re a small, senior-led studio for ambitious teams who care about the details. We find the honest story at the heart of a business, then give it a form people can feel.</p>
          <a className="text-link" href="#contact">More about the studio <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="work section-pad" id="work" aria-labelledby="work-title">
        <div className="section-header">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-title">A few things<br /><em>we&apos;re proud of.</em></h2>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.number}>
              <div className={`project-image ${project.tone}`} aria-label={`${project.title} project preview`} role="img">
                <span className="project-shape" aria-hidden="true" />
                <span className="project-image-label">{project.title}</span>
              </div>
              <div className="project-meta">
                <div><span className="project-number">{project.number}</span><h3>{project.title}</h3></div>
                <div className="project-detail"><span>{project.category}</span><span>{project.year}</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services section-pad" aria-labelledby="services-title">
        <p className="eyebrow">What we do</p>
        <div className="services-layout">
          <h2 id="services-title">Small team.<br /><em>Wide lens.</em></h2>
          <ul className="service-list">
            {services.map((service, index) => <li key={service}><span>0{index + 1}</span>{service}<b aria-hidden="true">↗</b></li>)}
          </ul>
        </div>
      </section>

      <section className="proof section-pad" aria-labelledby="proof-title">
        <div className="proof-heading">
          <p className="eyebrow">Good company</p>
          <h2 id="proof-title">The nice things<br /><em>people say.</em></h2>
        </div>
        <div className="proof-content">
          <blockquote>
            “Sonder + Form helped us find the clearest version of who we are. The work feels unmistakably ours — and our customers felt it immediately.”
          </blockquote>
          <p className="quote-attribution">— Maya Chen, co-founder at Morrow House</p>
          <div className="studio-stats" aria-label="Studio achievements">
            <div><strong>38</strong><span>brands launched</span></div>
            <div><strong>12</strong><span>countries reached</span></div>
            <div><strong>6 yrs</strong><span>making good things</span></div>
          </div>
        </div>
      </section>

      <section className="contact section-pad" id="contact" aria-labelledby="contact-title">
        <p className="eyebrow">Have a good feeling?</p>
        <h2 id="contact-title">Let&apos;s make<br /><em>something real.</em></h2>
        <a className="contact-link" href="mailto:hello@sonderandform.studio">hello@sonderandform.studio <span aria-hidden="true">↗</span></a>
      </section>

      <footer className="site-footer">
        <span>© 2024 Sonder + Form</span>
        <span>New York · London · Everywhere</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
