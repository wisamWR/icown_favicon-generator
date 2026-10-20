import { useState } from 'react';

const FILE_INFO: {
  name: string;
  tag: 'required' | 'recommended' | 'optional' | 'iOS';
  why: string;
}[] = [
  { name: 'favicon.ico',             tag: 'required',    why: 'Universal fallback. Every browser checks /favicon.ico.' },
  { name: 'favicon.svg',             tag: 'recommended', why: 'Scalable, supports dark mode via CSS @media. Chrome, Firefox, Edge.' },
  { name: 'favicon-32x32.png',       tag: 'recommended', why: 'Crisp icon for high-DPI screens on Chrome & Firefox.' },
  { name: 'favicon-16x16.png',       tag: 'optional',    why: 'Standard-DPI fallback. Less critical with SVG present.' },
  { name: 'apple-touch-icon.png',    tag: 'iOS',         why: 'Required for iOS "Add to Home Screen". Must be 180×180.' },
  { name: 'icon-192.png',            tag: 'recommended', why: 'PWA install icon on Android. Referenced in manifest.' },
  { name: 'icon-512.png',            tag: 'recommended', why: 'PWA splash screen icon. Google requires 512 for PWA criteria.' },
  { name: 'icon-maskable-*.png',     tag: 'optional',    why: 'Adaptive icon for Android. Content in 80% safe zone avoids clipping.' },
  { name: 'site.webmanifest',        tag: 'required',    why: 'Declares PWA icons, name, theme color. Needed for "installable" check.' },
];

const TAG_STYLE: Record<string, string> = {
  required:    'bg-[#221719] text-[#ec4899] border-[#ec4899]/30',
  recommended: 'bg-[#1A1714] text-[#A06D3B] border-[#A06D3B]/30',
  optional:    'bg-[#1C1815] text-[#8C8172] border-[#2E2822]',
  iOS:         'bg-[#221719] text-[#f9a8d4] border-[#ec4899]/20',
};

const BROWSER_NOTES = [
  { browser: 'Chrome',  note: 'Prefers SVG → 32px PNG → ICO. Checks manifest for PWA icons.' },
  { browser: 'Firefox', note: 'Prefers SVG → PNG sizes → ICO. Ignores apple-touch-icon.' },
  { browser: 'Safari',  note: 'Uses apple-touch-icon for home screen. SVG support partial (macOS only, no dark mode).' },
  { browser: 'Edge',    note: 'Same as Chrome (Chromium). Adds icon to taskbar pin.' },
  { browser: 'iOS',     note: 'Only uses apple-touch-icon (180×180). Ignores manifest icons for home screen.' },
  { browser: 'Android', note: 'Uses manifest icons. Applies adaptive mask to maskable icons.' },
];

export default function BrowserInfo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-[#ec4899] hover:text-[#f472b6] flex items-center gap-1"
      >
        <span>{open ? '▾' : '▸'}</span>
        File guide & browser behavior
      </button>

      {open && (
        <div className="space-y-4 text-xs">
          {/* File table */}
          <div className="space-y-1">
            <h4 className="text-[#A08A75] font-semibold uppercase tracking-wider font-section mb-1">
              Files
            </h4>
            {FILE_INFO.map((f) => (
              <div key={f.name} className="flex items-start gap-2">
                <span
                  className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-medium ${TAG_STYLE[f.tag]}`}
                >
                  {f.tag}
                </span>
                <div>
                  <span className="font-mono text-white">{f.name}</span>
                  <p className="text-[#8C8172]">{f.why}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Browser notes */}
          <div className="space-y-1">
            <h4 className="text-[#A08A75] font-semibold uppercase tracking-wider font-section mb-1">
              Browser Behavior
            </h4>
            {BROWSER_NOTES.map((b) => (
              <div key={b.browser} className="flex gap-2">
                <span className="font-semibold text-white w-16 shrink-0">
                  {b.browser}
                </span>
                <span className="text-[#8C8172]">{b.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
