import { useEffect, useState } from 'react';
import { LAUNCHES, type LaunchEvent } from '@/lib/mockData';

interface LaunchPanelProps {
  onOpenModal: (key: string) => void;
}

export default function LaunchPanel({ onOpenModal }: LaunchPanelProps) {
  const [launches, setLaunches] = useState<LaunchEvent[]>(LAUNCHES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://fdo.rocketlaunch.live/json/launches/next/5');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data?.result) return;
        const mapped: LaunchEvent[] = data.result.map((l: any) => {
          const winOpen = l.win_open ? new Date(l.win_open) : null;
          const now = new Date();
          let dateStr = 'TBD';
          let timeStr = 'TBD';
          if (winOpen) {
            const diff = (winOpen.getTime() - now.getTime()) / 86400000;
            if (diff < 0.5 && diff > -0.5) dateStr = 'Today';
            else if (diff < 1.5 && diff > 0) dateStr = 'Tomorrow';
            else dateStr = winOpen.toLocaleDateString('en', { month: 'short', day: '2-digit' });
            timeStr = String(winOpen.getUTCHours()).padStart(2, '0') + ':' + String(winOpen.getUTCMinutes()).padStart(2, '0') + ' UTC';
          }
          const status: 'go' | 'tbd' | 'hold' = l.launch_description?.includes('TBD') ? 'tbd' : 'go';
          const url = l.vidURLs?.[0]?.url || l.media?.find?.((m: any) => m.youtube_id)?.youtube_id
            ? `https://youtube.com/watch?v=${l.media.find((m: any) => m.youtube_id).youtube_id}`
            : undefined;
          return {
            name: l.name || 'Unknown',
            vehicle: `${l.vehicle?.name || 'Vehicle'} · ${l.pad?.name || 'Pad'} · ${l.pad?.location?.name || ''}`,
            pad: l.pad?.name || '',
            site: l.pad?.location?.name || '',
            date: dateStr,
            time: timeStr,
            status,
            modalKey: url ? '' : 'live-coverage',
            url,
          };
        });
        if (!cancelled && mapped.length > 0) setLaunches(mapped);
      } catch {
        // Keep mock data on error
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleClick = (l: LaunchEvent) => {
    if (l.url) {
      window.open(l.url, '_blank', 'noopener');
    } else {
      onOpenModal(l.modalKey || 'live-coverage');
    }
  };

  return (
    <div className="bg-bg2 shrink-0">
      <div className="flex items-center justify-between px-3.5 h-[38px] border-b border-border">
        <span className="font-outfit font-medium text-[9px] tracking-[0.14em] uppercase text-ink-sub">
          Upcoming Launches
        </span>
        <span className="font-mono-dm text-[9px] text-ink-muted">{launches.length}</span>
      </div>

      {launches.map((l, i) => (
        <div
          key={i}
          className="grid grid-cols-[2px_1fr_auto] gap-x-3 items-start py-2.5 px-3.5 border-b border-border cursor-pointer transition-colors hover:bg-surface last:border-b-0"
          onClick={() => handleClick(l)}
        >
          <div className={`rounded-sm self-stretch min-h-[32px] ${
            l.status === 'go' ? 'bg-accent' : l.status === 'hold' ? 'bg-ink-muted opacity-40' : 'bg-ink-muted'
          }`} />
          <div>
            <div className="font-outfit font-medium text-[11px] text-ink mb-px">{l.name}</div>
            <div className="font-mono-dm text-[9px] text-ink-sub mb-1">{l.vehicle}</div>
            <span className={`inline-block px-1.5 py-px rounded-sm font-outfit font-medium text-[8px] tracking-widest uppercase border
              ${l.status === 'go' ? 'border-accent text-accent' : 'border-ink-muted text-ink-muted'}
              ${l.status === 'hold' ? 'opacity-50' : ''}`}>
              {l.status.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div className="font-mono-dm text-[10px] text-ink">{l.date}</div>
            <div className="font-mono-dm text-[9px] text-ink-sub mt-px">{l.time}</div>
          </div>
        </div>
      ))}

      <button
        className="flex items-center justify-center gap-1.5 mx-3.5 my-2 py-1.5 border border-border rounded-sm font-outfit text-[9px] text-ink-muted cursor-pointer tracking-wide uppercase transition-colors hover:border-accent hover:text-accent bg-transparent w-[calc(100%-28px)]"
        onClick={() => onOpenModal('track-launch')}
      >
        + Track a launch
      </button>
    </div>
  );
}
