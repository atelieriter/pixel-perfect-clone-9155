import { LAUNCHES } from '@/lib/mockData';

interface LaunchPanelProps {
  onOpenModal: (key: string) => void;
}

export default function LaunchPanel({ onOpenModal }: LaunchPanelProps) {
  return (
    <div className="bg-bg2 shrink-0">
      <div className="flex items-center justify-between px-3.5 h-[38px] border-b border-border">
        <span className="font-outfit font-medium text-[9px] tracking-[0.14em] uppercase text-ink-sub">
          Upcoming Launches
        </span>
        <span className="font-mono-dm text-[9px] text-ink-muted">{LAUNCHES.length}</span>
      </div>

      {LAUNCHES.map((l, i) => (
        <div
          key={i}
          className="grid grid-cols-[2px_1fr_auto] gap-x-3 items-start py-2.5 px-3.5 border-b border-border cursor-pointer transition-colors hover:bg-surface last:border-b-0"
          onClick={() => onOpenModal(l.modalKey)}
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
