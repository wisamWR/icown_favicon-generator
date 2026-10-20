import type { ContrastResult } from '../types';

interface Props {
  results: ContrastResult[];
}

const ICONS: Record<ContrastResult['level'], string> = {
  good: '',
  warning: '!',
  poor: '!!',
};

const COLORS: Record<ContrastResult['level'], string> = {
  good: 'text-[#db2777]',
  warning: 'text-[#db2777]',
  poor: 'text-[#db2777]',
};

const BG: Record<ContrastResult['level'], string> = {
  good: 'bg-white rounded-2xl p-3.5 shadow-md border-[#fbcfe8]',
  warning: 'bg-white rounded-2xl p-3.5 shadow-md border-[#fbcfe8]',
  poor: 'bg-white rounded-2xl p-3.5 shadow-md border-[#ec4899]/50',
};

export default function ContrastWarning({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
        Contrast Check
      </h4>
      {results.map((r, i) => (
        <div
          key={i}
          className={`text-xs border ${BG[r.level]}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-black text-[#db2777]">
                {ICONS[r.level]} {r.ratio}:1
              </span>
              <span className="text-xs font-bold text-neutral-900">{r.context}</span>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold text-[#db2777] bg-[#fce7f3] px-3 py-1.5 rounded-full border border-[#fbcfe8]">{r.level}</span>
          </div>
          {r.suggestion && (
            <p className="text-[11px] text-neutral-600">{r.suggestion}</p>
          )}
        </div>
      ))}
    </div>
  );
}
