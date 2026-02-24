interface SolarPanelProps {
  onOpenModal: (key: string) => void;
}

export default function SolarPanel({ onOpenModal }: SolarPanelProps) {
  return (
    <div className="bg-bg2 shrink-0">
      <div className="flex items-center justify-between px-3.5 h-[38px] border-b border-border">
        <span className="font-outfit font-medium text-[9px] tracking-[0.14em] uppercase text-ink-sub">
          Solar Activity
        </span>
        <span className="font-mono-dm text-[9px] text-ink-muted">4 metrics</span>
      </div>

      <div className="px-3.5 py-3 flex flex-col gap-2.5">
        {/* Kp Index */}
        <div className="flex items-baseline gap-2.5 cursor-pointer" onClick={() => onOpenModal('kp-history')}>
          <span className="font-mono-dm text-[36px] leading-none text-ink transition-opacity hover:opacity-70">4</span>
          <div className="flex flex-col gap-0.5">
            <span className="font-outfit font-light text-[9px] text-ink-muted uppercase tracking-wide">Kp index</span>
            <span className="font-outfit font-medium text-[11px] text-accent">Moderate</span>
          </div>
        </div>

        {/* Launch Conditions Gauge */}
        <div className="flex flex-col gap-1 cursor-pointer" onClick={() => onOpenModal('launch-conditions')}>
          <div className="flex justify-between items-center">
            <span className="font-outfit font-medium text-[9px] uppercase tracking-[0.12em] text-ink-sub">Launch Conditions</span>
            <span className="font-outfit font-medium text-[10px] text-accent">✓ Nominal</span>
          </div>
          <div className="relative h-[5px] rounded-full overflow-hidden transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(to right, hsl(var(--accent)) 0%, hsla(220, 20%, 60%, 0.35) 55%, hsla(0, 60%, 50%, 0.85) 100%)' }}>
            <div className="absolute -top-px w-[3px] h-[7px] bg-ink rounded-sm" style={{ left: '35%' }} />
          </div>
          <div className="flex justify-between font-mono-dm text-[8px] text-ink-muted">
            <span>Optimal</span>
            <span>Moderate</span>
            <span>Critical</span>
          </div>
        </div>

        {/* 2x2 Solar grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { key: 'solar-xray', label: 'X-Ray flux', value: 'C2.4' },
            { key: 'solar-wind', label: 'Solar wind', value: '412 km/s' },
            { key: 'solar-density', label: 'Density', value: '6.2 p/cm³' },
            { key: 'solar-bz', label: 'Bz field', value: '−3.1 nT' },
          ].map(cell => (
            <div
              key={cell.key}
              className="bg-surface border border-border rounded-sm px-2.5 py-2 cursor-pointer transition-colors hover:border-accent"
              onClick={() => onOpenModal(cell.key)}
            >
              <div className="font-outfit font-light text-[8px] text-ink-muted uppercase tracking-wide mb-0.5">{cell.label}</div>
              <div className="font-mono-dm text-xs text-ink">{cell.value}</div>
            </div>
          ))}
        </div>

        {/* Alert note */}
        <div
          className="border border-border border-l-2 border-l-accent bg-accent-dim rounded-sm px-2.5 py-2 font-outfit font-light text-[10px] text-ink-sub leading-relaxed cursor-pointer transition-opacity hover:opacity-75"
          onClick={() => onOpenModal('solar-alert-detail')}
        >
          Minor geomagnetic perturbation expected — G1 watch active through 18:00 UTC
        </div>
      </div>
    </div>
  );
}
