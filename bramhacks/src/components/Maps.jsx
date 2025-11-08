import React, { useRef, useEffect, useState } from 'react';

// Simple interactive heatmap-like visualization using canvas.
// This is a lightweight placeholder that simulates hotspots and allows
// toggling point density and radius. Replace with real data/tiles later.
export default function Maps() {
  const canvasRef = useRef(null);
  const [density, setDensity] = useState(120);
  const [radius, setRadius] = useState(40);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = (canvas.width = canvas.clientWidth * dpr);
      const h = (canvas.height = canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const samplePoints = () => {
      const points = [];
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      // cluster some points so heatmap looks interesting
      for (let i = 0; i < density; i++) {
        // bias towards a few clusters
        const cluster = Math.floor(Math.random() * 4);
        let cx = W * (0.15 + cluster * 0.25 + Math.random() * 0.18);
        let cy = H * (0.25 + (cluster % 2) * 0.45 + (Math.random() - 0.5) * 0.18);
        cx = Math.max(10, Math.min(W - 10, cx));
        cy = Math.max(10, Math.min(H - 10, cy));
        points.push({ x: cx, y: cy, v: Math.random() });
      }
      return points;
    };

    let points = samplePoints();

    function draw() {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      ctx.clearRect(0, 0, W, H);

      // subtle background map-like gradients
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, 'rgba(10,14,25,0.8)');
      bg.addColorStop(1, 'rgba(8,10,18,0.95)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // draw heat circles additive
      ctx.globalCompositeOperation = 'lighter';
      for (const p of points) {
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        const alpha = 0.15 + p.v * 0.45;
        grd.addColorStop(0, `rgba(100,120,255,${alpha})`);
        grd.addColorStop(0.35, `rgba(120,80,200,${alpha * 0.9})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // draw subtle grid/contours
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      const step = Math.min(120, Math.max(60, Math.round(W / 8)));
      for (let x = step; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
    }

    let raf = null;
    const tick = () => {
      // small jitter to points for subtle motion
      for (const p of points) {
        p.x += (Math.random() - 0.5) * 0.6;
        p.y += (Math.random() - 0.5) * 0.6;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(tick);

    // re-sample points when density or radius changes
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [density, radius]);

  // small UI controls to tweak heatmap
  return (
    <section id="maps" className="section maps" aria-labelledby="maps-heading">
      <div className="container">
        <h2 id="maps-heading" className="section__title">Maps & visualizations</h2>
        <p className="section__subtitle">Heatmaps and spatial visualizations to highlight activity and signals.</p>
        <div className="maps__inner">
          <div className="maps__canvas">
            <canvas ref={canvasRef} style={{ width: '100%', height: '420px', borderRadius: '12px' }} />
          </div>
          <div className="maps__controls" aria-hidden="false">
            <label className="maps__label">Density</label>
            <input type="range" min="20" max="400" value={density} onChange={(e) => setDensity(Number(e.target.value))} />
            <label className="maps__label">Radius</label>
            <input type="range" min="8" max="120" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
            <p className="maps__help">Use the sliders to quickly tune the visualization. Replace with real data later.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
