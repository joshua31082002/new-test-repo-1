import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Field Notes home">
          FIELD<span>/</span>NOTES
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="#about">About</Link>
          <Link href="#notes">Notes</Link>
          <a className="nav-cta" href="mailto:hello@example.com">
            Say hello <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">
            Independent creative practice <span aria-hidden="true">—</span> 2024
          </p>
          <h1 id="hero-title">
            Making space for
            <br />
            <em>good ideas</em> to grow.
          </h1>
          <div className="hero-footer">
            <p className="hero-copy">
              A small studio for thoughtful digital experiences, clear stories,
              and the occasional detour.
            </p>
            <Link className="circle-link" href="#about" aria-label="Scroll to learn more">
              <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </section>

        <section className="intro" id="about" aria-labelledby="about-title">
          <p className="section-number">01 / About</p>
          <div className="intro-content">
            <h2 id="about-title">
              Curiosity is
              <br />
              <span>the throughline.</span>
            </h2>
            <div className="intro-text">
              <p>
                I work with people who care about the details — turning early
                thoughts into useful, beautiful things that feel inevitable in
                hindsight.
              </p>
              <a className="text-link" href="mailto:hello@example.com">
                Start a conversation <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="notes" id="notes" aria-labelledby="notes-title">
          <div className="section-heading">
            <p className="section-number">02 / Recent notes</p>
            <h2 id="notes-title">
              A few things
              <br />
              <em>on my mind.</em>
            </h2>
          </div>
          <div className="note-list">
            {[
              ["01", "Field note", "The quiet power", "of a clear brief."],
              ["02", "Observation", "Designing for", "the second look."],
              ["03", "In practice", "Less, but better", "is a practice."],
            ].map(([number, type, firstLine, secondLine]) => (
              <article className="note-card" key={number}>
                <p className="note-meta">
                  {number} <span>{type}</span>
                </p>
                <h3>
                  {firstLine}
                  <br />
                  {secondLine}
                </h3>
                <Link className="text-link" href="#notes">
                  Read note <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          Field Notes <span aria-hidden="true">©</span> 2024
        </p>
        <p>Built with attention.</p>
      </footer>
    </>
  );
}
