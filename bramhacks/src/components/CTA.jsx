import React from 'react';

export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-[#060a14] text-center relative" aria-labelledby="cta-heading">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_70%)]" />
      <div className="max-w-[880px] mx-auto px-6 relative">
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
          Help reduce dangerous headlight glare
        </h2>
        <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
          We’re building an open data prototype that measures on‑road glare and light pollution trends. Sign up to follow progress,
          access early reports, and contribute feedback on the sensor design.
        </p>
        <form className="flex flex-wrap gap-3 justify-center" onSubmit={(e) => e.preventDefault()} aria-label="Join early access list">
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="bg-slate-900/80 border border-slate-700/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 text-white rounded-md px-4 py-2 w-[260px] transition"
          />
          <button
            type="submit"
            className="btn-primary px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 border-indigo-500/60 font-semibold shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Get updates
          </button>
        </form>
        <div className="mt-5 text-xs text-slate-400">
          <span>
            Sources: <a href="https://www.iihs.org/research-areas/headlights" target="_blank" rel="noreferrer noopener" className="underline hover:text-slate-200">IIHS</a>{' '}·{' '}
            <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3948037/" target="_blank" rel="noreferrer noopener" className="underline hover:text-slate-200">NIH (LED study)</a>
          </span>
        </div>
      </div>
    </section>
  );
}
