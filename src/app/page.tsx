import Link from "next/link";

import { ContactForm } from "@/components/contact-form";

const services = [
  {
    number: "01",
    title: "Brand foundations",
    copy: "A clear point of view, a memorable identity, and the tools to make it feel like you.",
  },
  {
    number: "02",
    title: "Digital experiences",
    copy: "Websites that feel effortless to use and unmistakably connected to your work.",
  },
  {
    number: "03",
    title: "Spaces & stories",
    copy: "The details, language, and atmosphere that help people feel at home with your brand.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav container" aria-label="Main navigation">
        <Link className="wordmark" href="#top">
          Fieldnote<span>®</span>
        </Link>
        <div className="nav-links">
          <Link href="#services">What we do</Link>
          <Link href="#approach">Our approach</Link>
          <Link className="nav-cta" href="#contact">
            Let’s talk <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>

      <section className="hero container" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Independent creative studio · Est. 2014</p>
          <h1>
            Make room for <em>good</em> work.
          </h1>
          <p className="hero-intro">
            Fieldnote helps thoughtful businesses find their voice, shape their
            spaces, and show up with intention.
          </p>
          <Link className="button button-dark" href="#contact">
            Tell us what you’re making <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div
          className="hero-art"
          aria-label="Abstract arrangement of warm terracotta and sage shapes"
          role="img"
        >
          <div className="sun"></div>
          <div className="arch"></div>
          <div className="stone"></div>
          <span className="art-note">Form follows feeling.</span>
        </div>
      </section>

      <section className="marquee" aria-label="Fieldnote values">
        <div>
          Curious by nature <span>✳</span> Considered in practice <span>✳</span>{" "}
          Made to last <span>✳</span>
        </div>
      </section>

      <section className="services container" id="services">
        <div className="section-heading">
          <p className="eyebrow">The good stuff</p>
          <h2>
            Work with <em>meaning.</em>
          </h2>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <article className="service-item" key={service.number}>
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <span className="service-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="approach" id="approach">
        <div className="approach-grid container">
          <p className="eyebrow">A little about us</p>
          <div>
            <h2>
              Small team.
              <br />
              <em>Big attention.</em>
            </h2>
            <p className="approach-copy">
              We believe the most enduring work comes from paying attention — to
              the people, the problem, and the little details that make
              something feel just right.
            </p>
            <p className="approach-signoff">— Rowan & Mira, founders</p>
          </div>
        </div>
      </section>

      <section className="contact container" id="contact">
        <div className="contact-heading">
          <p className="eyebrow">Your turn</p>
          <h2>
            Have a good one
            <br />
            <em>in mind?</em>
          </h2>
          <p>
            Tell us a little about it. We’ll get back to you within one business
            day.
          </p>
          <a href="mailto:hello@fieldnote.studio">hello@fieldnote.studio</a>
        </div>
        <ContactForm />
      </section>

      <footer className="site-footer container">
        <Link className="wordmark" href="#top">
          Fieldnote<span>®</span>
        </Link>
        <p>Made with care in Portland, Oregon</p>
        <p>© 2024 Fieldnote Studio</p>
      </footer>
    </main>
  );
}
