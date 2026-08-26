const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  return (
    <main>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8" aria-label="Main navigation">
        <a href="#top" className="flex min-h-11 items-center gap-2 font-semibold tracking-tight" aria-label="Luma home">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--ink)] text-sm font-bold text-white">L</span>
          <span className="text-lg">luma<span className="text-[var(--accent)]">.</span></span>
        </a>
        <div className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          <a className="transition-colors duration-200 hover:text-[var(--ink)]" href="#why">Why Luma</a>
          <a className="transition-colors duration-200 hover:text-[var(--ink)]" href="#method">Our method</a>
          <a className="transition-colors duration-200 hover:text-[var(--ink)]" href="#contact">Contact</a>
        </div>
        <a href="#contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--moss)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2">
          Get started <ArrowUpRight />
        </a>
      </nav>

      <section id="top" className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:pb-28 lg:pt-24">
        <div className="reveal">
          <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--moss)]"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Clarity for what&apos;s next</p>
          <h1 className="max-w-2xl font-[family-name:var(--font-serif)] text-5xl leading-[1.02] tracking-[-0.04em] sm:text-7xl">Make space for your <em className="font-normal text-[var(--moss)]">best</em> work.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--muted)]">Luma brings your team&apos;s ideas, priorities, and momentum into one calm, focused place.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#contact" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--accent)] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(228,119,86,.18)] transition duration-200 hover:-translate-y-1 hover:bg-[#d9694a] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2">Start a conversation <ArrowUpRight /></a>
            <a href="#why" className="inline-flex min-h-12 items-center rounded-full px-4 text-sm font-semibold text-[var(--moss)] transition duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">See how it works</a>
          </div>
        </div>

        <div className="reveal reveal-delay relative mx-auto w-full max-w-md">
          <div className="absolute -right-3 -top-5 h-28 w-28 rounded-full border border-[var(--accent)]/30 sm:-right-8 sm:-top-8" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--sage)] p-5 shadow-[0_22px_60px_rgba(70,99,78,.14)] sm:p-7">
            <div className="rounded-[1.4rem] bg-[var(--surface)] p-6 sm:p-8">
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Today</span><span className="h-2 w-2 rounded-full bg-[#75a57c]" /></div>
              <div className="mt-10"><p className="text-sm text-[var(--muted)]">Your focus</p><p className="mt-2 text-3xl font-semibold tracking-tight">Ship the good stuff.</p></div>
              <div className="mt-9 space-y-3">
                {["Refine the big idea", "Share with the team", "Make room to think"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3 text-sm"><span className={`grid h-6 w-6 place-items-center rounded-full ${index === 1 ? "bg-[var(--accent)] text-white" : "bg-[var(--sage)] text-[var(--moss)]"}`}><Check /></span><span className={index === 1 ? "text-[var(--muted)] line-through" : ""}>{item}</span></div>)}
              </div>
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--sage)]"><div className="h-full w-2/3 rounded-full bg-[var(--moss)]" /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="border-y border-[var(--line)] bg-white/55">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">The Luma difference</p><h2 className="mt-4 max-w-sm font-[family-name:var(--font-serif)] text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Less noise.<br />More signal.</h2></div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[{ n: "01", t: "Find focus", d: "See what matters now, without losing sight of the bigger picture." }, { n: "02", t: "Move together", d: "Give every idea a clear next step and every person a voice." }, { n: "03", t: "Keep momentum", d: "Build a rhythm that makes progress feel natural, not frantic." }].map((item) => <article key={item.n} className="border-t-2 border-[var(--ink)] pt-5"><p className="text-sm font-bold text-[var(--accent)]">{item.n}</p><h3 className="mt-10 text-lg font-bold">{item.t}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.d}</p></article>)}
          </div>
        </div>
      </section>

      <section id="method" className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28"><div className="rounded-[2rem] bg-[var(--ink)] px-7 py-12 text-white sm:px-14 sm:py-16"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sage)]">A better way forward</p><h2 className="mt-5 max-w-md font-[family-name:var(--font-serif)] text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Good work starts with a little room.</h2></div><div><p className="max-w-lg text-base leading-7 text-white/65">Luma is designed for teams who want to do meaningful work without making more work for themselves. Simple by design, thoughtful in all the right places.</p><a href="#contact" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--sage)] px-5 text-sm font-bold text-[var(--ink)] transition duration-200 hover:-translate-y-0.5 hover:bg-white">Bring Luma to your team <ArrowUpRight /></a></div></div></div></section>

      <footer id="contact" className="border-t border-[var(--line)]"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><p className="font-semibold">luma<span className="text-[var(--accent)]">.</span></p><p className="mt-1 text-[var(--muted)]">Make room for what matters.</p></div><a href="mailto:hello@luma.example" className="font-semibold text-[var(--moss)] underline decoration-[var(--sage)] decoration-2 underline-offset-4 transition hover:text-[var(--accent)]">hello@luma.example</a></div></footer>
    </main>
  );
}
