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
        <label className="block text-xs text-[#B5AAA0] font-medium mb-1">Text / Initials</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => update({ text: e.target.value })}
          maxLength={6}
          className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-2 text-lg text-center font-bold text-white focus:border-[#ec4899]"
          placeholder="AB"
        />
      </div>

      {/* Font */}
      <div>
        <label className="block text-xs text-[#B5AAA0] font-medium mb-1">Font</label>
        <select
          value={config.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-2 text-xs text-white focus:border-[#ec4899]"
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
          <label className="block text-xs text-[#B5AAA0] font-medium mb-1">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.textColor}
              onChange={(e) => update({ textColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border border-[#3A332B]"
            />
            <input
              type="text"
              value={config.textColor}
              onChange={(e) => update({ textColor: e.target.value })}
              className="flex-1 bg-[#1C1815] border border-[#2E2822] rounded-lg px-2 py-1 text-xs font-mono text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-[#B5AAA0] font-medium mb-1">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border border-[#3A332B]"
            />
            <input
              type="text"
              value={config.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="flex-1 bg-[#1C1815] border border-[#2E2822] rounded-lg px-2 py-1 text-xs font-mono text-white"
            />
          </div>
        </div>
      </div>

      {/* Shape */}
      <div>
        <label className="block text-xs text-[#B5AAA0] font-medium mb-1">Shape</label>
        <div className="flex gap-2">
          {SHAPES.map((s) => (
            <button
              key={s.value}
              onClick={() => update({ shape: s.value })}
              className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
                config.shape === s.value
                  ? 'bg-[#2D2124] text-[#fbcfe8] border border-[#ec4899]/30 shadow font-semibold'
                  : 'bg-[#1C1815] text-[#857B6D] hover:text-white border border-[#2E2822]'
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
