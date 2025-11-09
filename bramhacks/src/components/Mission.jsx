import React from 'react';

function SplitCard({ title, subtitle, bullets = [], reverse = false, imageHref, imageSrc }) {
  return (
    <div className={`w-full my-8 grid gap-6 md:grid-cols-2 items-stretch`}>
      {/* render media first when reverse is true so ordering is correct without extra CSS hacks */}
      {reverse ? (
        <>
          <div className="flex items-stretch">
            {imageSrc ? (
              imageHref ? (
                <a className="block w-full h-full overflow-hidden rounded-lg" href={imageHref} target="_blank" rel="noopener noreferrer">
                  <img src={imageSrc} alt={title} className="w-full h-full object-cover block" />
                </a>
              ) : (
                <div className="w-full h-80 overflow-hidden rounded-lg">
                  <img src={imageSrc} alt={title} className="w-full h-full object-cover block" />
                </div>
              )
            ) : (
              <div className="w-full h-80 overflow-hidden rounded-lg">
                <img src="/IMG_9844.jpg" alt={title} className="w-full h-full object-cover block" loading="lazy" />
              </div>
            )}
          </div>
          <div className="starless-card p-6 text-slate-900">
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-slate-600">{subtitle}</p>
          </div>
        </>
      ) : (
        <>
          <div className="starless-card p-6 text-slate-900">
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-slate-600">{subtitle}</p>
          </div>
          <div className="flex items-stretch">
            {imageSrc ? (
              imageHref ? (
                <a className="block w-full h-full overflow-hidden rounded-lg" href={imageHref} target="_blank" rel="noopener noreferrer">
                  <img src={imageSrc} alt={title} className="w-full h-full object-cover block" />
                </a>
              ) : (
                <div className="w-full h-80 overflow-hidden rounded-lg">
                  <img src={imageSrc} alt={title} className="w-full h-full object-cover block" />
                </div>
              )
            ) : (
              <div className="w-full h-80 overflow-hidden rounded-lg">
                <img src="/IMG_9844.jpg" alt={title} className="w-full h-full object-cover block" loading="lazy" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Mission() {
  const items = [
    {
      title: "Why we're building Starless",
      subtitle:
        "According to studies, 98% of drivers report being affected by night time glare. Additionaly, 75% of drivers choose to stay off the road do so due to this pressing concern. This contributes to the signifcant increase in light pollution gloablly, as North American skies get 10% brighter every year. ",
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
    <section id="mission" className="py-16" aria-labelledby="mission-heading">
      <div className="max-w-[1120px] mx-auto px-4">
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
