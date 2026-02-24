interface OrbitalOverviewPanelProps {
  onOpenModal: (key: string) => void;
}

export default function OrbitalOverviewPanel({ onOpenModal }: OrbitalOverviewPanelProps) {
  const counts = [
    { key: 'active-sats', num: '9,842', label: 'Active satellites' },
    { key: 'tracked-objects', num: '45,714', label: 'Tracked objects' },
    { key: 'debris', num: '35,120', sub: '+', label: 'Debris pieces' },
    { key: 'flagged', num: '18', label: 'Flagged today' },
  ];

  const bars = [
    { key: 'starlink-detail', label: 'Starlink', count: '5,800', pct: 59 },
    { key: 'oneweb-detail', label: 'OneWeb', count: '634', pct: 6 },
    { key: 'gnss-detail', label: 'GPS/GNSS', count: '128', pct: 1.3 },
    { key: 'other-detail', label: 'Other', count: '3,280', pct: 33 },
  ];

  return (
    <div className="bg-bg2 shrink-0">
      <div className="flex items-center justify-between px-3.5 h-[38px] border-b border-border">
        <span className="font-outfit font-medium text-[9px] tracking-[0.14em] uppercase text-ink-sub">
          Orbital Overview
        </span>
        <span className="font-mono-dm text-[9px] text-ink-muted">LEO-GEO</span>
      </div>

      <div className="px-3.5 py-3 flex flex-col gap-3">
        {/* 2x2 counts */}
        <div className="grid grid-cols-2 gap-1.5">
          {counts.map(c => (
            <div
              key={c.key}
              className="bg-surface border border-border rounded-sm px-2.5 py-2 cursor-pointer transition-colors hover:border-accent"
              onClick={() => onOpenModal(c.key)}
            >
              <div className="font-mono-dm text-[17px] text-ink leading-none mb-0.5">
                {c.num}{c.sub && <span className="text-[11px] text-ink-sub">{c.sub}</span>}
              </div>
              <div className="font-outfit font-light text-[8.5px] text-ink-muted uppercase tracking-wide">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Today's Activity */}
        <div
          className="border border-border border-l-2 border-l-accent bg-accent-dim rounded-sm px-2.5 py-2 cursor-pointer transition-opacity hover:opacity-75"
          onClick={() => onOpenModal('today-activity')}
        >
          <div className="font-outfit font-medium text-[9px] uppercase tracking-[0.12em] text-accent mb-1.5">Today's Activity</div>
          {[
            ['Conjunctions (Pc > 1e-4)', '23'],
            ['Maneuvers detected', '8'],
            ['Reentries', '2'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-baseline mb-0.5 last:mb-0">
              <span className="font-outfit font-light text-[10px] text-ink-sub">{label}</span>
              <span className="font-mono-dm text-[10px] text-ink">{val}</span>
            </div>
          ))}
        </div>

        {/* By constellation bars */}
        <div className="flex flex-col gap-1.5">
          <span className="font-outfit font-medium text-[9px] uppercase tracking-[0.12em] text-ink-sub">By Constellation</span>
          {bars.map(b => (
            <div
              key={b.key}
              className="flex items-center gap-2 cursor-pointer py-0.5 transition-opacity hover:opacity-70"
              onClick={() => onOpenModal(b.key)}
            >
              <span className="font-outfit font-light text-[10px] text-ink-sub w-[66px] shrink-0">{b.label}</span>
              <div className="flex-1 h-[3px] bg-surface2 rounded-sm overflow-hidden">
                <div className="h-full bg-accent rounded-sm" style={{ width: `${b.pct}%` }} />
              </div>
              <span className="font-mono-dm text-[9px] text-ink-muted w-10 text-right shrink-0">{b.count}</span>
            </div>
          ))}
        </div>

        {/* Source note */}
        <p className="font-outfit font-light text-[9px] text-ink-muted leading-relaxed italic pb-0.5">
          Data sourced from Space-Track.org · Updated every 4h
        </p>
      </div>
    </div>
  );
}
