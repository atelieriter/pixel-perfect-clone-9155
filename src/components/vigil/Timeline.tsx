import { useEffect, useRef, useState, useCallback } from 'react';
import { TL_EVENTS } from '@/lib/mockData';

interface TimelineProps {
  onOpenModal: (key: string) => void;
}

const ZOOM_LEVELS = [6, 12, 24, 48, 72, 96];
const TOTAL_RANGE = 240;

function fmtH(d: Date) {
  return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0') + 'z';
}

const EVT_COLORS: Record<string, string> = {
  launch: 'hsl(var(--launch))',
  conjunction: 'hsl(var(--conjunction))',
  reentry: 'hsl(var(--reentry))',
};

export default function Timeline({ onOpenModal }: TimelineProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [zoomIdx, setZoomIdx] = useState(2);
  const [offset, setOffset] = useState(0);
  const [rangeLabel, setRangeLabel] = useState('');
  const nowRef = useRef(new Date());
  const dragRef = useRef<{ startX: number; startOff: number; dragging: boolean }>({ startX: 0, startOff: 0, dragging: false });

  const pxPerH = useCallback(() => {
    const vp = viewportRef.current;
    return (vp?.clientWidth || 800) / ZOOM_LEVELS[zoomIdx];
  }, [zoomIdx]);

  const build = useCallback(() => {
    const vp = viewportRef.current;
    const inner = innerRef.current;
    if (!vp || !inner) return;

    const vpW = vp.clientWidth || 800;
    const pph = pxPerH();
    const totalW = TOTAL_RANGE * pph;
    const nowPx = totalW / 2;

    inner.style.width = totalW + 'px';
    const tx = vpW / 2 - nowPx + offset * pph;
    inner.style.transform = `translateX(${tx}px)`;

    // Clear dynamic
    inner.querySelectorAll('.tl-dyn').forEach(e => e.remove());

    // Ticks
    const visH = ZOOM_LEVELS[zoomIdx];
    const tickInt = visH <= 6 ? 1 : visH <= 24 ? 6 : visH <= 48 ? 12 : 24;

    for (let dh = -TOTAL_RANGE / 2; dh <= TOTAL_RANGE / 2; dh += tickInt) {
      const px = nowPx + dh * pph;
      if (px < 0 || px > totalW) continue;
      const isMajor = dh % (tickInt * 2) === 0;

      const tick = document.createElement('div');
      tick.className = 'tl-dyn absolute bottom-[18px]';
      tick.style.cssText = `left:${px}px;width:1px;height:${isMajor ? 12 : 6}px;background:hsl(var(--border))`;
      inner.appendChild(tick);

      if (isMajor) {
        const lbl = document.createElement('div');
        lbl.className = 'tl-dyn absolute bottom-[2px] font-mono-dm whitespace-nowrap';
        lbl.style.cssText = `left:${px}px;font-size:7px;color:hsl(var(--ink-muted));transform:translateX(-50%)`;
        lbl.textContent = fmtH(new Date(nowRef.current.getTime() + dh * 3600000));
        inner.appendChild(lbl);
      }
    }

    // NOW marker
    const now = document.createElement('div');
    now.className = 'tl-dyn absolute';
    now.style.cssText = `left:${nowPx}px;bottom:14px;width:2px;height:26px;background:hsl(var(--accent));border-radius:1px;transform:translateX(-1px)`;
    inner.appendChild(now);

    const nowLbl = document.createElement('div');
    nowLbl.className = 'tl-dyn absolute font-mono-dm whitespace-nowrap';
    nowLbl.style.cssText = `left:${nowPx}px;bottom:44px;font-size:7px;color:hsl(var(--accent));transform:translateX(-50%);letter-spacing:0.08em`;
    nowLbl.textContent = 'NOW';
    inner.appendChild(nowLbl);

    // Events
    TL_EVENTS.forEach(ev => {
      const px = nowPx + ev.h * pph;
      if (px < 0 || px > totalW) return;
      const color = EVT_COLORS[ev.type] || 'hsl(var(--ink-muted))';

      const wrap = document.createElement('div');
      wrap.className = 'tl-dyn absolute top-0 bottom-0 w-7 cursor-pointer group';
      wrap.style.cssText = `left:${px - 14}px;color:${color}`;
      wrap.onclick = (e) => { e.stopPropagation(); onOpenModal(ev.key); };

      // Dot
      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute;left:9px;bottom:14px;width:9px;height:9px;border-radius:50%;border:1.5px solid ${color};background:hsl(var(--bg2));transition:all 0.15s`;
      wrap.appendChild(dot);

      // Label
      const lbl = document.createElement('div');
      lbl.style.cssText = `position:absolute;left:0;right:0;bottom:28px;font-family:'Outfit',sans-serif;font-size:8px;text-align:center;color:${color};opacity:0;transition:opacity 0.15s;pointer-events:none;white-space:nowrap`;
      lbl.textContent = ev.label;
      wrap.appendChild(lbl);

      // Tooltip
      const tip = document.createElement('div');
      tip.style.cssText = `position:absolute;left:50%;bottom:42px;transform:translateX(-50%);background:hsl(var(--bg2));border:1px solid ${color};border-radius:2px;padding:5px 9px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.12s;z-index:20`;
      tip.innerHTML = `<div style="font-family:'Outfit',sans-serif;font-weight:500;font-size:9px;color:hsl(var(--ink));margin-bottom:2px">${ev.label}</div><div style="font-family:'DM Mono',monospace;font-size:8px;color:hsl(var(--ink-muted))">${fmtH(new Date(nowRef.current.getTime() + ev.h * 3600000))} UTC · ${ev.sub}</div>`;
      wrap.appendChild(tip);

      // Hover effects
      wrap.onmouseenter = () => { dot.style.background = color; dot.style.transform = 'scale(1.3)'; dot.style.boxShadow = `0 0 8px ${color}`; lbl.style.opacity = '1'; tip.style.opacity = '1'; };
      wrap.onmouseleave = () => { dot.style.background = 'hsl(var(--bg2))'; dot.style.transform = 'scale(1)'; dot.style.boxShadow = 'none'; lbl.style.opacity = '0'; tip.style.opacity = '0'; };

      inner.appendChild(wrap);
    });

    // Range label
    const halfH = ZOOM_LEVELS[zoomIdx] / 2;
    const rS = new Date(nowRef.current.getTime() + (offset - halfH) * 3600000);
    const rE = new Date(nowRef.current.getTime() + (offset + halfH) * 3600000);
    setRangeLabel(fmtH(rS) + ' — ' + fmtH(rE));
  }, [zoomIdx, offset, pxPerH, onOpenModal]);

  useEffect(() => { build(); }, [build]);
  useEffect(() => {
    const handler = () => build();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [build]);

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.tl-dyn[style*="cursor"]')) return;
    dragRef.current = { startX: e.clientX, startOff: offset, dragging: true };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    setOffset(dragRef.current.startOff - dx / pxPerH());
  }, [pxPerH]);
  const onMouseUp = useCallback(() => { dragRef.current.dragging = false; }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  // Wheel zoom
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    setZoomIdx(prev => Math.max(0, Math.min(ZOOM_LEVELS.length - 1, prev + delta)));
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const zh = ZOOM_LEVELS[zoomIdx];

  return (
    <div className="h-24 shrink-0 bg-bg2 relative overflow-hidden border-t border-border select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 pt-1.5 h-[30px]">
        <span className="font-outfit font-medium text-[8px] uppercase tracking-[0.14em] text-ink-muted">24h Timeline</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setOffset(o => o - 6)} className="border border-border rounded-sm w-[18px] h-[18px] cursor-pointer text-ink-muted text-[10px] flex items-center justify-center transition-colors hover:border-accent hover:text-accent bg-transparent">‹</button>
          <button onClick={() => setOffset(o => o + 6)} className="border border-border rounded-sm w-[18px] h-[18px] cursor-pointer text-ink-muted text-[10px] flex items-center justify-center transition-colors hover:border-accent hover:text-accent bg-transparent">›</button>
          <span className="font-mono-dm text-[8px] text-ink-muted px-2">{rangeLabel}</span>
          <button onClick={() => setZoomIdx(z => Math.min(ZOOM_LEVELS.length - 1, z + 1))} className="border border-border rounded-sm w-[18px] h-[18px] cursor-pointer text-ink-muted text-[10px] flex items-center justify-center transition-colors hover:border-accent hover:text-accent bg-transparent">−</button>
          <span className="font-mono-dm text-[8px] text-ink-muted border border-border rounded-sm h-[18px] flex items-center px-1.5">{zh < 24 ? zh + 'h' : (zh / 24) + 'd'}</span>
          <button onClick={() => setZoomIdx(z => Math.max(0, z - 1))} className="border border-border rounded-sm w-[18px] h-[18px] cursor-pointer text-ink-muted text-[10px] flex items-center justify-center transition-colors hover:border-accent hover:text-accent bg-transparent">+</button>
          <button onClick={() => setOffset(0)} className="border border-border rounded-sm h-[18px] cursor-pointer text-ink-muted text-[8px] flex items-center px-1.5 transition-colors hover:border-accent hover:text-accent bg-transparent font-mono-dm">NOW</button>
        </div>
      </div>

      {/* Viewport */}
      <div
        ref={viewportRef}
        className="relative h-[66px] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onDoubleClick={() => setOffset(0)}
      >
        <div ref={innerRef} className="absolute top-0 left-0 h-full will-change-transform">
          {/* Rail */}
          <div className="absolute left-0 right-0 bottom-[18px] h-px bg-border" />
        </div>
        {/* Edge fades */}
        <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none z-[4]" style={{ background: 'linear-gradient(to right, hsl(var(--bg2)) 20%, transparent)' }} />
        <div className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none z-[4]" style={{ background: 'linear-gradient(to left, hsl(var(--bg2)) 20%, transparent)' }} />
      </div>
    </div>
  );
}
