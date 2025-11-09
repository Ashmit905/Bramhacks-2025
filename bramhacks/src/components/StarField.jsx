import React, { useRef, useEffect } from 'react';

// Continuous falling beam effect (like rain or starfield)
// Beams spawn at top and fall down constantly for atmospheric background
export default function StarField({ maxBeams = 12 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    let width = canvas.width = canvas.offsetWidth * dpr;
    let height = canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // beams pool
    const beams = [];

    function createBeam(x) {
      const w = 20 + Math.random() * 60; // beam width
      const len = 120 + Math.random() * 280; // visible length
      const intensity = 0.35 + Math.random() * 0.65;
      const hue = 30 + Math.random() * 40; // warm headlight color (yellow-ish)
      const speed = 2 + Math.random() * 3;
      beams.push({ x, w, len, y: -len, dir: 1, speed, intensity, hue, life: 1.0 });
    }

    // Continuous spawn timer: add beams at regular intervals
    const spawnInterval = setInterval(() => {
      if (beams.length < maxBeams) {
        const x = 40 + Math.random() * (canvas.offsetWidth - 80);
        createBeam(x);
      }
    }, 400 + Math.random() * 300); // spawn every ~400-700ms

    // subtle ambient moving lights to fill scene
    const ambient = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    }));

    let running = true;

    function draw() {
      if (!running) return;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      // Clear previous frame completely to avoid black trailing artifacts
      ctx.clearRect(0, 0, W, H);

      // ambient faint specks
      ctx.globalCompositeOperation = 'lighter';
      for (const a of ambient) {
        a.phase += 0.005;
        const alpha = 0.02 + 0.02 * Math.sin(a.phase);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // draw beams
      for (let i = beams.length - 1; i >= 0; i--) {
        const b = beams[i];
        // update position
        b.y += b.speed * b.dir * (1 + 0.2 * Math.sin(performance.now() / 200 + i));
        b.life -= 0.004;

        // beam gradient
        const gx = ctx.createLinearGradient(b.x - b.w / 2, b.y, b.x + b.w / 2, b.y + b.len * b.dir);
        const colInner = `hsla(${b.hue}, 95%, 60%, ${0.5 * b.intensity * b.life})`;
        const colMid = `hsla(${b.hue}, 90%, 50%, ${0.2 * b.intensity * b.life})`;
        gx.addColorStop(0, 'rgba(0,0,0,0)');
        gx.addColorStop(0.3, colInner);
        gx.addColorStop(0.6, colMid);
        gx.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gx;
        ctx.beginPath();
        // draw a long vertical rounded rectangle as beam
        const bx = b.x - b.w / 2;
        const by = b.y;
        const bw = b.w;
        const bh = b.len * b.dir * (b.dir > 0 ? 1 : -1);
        ctx.save();
        ctx.translate(0, 0);
        ctx.fillRect(bx, by, bw, bh);
        ctx.restore();

        // soft core highlight
        const core = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.len * b.dir);
        core.addColorStop(0, `rgba(255,255,230,${0.45 * b.intensity * b.life})`);
        core.addColorStop(0.5, `rgba(255,200,120,${0.12 * b.intensity * b.life})`);
        core.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = core;
        ctx.fillRect(b.x - b.w * 0.14, b.y, b.w * 0.28, b.len * b.dir);

        // remove when faded or offscreen
        if (b.life <= 0.02 || b.y < -b.len * 2 || b.y > H + b.len * 2) {
          beams.splice(i, 1);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    }

    const raf = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      running = false;
      clearInterval(spawnInterval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, [maxBeams]);

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
