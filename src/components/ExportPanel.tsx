import { useState, useMemo } from 'react';
import type { Framework } from '../types';
import { FRAMEWORK_META, generateFrameworkSnippet } from '../lib/snippet-frameworks';
import BrowserInfo from './BrowserInfo';

interface Props {
  appName: string;
  themeColor: string;
  hasSvg: boolean;
  canExport: boolean;
  isExporting: boolean;
  onAppNameChange: (v: string) => void;
  onThemeColorChange: (v: string) => void;
  onExport: () => void;
}

const FRAMEWORKS = Object.entries(FRAMEWORK_META) as [Framework, { label: string; desc: string }][];

export default function ExportPanel({
  appName,
  themeColor,
  hasSvg,
  canExport,
  isExporting,
  onAppNameChange,
  onThemeColorChange,
  onExport,
}: Props) {
  const [framework, setFramework] = useState<Framework>('generic');
  const [copied, setCopied] = useState(false);

  const fwSnippet = useMemo(
    () => generateFrameworkSnippet(framework, { themeColor, hasSvg, appName }),
    [framework, themeColor, hasSvg, appName],
  );

  const copySnippet = async () => {
    await navigator.clipboard.writeText(fwSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Main settings card */}
      <div className="bg-[#141210] rounded-2xl p-5 border border-[#25201A] space-y-4">
        <div className="border-b border-[#25201A] pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
            Export
          </h3>
        </div>

        {/* App name */}
        <div>
          <label className="text-xs text-[#B5AAA0] font-medium block mb-1">App Name</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => onAppNameChange(e.target.value)}
            className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-2 text-xs text-white focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]"
            placeholder="My App"
          />
        </div>

        {/* Theme color */}
        <div>
          <label className="text-xs text-[#B5AAA0] font-medium block mb-1">Theme Color</label>
          <div className="flex items-center gap-2 bg-[#1C1815] border border-[#2E2822] rounded-xl p-1.5 px-3">
            <input
              type="color"
              value={themeColor}
              onChange={(e) => onThemeColorChange(e.target.value)}
              className="w-6 h-6 rounded-lg border border-[#3A332B] shadow-inner flex-shrink-0 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={themeColor}
              onChange={(e) => onThemeColorChange(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-xs font-mono text-white focus:ring-0"
            />
          </div>
        </div>

        {/* Framework selector */}
        <div>
          <label className="text-xs text-[#B5AAA0] font-medium block mb-1">Framework</label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as Framework)}
            className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-2 text-xs text-white focus:border-[#ec4899]"
          >
            {FRAMEWORKS.map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[#A06D3B] mt-0.5">{FRAMEWORK_META[framework].desc}</p>
        </div>

        {/* Generate button */}
        <button
          onClick={onExport}
          disabled={!canExport || isExporting}
          className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-xs tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 45%, #db2777 75%, #be185d 100%)', boxShadow: '0 4px 20px -2px rgba(236, 72, 153, 0.45)' }}
        >
          {isExporting ? 'Generating...' : 'Generate & Download ZIP'}
        </button>
      </div>

      {/* Snippet card */}
      <div className="bg-[#141210] rounded-2xl p-5 border border-[#25201A] space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-white">
            {FRAMEWORK_META[framework].label} snippet
          </label>
          <button
            onClick={copySnippet}
            className="px-2.5 py-1 rounded-lg bg-[#211D19] hover:bg-[#2C2325] text-xs font-mono font-medium text-[#f9a8d4] border border-[#332B22] hover:border-[#ec4899]/40 flex items-center gap-1 transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {fwSnippet.instructions && (
          <p className="text-[11px] text-[#736A5E] mb-1">{fwSnippet.instructions}</p>
        )}
        <pre className="bg-[#0C0B0A] rounded-xl p-3 border border-[#211E1A] text-[11px] font-mono text-[#D8D2C7] leading-relaxed overflow-x-auto max-h-60 custom-scroll">
          {fwSnippet.code}
        </pre>

        {/* File paths */}
        {fwSnippet.paths.length > 0 && (
          <div>
            <p className="text-xs text-[#B5AAA0] font-medium mb-1">Place files at:</p>
            <ul className="text-xs font-mono space-y-1.5 text-[#B8AEA2]">
              {fwSnippet.paths.map((p) => (
                <li key={p} className="flex items-center gap-1.5"><span className="text-[#ec4899] text-sm">&#9642;</span>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Browser info */}
      <BrowserInfo />
    </div>
  );
}
