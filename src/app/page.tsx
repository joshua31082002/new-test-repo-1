"use client";

import { FormEvent, useState } from "react";

const focusAreas = [
  {
    number: "01",
    title: "Make room",
    description:
      "We help neighbors turn overlooked spaces into places for food, shade, and belonging.",
  },
  {
    number: "02",
    title: "Share power",
    description:
      "We put tools, small grants, and practical knowledge in the hands of people closest to the work.",
  },
  {
    number: "03",
    title: "Keep showing up",
    description:
      "We make local action visible, repeatable, and contagious — one good thing leading to another.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setStatus("error");
      setErrorMessage("Add a valid email so we know where to reach you.");
      return;
    }

    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 700);
  }

  return (
    <main>
      <header className="site-header shell">
        <a className="wordmark" href="#top" aria-label="Common Ground home">
          <span className="wordmark-mark" aria-hidden="true">
            +
          </span>
          Common Ground
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#why">Why it matters</a>
          <a href="#focus">Our focus</a>
          <a className="nav-cta" href="#join">
            Join us <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="hero shell" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow reveal">A people-powered effort · Est. 2024</p>
          <h1 className="hero-title reveal reveal-delay-1" id="hero-title">
            Change starts <em>closer</em> than you think.
          </h1>
          <p className="hero-intro reveal reveal-delay-2">
            Common Ground brings good people, practical tools, and local action together — so the places we share can work better for everyone.
          </p>
          <div className="hero-actions reveal reveal-delay-3">
            <a className="button button-primary" href="#join">
              Join the movement <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#why">
              See why it matters <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-art" aria-label="Illustration of a thriving shared garden" role="img">
          <div className="art-sun" aria-hidden="true" />
          <div className="art-label">Small steps.<br />Shared future.</div>
          <div className="art-hill art-hill-back" aria-hidden="true" />
          <div className="art-hill art-hill-front" aria-hidden="true" />
          <div className="art-stem art-stem-one" aria-hidden="true"><span /></div>
          <div className="art-stem art-stem-two" aria-hidden="true"><span /></div>
          <div className="art-stem art-stem-three" aria-hidden="true"><span /></div>
          <div className="art-person" aria-hidden="true"><i /><b /><strong /></div>
          <div className="art-caption">A shared space<br />in Easton, Bristol</div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Our approach">
        <div className="shell proof-grid">
          <p className="proof-kicker">What happens when<br />we work together?</p>
          <p><strong>312</strong><span>neighbors involved</span></p>
          <p><strong>18</strong><span>projects in motion</span></p>
          <p><strong>1</strong><span>shared direction</span></p>
        </div>
      </section>

      <section className="story shell" id="why" aria-labelledby="story-title">
        <div className="section-marker"><span>01</span><span>Why it matters</span></div>
        <div className="story-content">
          <h2 id="story-title">The future is not<br /><em>somewhere else.</em></h2>
          <div className="story-body">
            <p className="story-lead">It is in the street you walk down. The park you pass. The people you have not met yet.</p>
            <p>We believe change becomes possible when it becomes personal. So we support small, determined groups making their corners of the world kinder, greener, and more connected.</p>
            <p>No grand gestures required. Just a place to start, and people to start with.</p>
            <a className="text-link" href="#join">Read our full story <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="focus-section" id="focus" aria-labelledby="focus-title">
        <div className="shell">
          <div className="section-marker section-marker-light"><span>02</span><span>Our focus</span></div>
          <div className="focus-heading">
            <h2 id="focus-title">Good things grow<br /><em>from the ground up.</em></h2>
            <p>We are here for the practical, hopeful work of making change stick.</p>
          </div>
          <div className="focus-grid">
            {focusAreas.map((area) => (
              <article className="focus-card" key={area.number}>
                <span className="focus-number">{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="join-section shell" id="join" aria-labelledby="join-title">
        <div className="join-panel">
          <div>
            <p className="eyebrow">Your move</p>
            <h2 id="join-title">Bring your<br /><em>good energy.</em></h2>
          </div>
          <div className="join-form-wrap">
            {status === "success" ? (
              <div className="form-message form-success" role="status">
                <span className="message-icon" aria-hidden="true">✓</span>
                <h3>You are on the list.</h3>
                <p>We will be in touch with a small way to start making a difference.</p>
                <button className="text-link form-reset" type="button" onClick={() => { setStatus("idle"); setEmail(""); }}>
                  Add another email <span aria-hidden="true">↗</span>
                </button>
              </div>
            ) : (
              <form className="join-form" onSubmit={handleSubmit} noValidate>
                <label htmlFor="email">Get occasional notes on local action.</label>
                <div className="input-row">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }}
                    placeholder="Your email address"
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "email-error" : undefined}
                    disabled={status === "loading"}
                  />
                  <button className="button button-dark" type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Joining…" : "I’m in"} <span aria-hidden="true">↗</span>
                  </button>
                </div>
                {status === "error" && <p className="form-error" id="email-error" role="alert">{errorMessage}</p>}
                <p className="form-note">No noise. Just useful things worth knowing.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer shell">
        <a className="wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true">+</span> Common Ground</a>
        <p>Made for the places we share.</p>
        <p>© 2024 Common Ground</p>
      </footer>
    </main>
  );
}
