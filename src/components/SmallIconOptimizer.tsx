import type { SmallIconConfig } from '../types';

interface Props {
  config: SmallIconConfig;
  onChange: (c: SmallIconConfig) => void;
  previewDataUrl: string | null;   // 16px WITH adjustments
  originalPreviewUrl: string | null; // 16px WITHOUT adjustments
}

export default function SmallIconOptimizer({
  config, onChange, previewDataUrl, originalPreviewUrl,
}: Props) {
  const update = (patch: Partial<SmallIconConfig>) =>
    onChange({ ...config, ...patch });

  const hasChanges =
    config.brightness !== 0 ||
    config.contrast !== 0 ||
    config.sharpen ||
    config.pixelSnap;

  return (
    <div className="bg-[#141210] rounded-2xl p-5 border border-[#25201A] space-y-4">
      <div className="border-b border-[#25201A] pb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
          Small Icon Optimizer
        </h3>
      </div>
      <p className="text-[11px] text-[#736A5E] mt-1 leading-snug">
        Tweak how icons render at 16–48 px. Only affects small exported sizes,
        not the main preview.
      </p>

      {/* Before / After comparison */}
      {previewDataUrl && originalPreviewUrl && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between bg-[#1C1815] p-3 rounded-xl border border-[#2B251F]">
            {/* Before */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1.5">
                <div className="bg-white shadow border border-[#383127] p-1 rounded" title="16px on light bg">
                  <img src={originalPreviewUrl} alt="" className="w-4 h-4"
                    style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className="bg-[#141210] p-1 rounded" title="16px on dark bg">
                  <img src={originalPreviewUrl} alt="" className="w-4 h-4"
                    style={{ imageRendering: 'pixelated' }} />
                </div>
              </div>
              <span className="text-[9px] text-[#736A5E]">Original</span>
            </div>

            <span className="text-[#A06D3B] text-sm">→</span>

            {/* After */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1.5">
                <div className="bg-white shadow border border-[#383127] p-1 rounded" title="16px adjusted, light bg">
                  <img src={previewDataUrl} alt="" className="w-4 h-4 ring-1 ring-[#ec4899]"
                    style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className="bg-[#141210] p-1 rounded" title="16px adjusted, dark bg">
                  <img src={previewDataUrl} alt="" className="w-4 h-4 ring-1 ring-[#ec4899]"
                    style={{ imageRendering: 'pixelated' }} />
                </div>
              </div>
              <span className="text-[9px] text-[#ec4899] font-medium">
                {hasChanges ? 'Adjusted' : 'Same'}
              </span>
            </div>
          </div>

          {/* Larger zoomed comparison */}
          <div className="flex items-center gap-3">
            <div className="bg-[#141210] p-1 rounded">
              <img src={originalPreviewUrl} alt="" className="w-8 h-8"
                style={{ imageRendering: 'pixelated' }} />
            </div>
            <span className="text-[#A06D3B] text-sm">→</span>
            <div className="bg-[#141210] p-1 rounded">
              <img src={previewDataUrl} alt="" className="w-8 h-8 ring-1 ring-[#ec4899]"
                style={{ imageRendering: 'pixelated' }} />
            </div>
            <span className="text-[10px] text-[#A06D3B] font-mono">32px zoom</span>
          </div>
        </div>
      )}

      {/* Brightness */}
      <div>
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-[#B5AAA0] font-medium">Brightness</span>
          <span className="text-[#f9a8d4] font-mono font-semibold">{config.brightness}</span>
        </div>
        <input type="range" min={-50} max={50} value={config.brightness}
          onChange={(e) => update({ brightness: Number(e.target.value) })}
          className="w-full" />
      </div>

      {/* Contrast */}
      <div>
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-[#B5AAA0] font-medium">Contrast</span>
          <span className="text-[#f9a8d4] font-mono font-semibold">{config.contrast}</span>
        </div>
        <input type="range" min={-50} max={50} value={config.contrast}
          onChange={(e) => update({ contrast: Number(e.target.value) })}
          className="w-full" />
      </div>

      {/* Toggles */}
      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={config.sharpen}
            onChange={(e) => update({ sharpen: e.target.checked })}
            className="rounded bg-[#201D1A] border-[#373129] text-[#ec4899] focus:ring-[#ec4899]/30 h-4 w-4" />
          <span className="text-xs text-[#C7BEB3]">Sharpen</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={config.pixelSnap}
            onChange={(e) => update({ pixelSnap: e.target.checked })}
            className="rounded bg-[#201D1A] border-[#373129] text-[#ec4899] focus:ring-[#ec4899]/30 h-4 w-4" />
          <span className="text-xs text-[#C7BEB3]">Pixel snap</span>
        </label>
      </div>
    </div>
  );
}
