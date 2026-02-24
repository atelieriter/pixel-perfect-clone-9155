import { useEffect, useState } from 'react';

interface VigilHeaderProps {
  onSearch?: () => void;
}

export default function VigilHeader({ onSearch }: VigilHeaderProps) {
  const [utc, setUtc] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setUtc(
        String(d.getUTCHours()).padStart(2, '0') + ':' +
        String(d.getUTCMinutes()).padStart(2, '0') + ':' +
        String(d.getUTCSeconds()).padStart(2, '0') + ' UTC'
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center h-[50px] px-4 border-b border-border bg-bg2 sticky top-0 z-50 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0">
          <line x1="10" y1="1.5" x2="10" y2="10" stroke="hsl(var(--accent))" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="3.2" y1="14.25" x2="10" y2="10" stroke="hsl(var(--accent))" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="16.8" y1="14.25" x2="10" y2="10" stroke="hsl(var(--accent))" strokeWidth="1.3" strokeLinecap="round"/>
          <polygon points="10,1.5 16.8,5.75 16.8,14.25 10,18.5 3.2,14.25 3.2,5.75" fill="none" stroke="hsl(var(--ink))" strokeWidth="1.4"/>
        </svg>
        <span className="font-garamond italic text-[19px] text-accent leading-none">Vigil</span>
      </div>

      {/* Separator */}
      <div className="w-px h-7 bg-border mx-3.5 shrink-0 hidden md:block" />

      {/* Tagline */}
      <span className="font-outfit font-light text-[10px] text-ink-muted tracking-wide pr-4 border-r border-border shrink-0 whitespace-nowrap hidden md:block">
        The real-time pulse of orbital space
      </span>

      {/* Search */}
      <div className="flex-1 px-4 border-r border-border flex items-center min-w-0">
        <div
          className="flex items-center gap-2 bg-surface border border-border rounded-sm px-2.5 py-1 w-full max-w-[320px] transition-colors focus-within:border-accent cursor-pointer"
          onClick={onSearch}
        >
          <span className="text-xs text-ink-muted shrink-0">⌕</span>
          <span className="font-outfit font-light text-[11px] text-ink-muted">
            Search satellite, constellation, NORAD ID…
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5 shrink-0 pl-3.5">
        {/* LIVE badge */}
        <div className="flex items-center gap-1 bg-accent-dim border border-accent rounded-sm px-2 py-0.5">
          <div className="w-[5px] h-[5px] rounded-full bg-accent animate-blink" />
          <span className="font-mono-dm text-[9px] text-accent tracking-widest">LIVE</span>
        </div>

        {/* UTC clock */}
        <span className="font-mono-dm text-[10px] text-ink-sub hidden sm:block">{utc}</span>

        {/* Lang buttons */}
        <div className="flex gap-1">
          <button className="bg-transparent border border-accent text-accent font-mono-dm text-[9px] px-2 py-0.5 rounded-sm tracking-wide transition-colors">
            EN
          </button>
          <button className="bg-transparent border border-border text-ink-sub font-mono-dm text-[9px] px-2 py-0.5 rounded-sm tracking-wide transition-colors hover:border-accent hover:text-accent hidden sm:block">
            FR
          </button>
        </div>
      </div>
    </header>
  );
}
