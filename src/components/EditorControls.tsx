import type { EditorConfig } from '../types';

interface Props {
  config: EditorConfig;
  onChange: (config: EditorConfig) => void;
}

export default function EditorControls({ config, onChange }: Props) {
  const update = (patch: Partial<EditorConfig>) =>
    onChange({ ...config, ...patch });

  return (
    <div className="bg-[#141210] rounded-2xl p-5 border border-[#25201A] space-y-4">
      <div className="flex items-center justify-between border-b border-[#25201A] pb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
          Editor
        </h3>
        <span className="text-[11px] text-[#ec4899] font-mono font-medium">Standard</span>
      </div>

      {/* Padding */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#B5AAA0] font-medium">Padding</span>
          <span className="text-[#f9a8d4] font-mono font-semibold">{config.padding}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={45}
          value={config.padding}
          onChange={(e) => update({ padding: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Background color */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-[#B5AAA0] font-medium">Background</span>
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-[#A69B8F]">
            <input
              type="checkbox"
              checked={config.transparentBg}
              onChange={(e) => update({ transparentBg: e.target.checked })}
              className="rounded bg-[#201D1A] border-[#373129] text-[#ec4899] focus:ring-[#ec4899]/30 h-3.5 w-3.5"
            />
            Transparent
          </label>
        </div>
        {!config.transparentBg && (
          <div className="flex items-center gap-2 bg-[#1C1815] border border-[#2B251F] rounded-xl p-1.5 px-2">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="w-6 h-6 rounded-lg border border-[#403930] shadow-sm flex-shrink-0 cursor-pointer"
            />
            <input
              type="text"
              value={config.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="flex-1 bg-transparent border-0 p-0 text-xs font-mono text-white uppercase focus:ring-0"
            />
          </div>
        )}
      </div>

      {/* Border radius */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#B5AAA0] font-medium">Corner Radius</span>
          <span className="text-[#f9a8d4] font-mono font-semibold">{config.borderRadius}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={50}
          value={config.borderRadius}
          onChange={(e) => update({ borderRadius: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}
