import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">
        <p className="footer__brand">★ Starless</p>
        <nav aria-label="Footer" className="footer__links">
          <a href="#features">Features</a>
          <a href="#cta">Get Started</a>
        </nav>
        <p className="footer__legal">© {new Date().getFullYear()} Starless. All rights reserved.</p>
      </div>
    </footer>
  );
}
