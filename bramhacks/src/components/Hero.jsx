import React from 'react';
import StarField from './StarField';

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="min-h-[78vh] flex items-center justify-center relative overflow-hidden px-4"
    >
      <StarField />
      <div className="relative w-full max-w-5xl mx-auto" style={{ zIndex: 10 }}>
        <div
          className="starless-card starless-card--padded text-slate-900"
          style={{ position: 'relative', zIndex: 11 }}
        >
          <h1
            id="hero-heading"
            className="font-semibold leading-[1.03] text-[40px] md:text-[64px] tracking-tight text-slate-900"
          >
            Starless
          </h1>
          <p className="mt-4 text-slate-700 text-lg md:text-xl max-w-2xl">
            Smart adaptive LEDs that dim only where there’s oncoming traffic — reducing glare while keeping your lane bright.
          </p>
          <p className="mt-2 text-slate-600 text-base md:text-lg max-w-2xl">
            <span className="accent-gradient font-semibold">Safer roads</span>, clearer nights.
          </p>
          <div className="mt-8">
            <a href="#features" className="btn-accent px-6 py-3 text-sm">Explore Facts</a>
          </div>
        </div>
      </div>
    </section>
  );
}
