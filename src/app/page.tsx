const productUrl = "https://www.oneplus.com/us/15";

const stats = [
  { value: "7300", unit: "mAh", label: "Titan battery" },
  { value: "120", unit: "FPS", label: "Always-on gaming" },
  { value: "8", unit: "Elite Gen 5", label: "Snapdragon platform" },
];

const features = [
  {
    number: "01",
    title: "Power that refuses to fade.",
    copy: "A flagship battery built for long sessions, late nights, and everything after the low-power warning.",
    label: "ENDURANCE",
    className: "feature-battery",
  },
  {
    number: "02",
    title: "Your fastest frame of mind.",
    copy: "Always-on 120FPS gaming keeps every swipe, sprint, and split-second decision feeling immediate.",
    label: "MOTION",
    className: "feature-motion",
  },
  {
    number: "03",
    title: "Quietly in control.",
    copy: "OxygenOS 16 makes the whole experience feel lighter, smarter, and ready for whatever comes next.",
    label: "OXYGENOS 16",
    className: "feature-software",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function PhoneMockup() {
  return (
    <div className="phone-stage" aria-label="Abstract render of the OnePlus 15 phone">
      <div className="phone-glow" />
      <div className="phone-back">
        <div className="phone-camera-ring">
          <div className="camera-lens camera-lens-top" />
          <div className="camera-lens camera-lens-bottom" />
          <div className="camera-flash" />
        </div>
        <span className="phone-mark">1+</span>
      </div>
      <div className="phone-edge" />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="OnePlus 15 home">
          <span className="wordmark-symbol">1+</span>
          <span>ONEPLUS</span>
        </a>
        <div className="nav-links">
          <a href="#power">Power</a>
          <a href="#experience">Experience</a>
          <a href="#specs">Specs</a>
        </div>
        <a className="nav-cta" href={productUrl} target="_blank" rel="noreferrer">
          Buy OnePlus 15 <ArrowIcon />
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-copy">
          <p className="eyebrow">ONEPLUS 15 / POWER ON</p>
          <h1>
            Limits
            <br />
            <em>off.</em>
          </h1>
          <p className="hero-intro">
            The performance flagship for people who refuse to slow down.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={productUrl} target="_blank" rel="noreferrer">
              Explore OnePlus 15 <ArrowIcon />
            </a>
            <a className="text-link" href="#power">See what powers it <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <PhoneMockup />
        <p className="hero-caption">DESIGNED FOR<br />THE NEXT MOVE</p>
        <div className="scroll-cue" aria-hidden="true"><span /> SCROLL TO UNLOCK</div>
      </section>

      <section className="proof-strip" id="power" aria-label="OnePlus 15 performance highlights">
        <div className="section-label">THE NUMBERS<br />DON&apos;T LIE</div>
        {stats.map((stat) => (
          <article className="stat" key={stat.label}>
            <p className="stat-value">{stat.value}<sup>{stat.unit}</sup></p>
            <p className="stat-label">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="statement" id="experience">
        <p className="eyebrow">01 / UNCHAINED PERFORMANCE</p>
        <h2>
          More power.
          <br />
          <span>Less waiting.</span>
        </h2>
        <p className="statement-copy">
          Built around the Snapdragon 8 Elite Gen 5 platform, OnePlus 15 turns raw power into an experience that feels effortless.
        </p>
      </section>

      <section className="feature-list" aria-label="OnePlus 15 features">
        {features.map((feature) => (
          <article className={`feature-row ${feature.className}`} key={feature.number}>
            <span className="feature-number">{feature.number}</span>
            <div className="feature-art" aria-hidden="true"><span className="art-line" /><span className="art-orb" /></div>
            <div className="feature-content">
              <p className="eyebrow">{feature.label}</p>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </div>
            <span className="feature-arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </section>

      <section className="specs-section" id="specs">
        <div>
          <p className="eyebrow">THE ONEPLUS 15</p>
          <h2>Ready when<br /><em>you are.</em></h2>
        </div>
        <div className="specs-list">
          <div><span>PROCESSOR</span><strong>Snapdragon® 8 Elite Gen 5</strong></div>
          <div><span>SOFTWARE</span><strong>OxygenOS 16</strong></div>
          <div><span>GAMING</span><strong>Always-on 120FPS</strong></div>
          <div><span>BATTERY</span><strong>7300mAh</strong></div>
        </div>
      </section>

      <section className="closing-cta">
        <p className="eyebrow">POWER ON</p>
        <h2>Make your<br /><em>move.</em></h2>
        <a className="button button-light" href={productUrl} target="_blank" rel="noreferrer">
          Get OnePlus 15 <ArrowIcon />
        </a>
        <p className="cta-note">Opens the official OnePlus product page</p>
      </section>

      <footer className="site-footer">
        <span className="wordmark"><span className="wordmark-symbol">1+</span> ONEPLUS</span>
        <span>POWER ON. LIMITS OFF.</span>
        <span>© 2025 ONEPLUS</span>
      </footer>
    </main>
  );
}
