import { useEffect, useRef, useState, useCallback } from 'react';
import { LAND_POLYGONS, LAUNCH_SITES, makeSats } from '@/lib/mockData';

interface OrbitalMapProps {
  filters: Record<string, boolean>;
  onOpenModal: (key: string) => void;
}

const SL = makeSats(60, 53);
const OW = makeSats(28, 87);
const GEO = makeSats(18, 0.3);

function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function OrbitalMap({ filters, onOpenModal }: OrbitalMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: -1, y: -1 });
  const issRef = useRef({ lat: 48.5, lon: 2.3 });
  const [pinned, setPinned] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const ll2xy = useCallback((lon: number, lat: number, W: number, H: number): [number, number] => {
    return [(lon + 180) / 360 * W, (90 - lat) / 180 * H];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const F = filters;

    function draw() {
      const wrap = wrapRef.current;
      if (!wrap || !ctx) return;
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      if (W < 2 || H < 2) { raf = requestAnimationFrame(draw); return; }
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }

      const frame = frameRef.current++;
      const bg = getCssVar('--bg');
      const border = getCssVar('--border');
      const accent = getCssVar('--accent');
      const surf2 = getCssVar('--surface2');
      const iLat = issRef.current.lat;
      const iLon = issRef.current.lon;

      // Simulate ISS movement
      issRef.current.lon = ((iLon + 0.05) % 360 + 360) % 360 - 180;
      issRef.current.lat = 51.6 * Math.sin((issRef.current.lon + 180) / 360 * Math.PI * 2);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `hsl(${bg})`;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = `hsl(${border})`;
      ctx.lineWidth = 0.35;
      ctx.globalAlpha = 0.45;
      for (let lo = -180; lo <= 180; lo += 30) {
        const [x] = ll2xy(lo, 0, W, H);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let la = -60; la <= 60; la += 30) {
        const [, y] = ll2xy(0, la, W, H);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Equator
      const [, ey] = ll2xy(0, 0, W, H);
      ctx.strokeStyle = `hsl(${border})`;
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.moveTo(0, ey); ctx.lineTo(W, ey); ctx.stroke();
      ctx.globalAlpha = 1;

      // Land
      ctx.fillStyle = `hsl(${surf2})`;
      ctx.strokeStyle = `hsl(${border})`;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.85;
      LAND_POLYGONS.forEach(pts => {
        ctx.beginPath();
        pts.forEach(([lo, la], i) => {
          const [x, y] = ll2xy(lo, la, W, H);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // GEO Belt
      if (F.geo) {
        ctx.setLineDash([3, 6]);
        ctx.strokeStyle = `hsl(${accent})`;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.moveTo(0, ey); ctx.lineTo(W, ey); ctx.stroke();
        ctx.setLineDash([]);
        GEO.forEach(s => {
          const lo = ((s.lon0 + frame * s.sp * 0.1) % 360 + 360) % 360 - 180;
          const [x, y] = ll2xy(lo, s.lat, W, H);
          ctx.fillStyle = `hsl(${accent})`;
          ctx.globalAlpha = 0.18;
          ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // OneWeb
      if (F.oneweb) {
        OW.forEach(s => {
          const lo = ((s.lon0 + frame * s.sp) % 360 + 360) % 360 - 180;
          const [x1, y1] = ll2xy(lo - 7, s.lat - 1.75, W, H);
          const [x2, y2] = ll2xy(lo + 7, s.lat + 1.75, W, H);
          const [xc, yc] = ll2xy(lo, s.lat, W, H);
          ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 0.6; ctx.globalAlpha = 0.2;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.fillStyle = `hsl(${accent})`; ctx.globalAlpha = 0.32;
          ctx.beginPath(); ctx.arc(xc, yc, 0.9, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Starlink
      if (F.starlink) {
        SL.forEach(s => {
          const lo = ((s.lon0 + frame * s.sp) % 360 + 360) % 360 - 180;
          const [x1, y1] = ll2xy(lo - 5, s.lat - 1, W, H);
          const [x2, y2] = ll2xy(lo + 5, s.lat + 1, W, H);
          const [xc, yc] = ll2xy(lo, s.lat, W, H);
          ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.28;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.fillStyle = `hsl(${accent})`; ctx.globalAlpha = 0.42;
          ctx.beginPath(); ctx.arc(xc, yc, 0.8, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Launch sites
      if (F.sites) {
        LAUNCH_SITES.forEach(([lo, la]) => {
          const [x, y] = ll2xy(lo, la, W, H);
          ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = `hsl(${accent})`; ctx.globalAlpha = 0.65;
          ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // ISS
      if (F.iss) {
        const [ix, iy] = ll2xy(issRef.current.lon, issRef.current.lat, W, H);
        // Orbital track
        ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.1; ctx.setLineDash([4, 8]);
        ctx.beginPath();
        for (let lo = -180; lo <= 181; lo += 2) {
          const la = 51.6 * Math.sin((lo + 180) / 360 * Math.PI * 2 + frame * 0.008);
          const [x, y] = ll2xy(lo, la, W, H);
          lo === -180 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;

        // Pulse ring
        const pr = 9 + 4 * Math.sin(frame * 0.07);
        ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 0.7;
        ctx.globalAlpha = 0.13 + 0.1 * Math.sin(frame * 0.07);
        ctx.beginPath(); ctx.arc(ix, iy, pr, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;

        // Hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI / 3 * i - Math.PI / 6;
          ctx.lineTo(ix + 5 * Math.cos(a), iy + 5 * Math.sin(a));
        }
        ctx.closePath();
        ctx.fillStyle = `hsl(${accent})`; ctx.globalAlpha = 0.12; ctx.fill();
        ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 1.2; ctx.globalAlpha = 1; ctx.stroke();

        // Spokes
        const spokes: [number, number][] = [[ix, iy - 5], [ix - 4.33, iy + 2.5], [ix + 4.33, iy + 2.5]];
        spokes.forEach(([px, py]) => {
          ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 0.7; ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ix, iy); ctx.stroke();
        });
        ctx.globalAlpha = 1;

        // Label
        ctx.font = "9px 'DM Mono', monospace";
        ctx.fillStyle = `hsl(${accent})`; ctx.globalAlpha = 0.85;
        ctx.fillText('ISS', ix + 8, iy + 3);
        ctx.globalAlpha = 1;
      }

      // Crosshair
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      if (mx > 0 && my > 0) {
        ctx.strokeStyle = `hsl(${accent})`; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.35;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(W, my); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [filters, ll2xy]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // Check proximity to ISS for card show
    if (!pinned) {
      const canvas = canvasRef.current!;
      const [ix, iy] = ll2xy(issRef.current.lon, issRef.current.lat, canvas.width, canvas.height);
      const dist = Math.hypot(mouseRef.current.x - ix, mouseRef.current.y - iy);
      setShowCard(dist < 40);
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1, y: -1 };
    if (!pinned) setShowCard(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg2 overflow-hidden min-h-0">
      {/* Map header */}
      <div className="flex items-center justify-between px-3.5 h-[38px] border-b border-border shrink-0 gap-2.5">
        <span className="font-outfit font-medium text-[9px] tracking-[0.14em] uppercase text-ink-sub">
          Orbital Map
        </span>
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
          <span className="font-outfit font-light text-[8px] text-ink-muted uppercase tracking-widest whitespace-nowrap">
            Show
          </span>
          {(['iss', 'starlink', 'oneweb', 'geo', 'sites'] as const).map(f => (
            <FilterButton key={f} label={f.toUpperCase()} active={!!filters[f]} />
          ))}
        </div>
        <span className="font-mono-dm text-[9px] text-ink-muted whitespace-nowrap">LEO · MEO · GEO</span>
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="flex-1 relative overflow-hidden min-h-0">
        <canvas
          ref={canvasRef}
          className="block w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* ISS Card */}
        <div
          className={`absolute bottom-3.5 left-3.5 bg-bg2 border rounded-sm p-2.5 min-w-[188px] z-10 transition-all duration-200
            ${showCard || pinned ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'}
            ${pinned ? 'border-accent' : 'border-border'}`}
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="font-outfit font-medium text-[10px] text-accent">ISS — NORAD 25544</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono-dm text-[8px] text-ink-muted border border-border px-1 py-px rounded-sm">LEO</span>
              <button
                onClick={() => { setPinned(!pinned); setShowCard(true); }}
                className={`border rounded-sm w-[18px] h-[18px] cursor-pointer text-[9px] flex items-center justify-center transition-colors shrink-0
                  ${pinned ? 'border-accent text-accent bg-accent-dim' : 'border-border text-ink-muted hover:border-accent hover:text-accent'}`}
              >
                ⊙
              </button>
            </div>
          </div>
          <IssRow label="Latitude" value={issRef.current.lat.toFixed(1) + '°'} />
          <IssRow label="Longitude" value={issRef.current.lon.toFixed(1) + '°'} />
          <IssRow label="Altitude" value="408.2 km" />
          <IssRow label="Velocity" value="27 580 km/h" />
          <IssRow label="Inclination" value="51.6°" />
          <button
            className="flex items-center justify-center gap-1.5 mt-2.5 py-1.5 px-2 w-full bg-transparent border border-border rounded-sm font-outfit text-[9px] text-ink-sub cursor-pointer tracking-wide transition-colors hover:border-accent hover:text-accent"
            onClick={() => onOpenModal('iss-events')}
          >
            <span className="w-1 h-1 rounded-full bg-accent shrink-0 animate-blink" />
            Related events
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label, active }: { label: string; active: boolean }) {
  return (
    <button className={`bg-transparent border font-mono-dm text-[8px] px-1.5 py-0.5 rounded-sm cursor-pointer tracking-wide uppercase transition-colors whitespace-nowrap shrink-0
      ${active ? 'border-accent text-accent bg-accent-dim' : 'border-border text-ink-sub hover:border-ink-sub hover:text-ink'}`}>
      {label}
    </button>
  );
}

function IssRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 mb-0.5">
      <span className="font-mono-dm text-[9px] text-ink-muted">{label}</span>
      <span className="font-mono-dm text-[9px] text-ink">{value}</span>
    </div>
  );
}
