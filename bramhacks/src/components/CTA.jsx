import React from 'react';

export default function CTA() {
  return (
    <section id="cta" className="section cta" aria-labelledby="cta-heading">
      <div className="container cta__inner">
        <h2 id="cta-heading" className="section__title">Ready to navigate the night?</h2>
        <p className="section__subtitle">Join the Starless beta and bring your roadmap into focus.</p>
        <form className="cta__form" onSubmit={(e) => e.preventDefault()} aria-label="Join waitlist">
          <label htmlFor="email" className="sr-only">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@company.com" className="input" />
          <button type="submit" className="button button--primary">Join waitlist</button>
        </form>
      </div>
    </section>
  );
}
