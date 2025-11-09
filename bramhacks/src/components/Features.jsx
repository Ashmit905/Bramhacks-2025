import React from 'react';

// Facts about glare, light pollution, and headlight safety
const facts = [
  {
    title: 'LED blue light & retina risk',
    desc: (
      <>
        LEDs emit more blue light than conventional lamps. In a rodent model, chronic exposure to{' '}
        <strong className="font-semibold text-white">~750 lux</strong>{' '}LED light caused light‑induced retinal injury.
      </>
    ),
    src: 'NIH / Environmental Health Perspectives',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3948037/'
  },
  {
    title: 'Headlight quality has improved',
    desc: (
      <>
  Only <strong className="font-semibold text-white">1</strong> of <strong className="font-semibold text-white">80+</strong> headlight systems on 2016 midsize cars earned a good rating. By 2025,{' '}
        <strong className="font-semibold text-white">51%</strong> of tested systems are rated good; about{' '}
        <strong className="font-semibold text-white">16%</strong> remain marginal or poor due to inadequate visibility or excessive glare.
      </>
    ),
    src: 'IIHS Headlight Ratings',
    href: 'https://www.iihs.org/research-areas/headlights'
  },
  {
    title: 'Better headlights, fewer crashes',
    desc: (
      <>
        Vehicles with good headlight visibility ratings have{' '}
        <strong className="font-semibold text-white">19%</strong> fewer nighttime single‑vehicle crashes and{' '}
  <strong className="font-semibold text-white">23%</strong> fewer nighttime pedestrian crashes vs. poor‑rated headlights (Brumbelow, 2022).
      </>
    ),
    src: 'IIHS Research',
    href: 'https://www.iihs.org/research-areas/headlights'
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-[#0f1724]" aria-labelledby="features-heading">
      <div className="max-w-[1120px] mx-auto px-4">
        <h2 id="features-heading" className="text-3xl font-semibold text-white pb-6 capitalize">why glare & light pollution matter</h2>
        <p className="text-slate-300 mb-6 capitalize">light pollution heatmap in brampton</p>

        {/* Map/screenshot image (place the file in /public as radiance-info.png) */}
        <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg mb-8 bg-slate-900/40">
          <img
            src="/radiance-info.png"
            alt="Radiance info map with timeline overlay showing rising light pollution around Brampton"
            className="w-full h-auto block"
            loading="lazy"
          />
          <div className="px-4 py-3 border-t border-slate-800/70 text-slate-400 text-xs flex items-center gap-3">
            <span>Source:
              {' '}
              <a className="underline hover:text-slate-200" href="https://www.lightpollutionmap.info/#zoom=10.29&lat=43.7440&lon=-79.6506&state=eyJiYXNlbWFwIjoiTGF5ZXJCaW5nSHlicmlkIiwib3ZlcmxheSI6InZpaXJzXzIwMjQiLCJvdmVybGF5Y29sb3IiOmZhbHNlLCJvdmVybGF5b3BhY2l0eSI6IjYwIiwiZmVhdHVyZXNvcGFjaXR5IjoiODUifQ==" target="_blank" rel="noreferrer noopener">lightpollutionmap.info</a>
            </span>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.title} className="p-5 card-dark">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-300 text-sm">{f.desc}</p>
              <a href={f.href} target="_blank" rel="noreferrer noopener" className="inline-block mt-3 text-xs text-slate-400 underline hover:text-slate-200">
                {f.src} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
