import React from 'react';
import '../styles/landing.css';

export default function Navbar() {
  return (
    <header className="nav" role="banner">
      <div className="nav__inner">
        <a href="#hero" className="nav__brand" aria-label="Starless home">★ Starless</a>
        <nav aria-label="Main" className="nav__links">
          <a href="#mission">Our Mission</a>
          <a href="#cta" className="button button--sm">Get Started</a>
        </nav>
      </div>
    </header>
  );
}
