import React from 'react';
import StarField from './StarField';

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-heading">
      <StarField />
      <div className="hero__content">
        <div className="hero__bg">
          <h3>Introducing</h3>
          <h1 id="hero-heading" className="hero__title">Starless</h1>
          <p className="hero__subtitle"></p>

          <p className="hero__meta" aria-label="Early access status" id='hero_desc'>Smart adaptive LEDs that dim only where there's oncoming traffic — safer roads, clearer nights.</p>
          <div className="hero__actions">
            <a href="#features" className="button button--lg">Explore Features</a>
          </div>
        </div>
      </div>
    </section>
  );
}
