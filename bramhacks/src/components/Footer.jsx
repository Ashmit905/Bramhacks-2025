import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10 bg-[#080d1c]" role="contentinfo">
      <div className="max-w-[1120px] mx-auto px-4 grid gap-4 justify-items-center">
        <p className="text-white font-semibold">★ Starless</p>
        <nav aria-label="Footer" className="flex gap-4">
          <a href="#features" className="text-slate-300 hover:text-white">Features</a>
          <a href="#cta" className="text-slate-300 hover:text-white">Get Started</a>
        </nav>
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Starless. All rights reserved.</p>
      </div>
    </footer>
  );
}
