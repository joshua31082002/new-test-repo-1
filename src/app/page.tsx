const services = [
  { number: "01", title: "Brand systems", detail: "Identity, voice, and the connective tissue that makes a company feel like itself." },
  { number: "02", title: "Digital products", detail: "Clear, useful experiences that turn complicated ideas into confident action." },
  { number: "03", title: "Creative direction", detail: "A steady point of view from first sketch to final launch and everything after." },
];

const work = [
  { type: "Fintech / 2024", title: "A calmer way to move money", tone: "work-sage" },
  { type: "Climate / 2023", title: "Making the invisible visible", tone: "work-lilac" },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Fieldwork home"><span>field</span><i>work</i></a>
        <div className="nav-links">
          <a href="#services">What we do</a>
          <a href="#work">Selected work</a>
          <a className="nav-cta" href="mailto:hello@fieldwork.studio">Let&apos;s talk <span aria-hidden="true">↗</span></a>
        </div>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow reveal">Independent digital studio <span>—</span> New York · London</p>
        <h1 className="hero-title reveal reveal-delay-1">Good ideas<br /><em>need good</em><br />company.</h1>
        <div className="hero-footer reveal reveal-delay-2">
          <p>We partner with people making meaningful things to shape brands and digital experiences with staying power.</p>
          <a className="circle-link" href="#services" aria-label="Scroll to what we do"><span>↓</span></a>
        </div>
        <div className="hero-mark" aria-hidden="true"><span>F</span><span>W</span></div>
      </section>

      <section className="intro section-pad">
        <p className="section-label">A little about us</p>
        <div className="intro-copy"><p>Fieldwork is a small, senior team for teams who care about the details. We find the sharpest version of an idea, then make it real.</p><a className="text-link" href="mailto:hello@fieldwork.studio">More about Fieldwork <span>↗</span></a></div>
      </section>

      <section className="services section-pad" id="services">
        <p className="section-label">What we do</p>
        <div className="service-list">{services.map((service) => <article className="service-row" key={service.number}><span className="service-number">{service.number}</span><h2>{service.title}</h2><p>{service.detail}</p><span className="row-arrow" aria-hidden="true">↗</span></article>)}</div>
      </section>

      <section className="work section-pad" id="work">
        <div className="work-heading"><p className="section-label">Selected work</p><p className="work-note">A few things we&apos;ve helped into the world.</p></div>
        <div className="work-grid">{work.map((item) => <a className={`work-card ${item.tone}`} href="mailto:hello@fieldwork.studio" key={item.title}><div className="card-art"><span className="art-orbit" /><span className="art-line" /><span className="art-word">{item.tone === "work-sage" ? "flow" : "terra"}</span></div><p>{item.type}</p><h3>{item.title} <span>↗</span></h3></a>)}</div>
      </section>

      <section className="testimonial section-pad"><p className="quote-mark" aria-hidden="true">“</p><blockquote>They brought clarity to the messy middle — and made the work feel like ours from day one.</blockquote><p className="quote-byline">— Maya Chen, Co-founder at Common Thread</p></section>

      <footer className="site-footer"><div><p className="eyebrow">Have a good one?</p><h2>Let&apos;s make<br /><em>something</em> useful.</h2></div><a className="footer-contact" href="mailto:hello@fieldwork.studio">hello@fieldwork.studio <span>↗</span></a><div className="footer-bottom"><span>© 2024 Fieldwork Studio</span><span>Independent by design</span><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
