import { useState, useRef, useEffect, useCallback } from 'react';
import {
  badgeSnippet, type BadgeOpts,
  progressSnippet, type ProgressOpts,
  timerSnippet, type TimerOpts,
  animateSnippet, type AnimateOpts,
} from '../lib/animated-snippets';
import type { AnimToolType } from '../types';

interface Props {
  masterDataUrl: string | null;
}

const TABS: { id: AnimToolType; label: string }[] = [
  { id: 'badge',    label: 'Badge' },
  { id: 'progress', label: 'Progress' },
  { id: 'timer',    label: 'Timer' },
  { id: 'animate',  label: 'Animation' },
];

/* ================================================================== */
export default function AnimatedTools({ masterDataUrl }: Props) {
  const [tab, setTab] = useState<AnimToolType>('badge');

  /* ---- Badge ---- */
  const [badge, setBadge] = useState<BadgeOpts & { count: number }>({
    count: 3, position: 'top-right', bgColor: '#ef4444', textColor: '#ffffff', size: 10,
  });

  /* ---- Progress ---- */
  const [progress, setProgress] = useState<ProgressOpts & { value: number }>({
    style: 'circle', color: '#3b82f6', trackColor: '#374151', width: 3, value: 65,
  });

  /* ---- Timer ---- */
  const [timer, setTimer] = useState<TimerOpts & { previewSec: number }>({
    bgColor: '#1e1b4b', textColor: '#ffffff', ringColor: '#6366f1', style: 'ring', previewSec: 125,
  });

  /* ---- Animate ---- */
  const [anim, setAnim] = useState<AnimateOpts>({ interval: 300 });

  /* ---- Canvas preview ---- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);

  const drawPreview = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv || !masterDataUrl) return;
    const S = 64;
    cv.width = S; cv.height = S;
    const ctx = cv.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, S, S);
      ctx.drawImage(img, 0, 0, S, S);

      if (tab === 'badge') {
        const r = badge.size;
        const pos: Record<string, [number, number]> = {
          'top-right': [S - r - 2, r + 2],
          'top-left': [r + 2, r + 2],
          'bottom-right': [S - r - 2, S - r - 2],
          'bottom-left': [r + 2, S - r - 2],
        };
        const [bx, by] = pos[badge.position];
        ctx.fillStyle = badge.bgColor;
        ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = badge.textColor;
        ctx.font = `bold ${r * 1.2}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(badge.count > 99 ? '99+' : String(badge.count), bx, by);
      }

      if (tab === 'progress') {
        const pct = progress.value / 100;
        if (progress.style === 'circle') {
          ctx.strokeStyle = progress.trackColor;
          ctx.lineWidth = progress.width * 2;
          ctx.beginPath(); ctx.arc(S/2, S/2, S/2 - progress.width*2, 0, Math.PI*2); ctx.stroke();
          ctx.strokeStyle = progress.color;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(S/2, S/2, S/2 - progress.width*2, -Math.PI/2, -Math.PI/2 + pct * Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = progress.trackColor;
          ctx.fillRect(0, S - progress.width*2, S, progress.width*2);
          ctx.fillStyle = progress.color;
          ctx.fillRect(0, S - progress.width*2, S * pct, progress.width*2);
        }
      }

      if (tab === 'timer') {
        ctx.fillStyle = timer.bgColor;
        ctx.fillRect(0, 0, S, S);
        if (timer.style === 'ring') {
          ctx.strokeStyle = timer.ringColor;
          ctx.lineWidth = 4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.arc(S/2, S/2, S/2 - 4, -Math.PI/2, -Math.PI/2 + 0.7 * Math.PI*2); ctx.stroke();
        }
        const m = Math.floor(timer.previewSec / 60);
        const s = timer.previewSec % 60;
        ctx.fillStyle = timer.textColor;
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`${m}:${String(s).padStart(2,'0')}`, S/2, S/2);
      }

      // Capture canvas to data URL for tab mock
      setPreviewImgUrl(cv.toDataURL('image/png'));
    };
    img.src = masterDataUrl;
  }, [masterDataUrl, tab, badge, progress, timer]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  /* ---- Snippet ---- */
  const snippet = (() => {
    switch (tab) {
      case 'badge':    return badgeSnippet(badge);
      case 'progress': return progressSnippet(progress);
      case 'timer':    return timerSnippet(timer);
      case 'animate':  return animateSnippet(anim);
    }
  })();

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---- Render ---- */
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: tabs + config */}
      <div className="bg-[#141210] rounded-2xl p-5 border border-[#ec4899]/30 space-y-4 shadow-lg shadow-[#ec4899]/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec4899] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#ec4899]"></span></span>
          <span className="text-xs font-bold uppercase tracking-wider text-white font-section">Animate</span>
          <span className="text-[10px] bg-[#221719] text-[#f9a8d4] px-2 py-0.5 rounded border border-[#ec4899]/30 font-mono">Animate Mode</span>
        </div>
        <div className="bg-[#1C1815] p-1 rounded-xl border border-[#2B251F] grid grid-cols-4 text-[11px] font-medium text-center">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-1 rounded-lg transition-colors ${
                tab === t.id ? 'font-semibold text-[#fdf2f8]' : 'text-[#857B6D] hover:text-white'
              }`}
              style={tab === t.id ? { background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Config per tool */}
        {tab === 'badge' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Count</label>
              <input type="number" min={0} max={999} value={badge.count}
                onChange={(e) => setBadge({ ...badge, count: Number(e.target.value) })}
                className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]" />
            </div>
            <div>
              <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Position</label>
              <select value={badge.position}
                onChange={(e) => setBadge({ ...badge, position: e.target.value as BadgeOpts['position'] })}
                className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#ec4899]">
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Badge Color</label>
                <div className="flex items-center gap-2 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-3">
                  <input type="color" value={badge.bgColor}
                    onChange={(e) => setBadge({ ...badge, bgColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent" />
                  <span className="text-xs font-mono text-white">{badge.bgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Text Color</label>
                <div className="flex items-center gap-2 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-3">
                  <input type="color" value={badge.textColor}
                    onChange={(e) => setBadge({ ...badge, textColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent" />
                  <span className="text-xs font-mono text-white">{badge.textColor}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <label className="text-[#B5AAA0] font-medium">Size ({badge.size}px)</label>
                <span className="text-[#f9a8d4] font-mono font-semibold">{badge.size}</span>
              </div>
              <input type="range" min={6} max={14} value={badge.size}
                onChange={(e) => setBadge({ ...badge, size: Number(e.target.value) })}
                className="w-full" />
            </div>
          </div>
        )}

        {tab === 'progress' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Style</label>
              <div className="flex gap-2">
                {(['circle', 'bar'] as const).map((s) => (
                  <button key={s} onClick={() => setProgress({ ...progress, style: s })}
                    className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                      progress.style === s ? 'text-[#fdf2f8] font-semibold' : 'bg-[#1C1815] text-[#857B6D] hover:text-white border border-[#2E2822]'
                    }`}
                    style={progress.style === s ? { background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' } : undefined}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <label className="text-[#B5AAA0] font-medium">Preview value ({progress.value}%)</label>
                <span className="text-[#f9a8d4] font-mono font-semibold">{progress.value}%</span>
              </div>
              <input type="range" min={0} max={100} value={progress.value}
                onChange={(e) => setProgress({ ...progress, value: Number(e.target.value) })}
                className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Fill Color</label>
                <div className="flex items-center gap-2 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-3">
                  <input type="color" value={progress.color}
                    onChange={(e) => setProgress({ ...progress, color: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent" />
                  <span className="text-xs font-mono text-white">{progress.color}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Track Color</label>
                <div className="flex items-center gap-2 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-3">
                  <input type="color" value={progress.trackColor}
                    onChange={(e) => setProgress({ ...progress, trackColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent" />
                  <span className="text-xs font-mono text-white">{progress.trackColor}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <label className="text-[#B5AAA0] font-medium">Stroke width ({progress.width})</label>
                <span className="text-[#f9a8d4] font-mono font-semibold">{progress.width}</span>
              </div>
              <input type="range" min={2} max={6} value={progress.width}
                onChange={(e) => setProgress({ ...progress, width: Number(e.target.value) })}
                className="w-full" />
            </div>
          </div>
        )}

        {tab === 'timer' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Style</label>
              <div className="flex gap-2">
                {(['ring', 'text'] as const).map((s) => (
                  <button key={s} onClick={() => setTimer({ ...timer, style: s })}
                    className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                      timer.style === s ? 'text-[#fdf2f8] font-semibold' : 'bg-[#1C1815] text-[#857B6D] hover:text-white border border-[#2E2822]'
                    }`}
                    style={timer.style === s ? { background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' } : undefined}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Preview time (sec)</label>
              <input type="number" min={0} max={5999} value={timer.previewSec}
                onChange={(e) => setTimer({ ...timer, previewSec: Number(e.target.value) })}
                className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">BG</label>
                <div className="flex items-center gap-1 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-2">
                  <input type="color" value={timer.bgColor}
                    onChange={(e) => setTimer({ ...timer, bgColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Text</label>
                <div className="flex items-center gap-1 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-2">
                  <input type="color" value={timer.textColor}
                    onChange={(e) => setTimer({ ...timer, textColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B5AAA0] font-medium mb-0.5">Ring</label>
                <div className="flex items-center gap-1 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-2">
                  <input type="color" value={timer.ringColor}
                    onChange={(e) => setTimer({ ...timer, ringColor: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'animate' && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <label className="text-[#B5AAA0] font-medium">Frame interval ({anim.interval}ms)</label>
                <span className="text-[#f9a8d4] font-mono font-semibold">{anim.interval}ms</span>
              </div>
              <input type="range" min={100} max={2000} step={50} value={anim.interval}
                onChange={(e) => setAnim({ ...anim, interval: Number(e.target.value) })}
                className="w-full" />
            </div>
            <p className="text-[10px] text-[#7A7165] leading-relaxed pt-2 border-t border-[#1F1C18]">
              Generates a snippet to rotate through multiple favicon images.
              Provide data-URLs or paths via <code className="text-[#f9a8d4] font-mono">setFaviconFrames()</code>.
              Automatically pauses when tab is hidden and respects <span className="text-[#f9a8d4] font-mono">prefers-reduced-motion</span>.
            </p>
          </div>
        )}
      </div>

      {/* Center: preview */}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
          Preview
        </h3>
        {masterDataUrl ? (
          <div className="bg-[#141210] rounded-2xl border border-[#25201A] p-6 w-full">
            {/* Main canvas preview (drawn by drawPreview) */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#141210] rounded-lg p-4">
                <canvas ref={canvasRef} width={64} height={64} className="w-24 h-24" />
              </div>
            </div>

            {/* Tab mock using captured image */}
            {previewImgUrl && (
              <div className="bg-[#1E1F22] rounded-xl p-1.5 px-3 border border-[#2B2D31] flex items-center gap-2 w-full max-w-52 mx-auto">
                <img src={previewImgUrl} alt="tab" className="w-4 h-4" />
                <span className="text-[11px] text-neutral-200 font-medium truncate">My Page</span>
                <span className="text-neutral-600 ml-auto text-xs">&times;</span>
              </div>
            )}

            <p className="text-[10px] text-[#7A7165] text-center max-w-48 mx-auto mt-3 leading-relaxed">
              All snippets include <span className="text-[#f9a8d4] font-mono">prefers-reduced-motion</span> guard
              and pause when tab is hidden.
            </p>
          </div>
        ) : (
          <p className="text-[#8C8172] text-sm">
            Create an icon in the Generate tab first.
          </p>
        )}
      </div>

      {/* Right: code output */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white">
            Code
          </h3>
          <button onClick={copy} className="px-2.5 py-1 rounded-lg bg-[#211D19] hover:bg-[#2C2325] text-xs font-mono font-medium text-[#f9a8d4] border border-[#332B22] hover:border-[#ec4899]/40 transition">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-[#0C0B0A] rounded-xl p-3 border border-[#211E1A] text-[11px] font-mono text-[#D8D2C7] leading-relaxed overflow-auto max-h-96 custom-scroll whitespace-pre-wrap">
          {snippet}
        </pre>
      </div>
    </div>
  );
}
