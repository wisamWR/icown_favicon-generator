import type { DarkModeConfig, InputMode } from '../types';

interface Props {
  config: DarkModeConfig;
  inputMode: InputMode;
  onChange: (c: DarkModeConfig) => void;
}

export default function DarkModeSettings({ config, inputMode, onChange }: Props) {
  const update = (patch: Partial<DarkModeConfig>) =>
    onChange({ ...config, ...patch });

  if (inputMode === 'image') {
    return (
      <div className="text-[11px] text-[#7A7062] italic flex items-center gap-1.5">
        Dark-mode SVG only available for Text and Emoji inputs.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
          SVG Dark Mode
        </h3>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="rounded bg-[#201D1A] border-[#373129] text-[#ec4899] focus:ring-[#ec4899]/30 h-4 w-4"
          />
          <span className="text-xs text-[#A69B8F]">Enable</span>
        </label>
      </div>

      {config.enabled && (
        <div className="space-y-2 pl-1 border-l-2 border-[#25201A] ml-1">
          <p className="text-[11px] text-[#736A5E]">
            Colors used when user has dark system theme. Only affects SVG favicon.
          </p>

          {/* dark editor bg */}
          <div>
            <label className="block text-xs text-[#B5AAA0] mb-0.5">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.editorBg}
                onChange={(e) => update({ editorBg: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-[#403930]"
              />
              <input
                type="text"
                value={config.editorBg}
                onChange={(e) => update({ editorBg: e.target.value })}
                className="flex-1 bg-[#1C1815] border border-[#2E2822] rounded-lg px-2 py-0.5 text-xs font-mono text-white"
              />
            </div>
          </div>

          {inputMode === 'text' && (
            <>
              <div>
                <label className="block text-xs text-[#B5AAA0] mb-0.5">Text Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={config.textColor}
                    onChange={(e) => update({ textColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border border-[#403930]" />
                  <input type="text" value={config.textColor}
                    onChange={(e) => update({ textColor: e.target.value })}
                    className="flex-1 bg-[#1C1815] border border-[#2E2822] rounded-lg px-2 py-0.5 text-xs font-mono text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B5AAA0] mb-0.5">Shape Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={config.bgColor}
                    onChange={(e) => update({ bgColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border border-[#403930]" />
                  <input type="text" value={config.bgColor}
                    onChange={(e) => update({ bgColor: e.target.value })}
                    className="flex-1 bg-[#1C1815] border border-[#2E2822] rounded-lg px-2 py-0.5 text-xs font-mono text-white" />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
