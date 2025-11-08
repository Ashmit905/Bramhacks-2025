import React from 'react';

const features = [
  {
    title: 'Orbital Roadmaps',
    desc: 'Visualize initiatives as orbits with clear phases and dependencies.'
  },
  {
    title: 'Stellar Sprints',
    desc: 'Plan, track, and reflect with simple agile workflows that stay out of your way.'
  },
  {
    title: 'Signals, not noise',
    desc: 'Automated updates and summaries keep stakeholders aligned without the status chaos.'
  },
  {
    title: 'Launch Checklists',
    desc: 'Reusable templates for announcements, QA, and go-to-market tasks.'
  }
];

export default function Features() {
  return (
    <section id="features" className="section section--alt" aria-labelledby="features-heading">
      <div className="container">
        <h2 id="features-heading" className="section__title">Built for teams that ship</h2>
        <p className="section__subtitle">Opinionated defaults, flexible where it matters.</p>
        <div className="grid grid--4">
          {features.map((f) => (
            <div key={f.title} className="card feature">
              <h3 className="feature__title">{f.title}</h3>
              <p className="feature__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
