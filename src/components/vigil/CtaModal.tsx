import { useState, useEffect, useCallback } from 'react';
import { MODAL_CONTENT } from '@/lib/mockData';

interface CtaModalProps {
  isOpen: boolean;
  modalKey: string;
  onClose: () => void;
  eventHours?: number;
}

const ROLES = [
  'New space startup',
  'Satellite operator',
  'Space agency',
  'Defense / Government',
  'Journalist / Researcher',
  'Curious professional',
  'Other',
];

function getIntroOverride(eventHours?: number, eventType?: string): string | null {
  if (eventHours === undefined) return null;
  if (eventHours < 0) {
    const absH = Math.abs(Math.round(eventHours));
    return `Cet événement s'est produit il y a ${absH}h. Les données d'archives ne sont pas encore disponibles dans Vigil.`;
  }
  if (eventHours > 0 && (eventType === 'conjunction' || eventType === 'reentry')) {
    return 'Les prévisions de conjonctions et rentrées ne sont pas encore disponibles dans Vigil — mais si c\'est quelque chose qui vous intéresse, dites-le nous.';
  }
  return null;
}

export default function CtaModal({ isOpen, modalKey, onClose, eventHours }: CtaModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const content = MODAL_CONTENT[modalKey] || { title: modalKey, intro: 'Cette fonctionnalité n\'est pas encore définie.' };

  // Determine event type from key
  const eventType = modalKey.includes('conj') ? 'conjunction' : modalKey.includes('reentry') ? 'reentry' : 'launch';
  const introOverride = getIntroOverride(eventHours, eventType);

  const mailtoHref = useCallback(() => {
    const subject = encodeURIComponent('Vigil — ' + content.title);
    const body = encodeURIComponent(
      `From: ${name || '(not provided)'}\nRole: ${role || '(not provided)'}\nFeature: ${modalKey}\n\nWhat I expected here:\n${message || '(not provided)'}\n\n---\nSent from vigil.atelieriter.com`
    );
    return `mailto:contact@atelieriter.com?subject=${subject}&body=${body}`;
  }, [name, role, message, content.title, modalKey]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[1000] transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'rgba(10,12,16,0.8)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-bg2 border border-border rounded-sm w-full max-w-[460px] mx-5 transform transition-transform duration-200">
        {/* Top */}
        <div className="px-5 pt-[18px] pb-3.5 border-b border-border flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="font-mono-dm text-[8px] uppercase tracking-[0.12em] text-ink-muted mb-1">Feature Preview</div>
            <div className="font-outfit font-medium text-[15px] text-ink mb-1.5">{content.title}</div>
            <div className="font-outfit font-light text-[11px] text-ink-sub leading-relaxed">
              <em className="italic text-accent">Vigil est une expérimentation développée par Atelier ITER.</em>
              {' '}Si vous pensez que cette fonctionnalité a un sens, n'hésitez pas à nous en faire part — et dites-nous ce que vous attendiez ici.
              <br /><br />
              {introOverride || content.intro}
            </div>
          </div>
          <button
            className="bg-transparent border-none text-ink-muted text-xl cursor-pointer p-0 leading-none shrink-0 transition-colors hover:text-ink"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div>
              <label className="block font-outfit font-medium text-[9px] uppercase tracking-[0.12em] text-ink-sub mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-surface border border-border rounded-sm px-2.5 py-2 font-outfit font-light text-xs text-ink outline-none transition-colors focus:border-accent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block font-outfit font-medium text-[9px] uppercase tracking-[0.12em] text-ink-sub mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-surface border border-border rounded-sm px-2.5 py-2 font-outfit font-light text-xs text-ink outline-none transition-colors focus:border-accent appearance-none"
              >
                <option value="">Select…</option>
                {ROLES.map(r => <option key={r} value={r} className="bg-bg2 text-ink">{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-outfit font-medium text-[9px] uppercase tracking-[0.12em] text-ink-sub mb-1">What would you expect here?</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-surface border border-border rounded-sm px-2.5 py-2 font-outfit font-light text-xs text-ink outline-none transition-colors focus:border-accent resize-y min-h-[65px] leading-relaxed"
              placeholder="Describe what you'd like to see…"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-3">
          <p className="font-outfit font-light text-[9px] text-ink-muted leading-relaxed flex-1 italic">
            Vigil est une expérimentation d'Atelier ITER. Votre message ouvre votre client mail — je lis chacun d'eux.
          </p>
          <a
            href={mailtoHref()}
            className="bg-accent text-accent-foreground border-none rounded-sm px-4 py-2 font-outfit font-medium text-[11px] tracking-wide cursor-pointer shrink-0 transition-opacity hover:opacity-85 no-underline inline-block"
          >
            Send →
          </a>
        </div>
      </div>
    </div>
  );
}