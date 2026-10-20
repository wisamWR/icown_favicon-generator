import { useState, useMemo } from 'react';
import { generateSnippet } from '../lib/package/snippet';

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
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(
    () => generateSnippet({ themeColor, hasSvg }),
    [themeColor, hasSvg],
  );

  const copySnippet = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
        Export
      </h3>

      {/* App name */}
      <div>
        <label className="block text-sm text-neutral-400 mb-1">App Name</label>
        <input
          type="text"
          value={appName}
          onChange={(e) => onAppNameChange(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-sm"
          placeholder="My App"
        />
      </div>

      {/* Theme color */}
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Theme Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={themeColor}
            onChange={(e) => onThemeColorChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
          />
          <input
            type="text"
            value={themeColor}
            onChange={(e) => onThemeColorChange(e.target.value)}
            className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm font-mono"
          />
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onExport}
        disabled={!canExport || isExporting}
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white"
      >
        {isExporting ? 'Generating...' : 'Generate & Download ZIP'}
      </button>

      {/* Snippet */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-neutral-400">
            HTML &lt;head&gt; snippet
          </label>
          <button
            onClick={copySnippet}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-neutral-900 border border-neutral-700 rounded p-3 text-xs text-neutral-300 overflow-x-auto whitespace-pre-wrap">
          {snippet}
        </pre>
      </div>

      {/* File list */}
      <div>
        <p className="text-xs text-neutral-500 mb-1">Files included in ZIP:</p>
        <ul className="text-xs text-neutral-400 space-y-0.5 font-mono">
          <li>favicon.ico (16, 32, 48)</li>
          {hasSvg && <li>favicon.svg</li>}
          <li>favicon-16x16.png</li>
          <li>favicon-32x32.png</li>
          <li>favicon-48x48.png</li>
          <li>apple-touch-icon.png (180)</li>
          <li>icon-192.png</li>
          <li>icon-512.png</li>
          <li>icon-maskable-192.png</li>
          <li>icon-maskable-512.png</li>
          <li>site.webmanifest</li>
          <li>snippet.html</li>
        </ul>
      </div>
    </div>
  );
}
