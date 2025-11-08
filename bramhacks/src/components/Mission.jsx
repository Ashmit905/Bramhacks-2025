import React from 'react';

function SplitCard({ title, subtitle, bullets = [], reverse = false, imageHref, imageSrc }) {
  return (
    <div className={`split-card ${reverse ? 'split-card--rev' : ''}`}>
      <div className="split-card__content">
        <h3 className="section__title">{title}</h3>
        <p className="section__subtitle">{subtitle}</p>
        {/* bullets intentionally omitted for cleaner layout */}
      </div>
      <div className="split-card__media" aria-hidden="true">
        {imageSrc ? (
          imageHref ? (
            <a className="split-media-link" href={imageHref} target="_blank" rel="noopener noreferrer">
              <img src={imageSrc} alt={title} className="split-media-img" />
            </a>
          ) : (
            <img src={imageSrc} alt={title} className="split-media-img" />
          )
        ) : (
          <div className="visual__card">
            <div className="visual__header" />
            <div className="visual__content">
              <div className="visual__panel" />
              <div className="visual__panel small" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Mission() {
  const items = [
    {
      title: "Why we're building Starless",
      subtitle:
        "According to studies, 98% of drivers report being affected by night time glare. Additionaly, 75% of drivers choose to stay off the road do so due to this pressing concern. This contributes to the signifcant increase in light pollutino gloablly, as North American skies get 10% brighter every year. ",
      bullets: [
        'Signal-first: surface the metrics that actually move the needle.',
        'Low friction: reduce setup and meeting overhead — spend time shipping.',
        'Shared clarity: make trade-offs visible across stakeholders.'
      ],
      imageHref: 'https://www.itv.com/news/2019-06-11/growing-concern-among-drivers-over-headlight-glare',
      imageSrc: '/importedImage325614_header.jpeg'
    },
    {
      title: 'Our solution',
      subtitle:
        'We built an Arduino powered light sensor that can be used to measure night time headlight glare. We deloped a sample of led strip lights that dim when certain bulbs when light is detected in front of them. This would reduce the blinding affect that drivers experience when facing oncoming traffic.',
      bullets: [
        'Automated summaries that keep work moving.',
        'Contextual heatmaps and visualizations so teams don’t guess.',
      ]
    }
  ];

  return (
    <section id="mission" className="section" aria-labelledby="mission-heading">
      <div className="container">
        {items.map((it, idx) => (
          <SplitCard
            key={it.title}
            title={it.title}
            subtitle={it.subtitle}
            bullets={it.bullets}
            reverse={idx % 2 === 1}
            imageHref={it.imageHref}
            imageSrc={it.imageSrc}
          />
        ))}
      </div>
    </section>
  );
}
