import { InquiryForm } from '@/components/inquiry-form';

const projects = [
  {
    number: '01',
    title: 'Morrow House',
    type: 'Brand identity · Hospitality',
    description: 'A new visual language for a quiet coastal hotel built around the idea of coming back to yourself.',
    className: 'project-morrow',
  },
  {
    number: '02',
    title: 'Field Notes',
    type: 'Digital product · Editorial',
    description: 'An online journal for the people making a more generous future for food, land, and community.',
    className: 'project-field',
  },
  {
    number: '03',
    title: 'Common Thread',
    type: 'Campaign · Culture',
    description: 'A living archive and invitation for a new generation of independent makers to find one another.',
    className: 'project-thread',
  },
];

const capabilities = [
  ['01', 'Brand strategy', 'Positioning, naming, verbal identity, and the sharp idea that gives every decision a center.'],
  ['02', 'Visual identity', 'A flexible visual system that feels unmistakably yours, from the first mark to the smallest detail.'],
  ['03', 'Digital experiences', 'Websites and products that make a complex idea feel simple, useful, and worth returning to.'],
  ['04', 'Creative direction', 'A thoughtful partner from first conversation to final launch, keeping the work coherent as it grows.'],
];

const steps = [
  ['01', 'Listen closely', 'We start by understanding the tension, ambition, and opportunity underneath the brief.'],
  ['02', 'Find the thread', 'We distill the messy, meaningful parts into a clear point of view and a shared direction.'],
  ['03', 'Make it tangible', 'We build the identity and experience with care, testing the details against the bigger idea.'],
  ['04', 'Leave it stronger', 'You leave with a system your team can use, evolve, and make their own.'],
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Northline home">
          Northline<span className="wordmark-mark">*</span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#approach">Approach</a>
          <a className="nav-cta" href="#inquire">Start a conversation <span aria-hidden="true">↗</span></a>
        </div>
      </nav>

      <section className="hero-shell" id="top" aria-labelledby="hero-title">
        <div className="hero-meta"><span>Independent design studio</span><span>Est. 2016 / Anywhere</span></div>
        <div className="hero-content">
          <p className="eyebrow reveal-up">Strategy / Identity / Digital</p>
          <h1 className="hero-title reveal-up" id="hero-title">Ideas with<br /><em>room to grow.</em></h1>
          <div className="hero-bottom reveal-up">
            <p className="hero-intro">Northline is a brand and digital studio for ambitious organizations building a more considered future.</p>
            <a className="circle-link" href="#work" aria-label="Explore selected work"><span>Explore<br />our work</span><span className="arrow">↓</span></a>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span className="orbit-word">NORTHLINE — NORTHLINE — </span><span className="orbit-center">✳</span></div>
      </section>

      <section className="statement-section section-pad">
        <div className="section-label">/ A little about us</div>
        <div className="statement-grid">
          <p className="statement">We make <em>clearer</em> brands for people doing meaningful things.</p>
          <div className="statement-aside"><p>Not louder. Not busier. Just more true to the thing you are here to do.</p><a className="text-link" href="#approach">Our approach <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <section className="work-section section-pad" id="work" aria-labelledby="work-title">
        <div className="section-heading"><div className="section-label">/ Selected work</div><h2 id="work-title">A few things<br /><em>we’ve made.</em></h2></div>
        <div className="project-list">
          {projects.map((project) => <article className="project-card" key={project.number}><div className={`project-art ${project.className}`}><span className="project-number">{project.number}</span><span className="project-art-note">Northline / archive</span><div className="project-art-shape" /></div><div className="project-caption"><div><h3>{project.title}</h3><p>{project.type}</p></div><p className="project-description">{project.description}</p><span className="project-arrow" aria-hidden="true">↗</span></div></article>)}
        </div>
      </section>

      <section className="capabilities-section section-pad" aria-labelledby="capabilities-title">
        <div className="section-label">/ What we do</div>
        <div className="capabilities-grid"><h2 id="capabilities-title">The useful<br /><em>kind of different.</em></h2><div className="capability-list">{capabilities.map(([number, title, description]) => <div className="capability-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="row-arrow" aria-hidden="true">↗</span></div>)}</div></div>
      </section>

      <section className="approach-section section-pad" id="approach" aria-labelledby="approach-title">
        <div className="section-label">/ Our approach</div>
        <div className="approach-intro"><h2 id="approach-title">Good work starts<br />with <em>attention.</em></h2><p>We believe the best solutions are rarely hiding in plain sight. They appear when you look longer, listen better, and make space for the right question.</p></div>
        <div className="steps-grid">{steps.map(([number, title, description]) => <div className="step" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></div>)}</div>
      </section>

      <section className="inquiry-section section-pad" id="inquire" aria-labelledby="inquiry-title">
        <div className="inquiry-copy"><div className="section-label">/ Start a project</div><h2 id="inquiry-title">Have something<br /><em>in mind?</em></h2><p>Tell us a little about it. We read every note, and we usually reply within two working days.</p><div className="inquiry-contact"><span>Or say hello directly</span><a href="mailto:hello@northline.studio">hello@northline.studio</a></div></div>
        <InquiryForm />
      </section>

      <footer className="site-footer"><div className="footer-top"><a className="wordmark footer-mark" href="#top">Northline<span className="wordmark-mark">*</span></a><p>Brand and digital studio<br />for ambitious organizations.</p><a className="footer-arrow" href="#top" aria-label="Back to top">↑</a></div><div className="footer-bottom"><span>© 2025 Northline Studio</span><span>Made with care / Anywhere</span><div className="footer-social"><a href="mailto:hello@northline.studio">Email ↗</a><a href="#top">Instagram ↗</a></div></div></footer>
    </main>
  );
}
