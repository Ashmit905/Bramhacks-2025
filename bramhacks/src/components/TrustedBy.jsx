import React from 'react';

const logos = ['Nova', 'Pulsar', 'Quasar', 'Comet', 'Nebula'];

export default function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="section trusted">
      <div className="container">
        <p className="trusted__label">Trusted by fast-moving teams</p>
        <ul className="trusted__list" role="list">
          {logos.map((name) => (
            <li key={name} className="trusted__item" aria-label={name}>
              <span className="trusted__logo">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
