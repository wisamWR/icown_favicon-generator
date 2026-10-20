import type { TextConfig, TextShape } from '../types';

interface Props {
  config: TextConfig;
  onChange: (config: TextConfig) => void;
}

const FONTS = [
  { label: 'Sans-serif', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Monospace', value: '"SF Mono", "Cascadia Code", "Consolas", monospace' },
  { label: 'Cursive', value: '"Segoe Script", "Comic Sans MS", cursive' },
];

const SHAPES: { label: string; value: TextShape }[] = [
  { label: 'Square', value: 'square' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Circle', value: 'circle' },
];

export default function TextInput({ config, onChange }: Props) {
  const update = (patch: Partial<TextConfig>) =>
    onChange({ ...config, ...patch });

  return (
    <div className="space-y-3">
      {/* Text */}
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Text / Initials</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => update({ text: e.target.value })}
          maxLength={6}
          className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-lg text-center font-bold"
          placeholder="AB"
        />
      </div>

      {/* Font */}
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Font</label>
        <select
          value={config.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.textColor}
              onChange={(e) => update({ textColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={config.textColor}
              onChange={(e) => update({ textColor: e.target.value })}
              className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={config.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Shape */}
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Shape</label>
        <div className="flex gap-2">
          {SHAPES.map((s) => (
            <button
              key={s.value}
              onClick={() => update({ shape: s.value })}
              className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
                config.shape === s.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
