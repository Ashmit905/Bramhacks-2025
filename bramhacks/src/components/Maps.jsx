import React, { useRef, useEffect, useState } from 'react';

// Smoothed line chart from public/data_smooth.csv (header `value` then values)
export default function Maps() {
  const canvasRef = useRef(null);
  const [values, setValues] = useState(null); // number[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hoverRef = useRef(null); // {x, y, index, value}

  // Fetch normalized data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/data_smooth.csv', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const lines = text.split(/\r?\n/);
        const arr = [];
        for (let i = 0; i < lines.length; i++) {
          const s = lines[i].trim();
          if (!s) continue;
          if (i === 0 && /[a-zA-Z]/.test(s)) continue; // skip header
          const v = parseFloat(s.replace(/[^0-9eE+\-.]/g, ''));
          if (Number.isFinite(v)) arr.push(v);
        }
        if (!cancelled) {
          setValues(arr);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || String(e));
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Drawing the chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    draw();
    return () => {
      window.removeEventListener('resize', onResize);
    };

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth || 800;
      const cssH = canvas.clientHeight || 420;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background
      ctx.clearRect(0, 0, cssW, cssH);
      const bg = ctx.createLinearGradient(0, 0, 0, cssH);
      bg.addColorStop(0, 'rgba(8,12,20,0.9)');
      bg.addColorStop(1, 'rgba(6,8,14,1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cssW, cssH);

      // States
      if (loading) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
        ctx.fillText('Loading normalized data…', 16, 24);
        return;
      }
      if (error) {
        ctx.fillStyle = 'rgba(255,120,120,0.9)';
        ctx.font = '14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
        ctx.fillText(`Error: ${error}`, 16, 24);
        return;
      }
      if (!values || values.length === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
        ctx.fillText('No data', 16, 24);
        return;
      }

      // Chart area & scales
      const margin = { top: 24, right: 16, bottom: 36, left: 48 };
      const W = cssW - margin.left - margin.right;
      const H = cssH - margin.top - margin.bottom;
      const originX = margin.left;
      const originY = margin.top;

      // Compute baseline & peak using robust percentiles to avoid noise at absolute min near zero.
      let minRaw = Infinity, maxRaw = -Infinity;
      for (const v of values) {
        if (v < minRaw) minRaw = v;
        if (v > maxRaw) maxRaw = v;
      }
      const sorted = [...values].sort((a,b)=>a-b);
      const pct = (p) => {
        if (sorted.length === 0) return 0;
        const idx = Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))));
        return sorted[idx];
      };
      const baseline = pct(0.05); // 5th percentile as "bottom" level
      const peak = pct(0.95);     // 95th percentile as representative peak
      const glareRatio = peak > 0 ? (peak / Math.max(1e-9, baseline)) : 0; // bottom:peak ~ 1:glareRatio
      const thresholdValue = baseline * 10; // 1:10 glare threshold

      // y domain includes threshold line & extremes
      let minY = Math.min(baseline, minRaw);
      let maxY = Math.max(peak, maxRaw, thresholdValue);
      if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
        minY = 0; maxY = 1;
      }
      if (minY === maxY) { minY -= 1; maxY += 1; }
      const pad = (maxY - minY) * 0.08;
      minY -= pad; maxY += pad;

      const xOf = (i) => originX + (i / Math.max(1, values.length - 1)) * W;
      const yOf = (v) => originY + (1 - (v - minY) / (maxY - minY)) * H;

      // Axes
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      // X axis
      ctx.beginPath();
      ctx.moveTo(originX, originY + H);
      ctx.lineTo(originX + W, originY + H);
      ctx.stroke();
      // Y axis
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, originY + H);
      ctx.stroke();

      // Y ticks using nice numbers
      ctx.fillStyle = 'rgba(200,210,230,0.85)';
      ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
      const niceTicks = (min, max, maxTicks = 6) => {
        const span = Math.max(1e-9, max - min);
        const step0 = span / Math.max(1, maxTicks);
        const mag = Math.pow(10, Math.floor(Math.log10(step0)));
        const norm = step0 / mag;
        let step;
        if (norm <= 1) step = 1 * mag;
        else if (norm <= 2) step = 2 * mag;
        else if (norm <= 5) step = 5 * mag;
        else step = 10 * mag;
        const t0 = Math.ceil(min / step) * step;
        const ticks = [];
        for (let t = t0; t <= max + 1e-9; t += step) ticks.push(t);
        return ticks;
      };
      const ticks = niceTicks(minY, maxY, 6);
      for (const t of ticks) {
        const y = Math.round(yOf(t)) + 0.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        ctx.moveTo(originX, y);
        ctx.lineTo(originX + W, y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(180,190,210,0.9)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.abs(t) >= 1000 ? t.toFixed(0) : t.toFixed(2)}`.replace(/\.00$/, ''), originX - 8, y);
      }
      // Draw glare threshold line (1:10 baseline equivalent)
      if (thresholdValue < maxY) {
        const yT = Math.round(yOf(thresholdValue)) + 0.5;
        ctx.strokeStyle = 'rgba(255,100,100,0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6,4]);
        ctx.beginPath();
        ctx.moveTo(originX, yT);
        ctx.lineTo(originX + W, yT);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255,140,140,0.8)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.font = '11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
        ctx.fillText('Glare threshold (1:10)', originX + 8, yT - 4);
      }

  // Labels (moved title to HTML for professional layout)
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
  ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(200,210,230,0.9)';
      ctx.textAlign = 'center';
      ctx.fillText('Index', originX + W / 2, originY + H + 28);
      ctx.save();
      ctx.translate(16, originY + H / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
  ctx.fillText('Lux', 0, 0);
      ctx.restore();

      // Decimate to ~one point per pixel for performance
      const target = Math.max(50, Math.min(W, 1600));
      const stride = Math.ceil(values.length / target);

      // Area under the curve (soft glow)
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < values.length; i += stride) {
        const x = xOf(i);
        const y = yOf(values[i]);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      // close to baseline
      ctx.lineTo(originX + W, yOf(minY));
      ctx.lineTo(originX, yOf(minY));
      const areaGrad = ctx.createLinearGradient(0, originY, 0, originY + H);
      areaGrad.addColorStop(0, 'rgba(120,180,255,0.18)');
      areaGrad.addColorStop(1, 'rgba(120,180,255,0.00)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Line base
      ctx.strokeStyle = 'rgba(140,190,255,0.95)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let i = 0; i < values.length; i += stride) {
        const x = xOf(i);
        const y = yOf(values[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Overlay segments above threshold with warning color
      if (thresholdValue < maxY) {
        ctx.strokeStyle = 'rgba(255,120,120,0.9)';
        ctx.lineWidth = 2.3;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < values.length; i += stride) {
          if (values[i] > thresholdValue) {
            const x = xOf(i); const y = yOf(values[i]);
            if (!started) { ctx.moveTo(x, y); started = true; }
            else ctx.lineTo(x, y);
          } else if (started) {
            // break segment
            ctx.stroke();
            ctx.beginPath();
            started = false;
          }
        }
        if (started) ctx.stroke();
      }

      // Hover marker if any
      const hov = hoverRef.current;
      if (hov && hov.index != null) {
        const i = Math.max(0, Math.min(values.length - 1, hov.index));
        const x = xOf(i);
        const y = yOf(values[i]);
        // vertical line
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, originY);
        ctx.lineTo(x + 0.5, originY + H);
        ctx.stroke();
        // point
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // tooltip
  const label = `i: ${i}  lux: ${values[i].toFixed(2)}`;
        ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
        const tw = ctx.measureText(label).width + 12;
        const th = 20;
        let tx = Math.min(cssW - tw - 8, Math.max(8, x + 8));
        let ty = Math.max(8, y - th - 8);
        ctx.fillStyle = 'rgba(17,24,39,0.95)';
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tx, ty, tw, th, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(220,230,255,0.95)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, tx + 6, ty + th / 2);
      }
    }
  }, [values, loading, error]);

  // Mouse move to update hover
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onMove = (e) => {
      if (!values || values.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const cssW = canvas.clientWidth;
      const margin = { left: 48, right: 16 };
      const innerW = cssW - margin.left - margin.right;
      const rel = Math.max(0, Math.min(1, (x - margin.left) / innerW));
      const idx = Math.round(rel * (values.length - 1));
      hoverRef.current = { index: idx };
      // trigger redraw
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    };
    const onLeave = () => {
      hoverRef.current = null;
      const event = new Event('resize');
      window.dispatchEvent(event);
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [values]);

  // Derived stats (memoized trivially here) for header display
  let stats = null;
  if (values && values.length > 0) {
    const sorted = [...values].sort((a,b)=>a-b);
    const baseline = sorted[Math.round(0.05 * (sorted.length - 1))];
    const peak = sorted[Math.round(0.95 * (sorted.length - 1))];
    const ratio = peak / Math.max(1e-9, baseline);
    stats = { baseline, peak, ratio };
  }

  return (
    <section id="maps" className="py-16" aria-labelledby="maps-heading">
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <h2 id="maps-heading" className="text-2xl font-semibold text-white">Lux over time</h2>
            <p className="text-slate-300 text-sm">
              Smoothed (avg of 10). {stats && (
                <span className={stats.ratio > 10 ? 'text-red-300 font-medium' : 'text-emerald-300'}>
                  Observed bottom:peak ≈ 1:{stats.ratio.toFixed(1)} ({stats.ratio > 10 ? 'exceeds' : 'within'} threshold)
                </span>
              )}
            </p>
          </div>
          <div className="text-right text-slate-400 text-sm hidden md:block" aria-live="polite" aria-atomic="true">
            {stats && (
              <div className="space-y-0.5">
                <div>Baseline (5th%): {stats.baseline.toFixed(2)} lux</div>
                <div>Peak (95th%): {stats.peak.toFixed(2)} lux</div>
                <div>Ratio: 1:{stats.ratio.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(2,6,23,0.6)] border border-white/5">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '420px', borderRadius: '12px', display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}
