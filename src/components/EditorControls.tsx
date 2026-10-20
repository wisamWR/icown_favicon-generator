import type { EditorConfig } from '../types';

interface Props {
  config: EditorConfig;
  onChange: (config: EditorConfig) => void;
}

export default function EditorControls({ config, onChange }: Props) {
  const update = (patch: Partial<EditorConfig>) =>
    onChange({ ...config, ...patch });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
        Editor
      </h3>

      {/* Padding */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Padding</span>
          <span className="text-neutral-300 font-mono">{config.padding}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={45}
          value={config.padding}
          onChange={(e) => update({ padding: Number(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Background color */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-neutral-400">Background</span>
          <label className="flex items-center gap-1 text-neutral-400 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={config.transparentBg}
              onChange={(e) => update({ transparentBg: e.target.checked })}
              className="accent-blue-500"
            />
            Transparent
          </label>
        </div>
        {!config.transparentBg && (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={config.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm font-mono"
            />
          </div>
        )}
      </div>

      {/* Border radius */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Corner Radius</span>
          <span className="text-neutral-300 font-mono">{config.borderRadius}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={50}
          value={config.borderRadius}
          onChange={(e) => update({ borderRadius: Number(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}
