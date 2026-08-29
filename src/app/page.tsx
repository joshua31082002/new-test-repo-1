import { ArrowMark } from "@/components/arrow-mark";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { siteContent } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top">
          {siteContent.brand}
          <span>®</span>
        </a>
        <div className="nav-links">
          <a href="#work">What we do</a>
          <a href="#approach">Approach</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#contact">
          Start a conversation <ArrowMark />
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{siteContent.eyebrow}</p>
          <h1>{siteContent.title}</h1>
          <p className="hero-intro">{siteContent.intro}</p>
          <a className="primary-button" href="#contact">
            Talk to Northstar <ArrowMark />
          </a>
        </div>
        <div className="hero-aside">
          <p>{siteContent.heroNote}</p>
          <span className="hero-line" />
        </div>
        <div className="hero-index" aria-hidden="true">
          01 <span>/</span> 04
        </div>
      </section>

      <section className="marquee" aria-label="Northstar values">
        <span>Clarity</span>
        <i>✳</i>
        <span>Conviction</span>
        <i>✳</i>
        <span>Momentum</span>
        <i>✳</i>
        <span>Clarity</span>
      </section>

      <section className="section section-services" id="work">
        <SectionHeading
          eyebrow="The work"
          title="Good strategy changes the quality of the questions."
          description="We work where the path forward is important, but not yet obvious."
        />
        <div className="services-grid">
          {siteContent.services.map((service) => (
            <article className="service-card" key={service.number}>
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="card-arrow">
                <ArrowMark />
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="section approach-section" id="approach">
        <div className="approach-intro">
          <p className="eyebrow">Our approach</p>
          <p className="large-statement">
            Less theatre.
            <br />
            <em>More traction.</em>
          </p>
        </div>
        <div className="process-list">
          {siteContent.process.map(([title, description], index) => (
            <article className="process-item" key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="proof-section">
        <div className="proof-quote">
          <span className="quote-mark">“</span>
          <blockquote>{siteContent.proof.quote}</blockquote>
          <p>
            {siteContent.proof.name} <span>{siteContent.proof.role}</span>
          </p>
        </div>
        <div className="proof-result">
          <strong>{siteContent.proof.result}</strong>
          <span>{siteContent.proof.resultLabel}</span>
        </div>
      </section>

      <section className="section faq-section">
        <SectionHeading
          eyebrow="A few answers"
          title="The useful kind of confidence comes with context."
        />
        <div className="faq-list">
          {siteContent.faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">Make a start</p>
          <h2>
            Let’s make the next move <em>clear.</em>
          </h2>
          <p>
            Tell us what’s on your mind. We’ll bring a point of view and a
            useful next question.
          </p>
          <p className="contact-note">
            Usually replies within two business days.
          </p>
        </div>
        <InquiryForm />
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#top">
          {siteContent.brand}
          <span>®</span>
        </a>
        <p>Independent strategy for ambitious teams.</p>
        <p>© 2025 Northstar Studio</p>
      </footer>
    </main>
  );
}
