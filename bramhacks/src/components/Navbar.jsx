import React from 'react';

// Simple geometric triangle mark (brand icon) to emulate a clean, minimalist logo style.
// Minimal 5-point star (slightly rounded joins) for brand mark
function LogoMark({ size = '1.1em' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="block"
      fill="currentColor"
    >
      <path d="M12 2.9l2.85 6.07 6.65.58-5.06 4.39 1.53 6.49L12 16.9l-6.97 3.53 1.53-6.49L1.5 9.55l6.65-.58L12 2.9z" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 backdrop-blur-md bg-[#060a14]/90 border-b border-slate-800/50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
        <a
          href="#hero"
          aria-label="Starless home"
          className="flex items-center gap-2 text-slate-100"
        >
          <LogoMark />
          <span className="brand-wordmark select-none text-xl">Starless</span>
        </a>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm">
          <a href="#mission" className="text-slate-300 hover:text-white transition-colors">Our Mission</a>
          <a href="#cta" className="btn-accent px-4 py-2">Get Updates</a>
        </nav>
      </div>
    </header>
  );
}
