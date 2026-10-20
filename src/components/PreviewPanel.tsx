import type { ContrastResult, MaskShape } from "../types";
import ContrastWarning from "./ContrastWarning";

interface Props {
  masterDataUrl: string | null;
  maskableDataUrl: string | null;
  contrastResults: ContrastResult[];
  appName: string;
}

const checker = "checkboard-bg";

const MASK_SHAPES: { shape: MaskShape; label: string; radius: string }[] = [
  { shape: "circle", label: "Circle", radius: "50%" },
  { shape: "squircle", label: "Squircle", radius: "40%" },
  { shape: "rounded-square", label: "Rounded", radius: "22%" },
  { shape: "square", label: "Square", radius: "0%" },
];

export default function PreviewPanel({
  masterDataUrl,
  maskableDataUrl,
  contrastResults,
  appName,
}: Props) {
  if (!masterDataUrl) {
    return (
      <div className="text-[#8C8172] text-center py-12">
        Choose an input to see preview
      </div>
    );
  }

  const mask = maskableDataUrl ?? masterDataUrl;

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
        Preview
      </h3>

      {/* ---- Large preview ---- */}
      <div className="bg-[#141210] rounded-2xl border border-[#25201A] p-6 text-center flex flex-col items-center shadow-lg relative overflow-hidden">
        <div className={`${checker} rounded-3xl`}>
          <div className="w-48 h-48 rounded-3xl bg-white shadow-2xl p-4 flex items-center justify-center border border-white/20">
            <img
              src={masterDataUrl}
              alt="Icon"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* ---- Browser tabs (light & dark) ---- */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section px-1 mb-2">
          Browser Tabs
        </p>
        <div className="space-y-2">
          {/* Chrome light */}
          <div className="bg-[#E3E3E8] rounded-xl pt-2 px-2 shadow-md border border-[#D0D0D5] overflow-hidden">
            <div className="bg-white rounded-t-lg py-1.5 px-3 flex items-center gap-2">
              <img src={masterDataUrl} alt="tab" className="w-4 h-4" />
              <span className="text-[11px] font-medium text-neutral-800 truncate">
                My Page - Chrome
              </span>
              <span className="text-neutral-400 ml-auto text-xs">&times;</span>
            </div>
          </div>
          {/* Chrome dark */}
          <div className="bg-[#1E1F22] rounded-xl pt-2 px-2 shadow-md border border-[#2B2D31] overflow-hidden">
            <div className="bg-[#2B2D31] rounded-t-lg py-1.5 px-3 flex items-center gap-2">
              <img src={masterDataUrl} alt="tab" className="w-4 h-4" />
              <span className="text-[11px] font-medium text-neutral-200 truncate">
                My Page - Chrome Dark
              </span>
              <span className="text-neutral-600 ml-auto text-xs">&times;</span>
            </div>
          </div>
          {/* Firefox */}
          <div className="bg-[#1C1B22] rounded-xl p-1.5 px-3 shadow-md border border-[#2B2A33] flex items-center gap-2">
            <img src={masterDataUrl} alt="tab" className="w-4 h-4" />
            <span className="text-[11px] text-neutral-200 font-medium truncate">
              My Page - Firefox
            </span>
            <span className="text-neutral-600 ml-auto text-xs">&times;</span>
          </div>
          {/* Safari */}
          <div className="bg-[#141210] rounded-xl p-2 border border-[#2A241E] flex items-center justify-center">
            <div className="bg-[#0E0C0A] rounded-lg px-4 py-1.5 flex items-center gap-2 max-w-sm w-full border border-[#25201A] text-xs text-[#8C8071]">
              <img src={masterDataUrl} alt="tab" className="w-4 h-4" />
              <span className="font-mono text-neutral-300 truncate flex-1 text-center">
                domain.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Mobile home screens ---- */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section px-1 mb-2">
          Home Screen
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* iOS */}
          <div className="bg-[#141210] border border-[#25201A] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <img
              src={masterDataUrl}
              alt="iOS"
              className="w-14 h-14 rounded-2xl bg-white shadow-lg"
            />
            <span className="text-xs font-medium text-white mt-2">
              {appName || "App"}
            </span>
            <span className="text-[10px] text-[#A06D3B] font-mono">iOS</span>
          </div>
          {/* Android */}
          <div className="bg-[#141210] border border-[#25201A] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <img src={mask} alt="Android" className="w-14 h-14 rounded-full" />
            <span className="text-xs font-medium text-white mt-2">
              {appName || "App"}
            </span>
            <span className="text-[10px] text-[#A06D3B] font-mono">
              Android
            </span>
          </div>
        </div>
      </div>

      {/* ---- Android mask shapes ---- */}
      <div className="bg-[#141210] rounded-2xl p-4 border border-[#25201A] space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
          Android Adaptive Masks
        </p>
        <div className="flex gap-3 justify-center">
          {MASK_SHAPES.map((m) => (
            <div key={m.shape} className="flex flex-col items-center gap-1">
              <div className="relative">
                <img
                  src={mask}
                  alt={m.label}
                  className="w-12 h-12 object-cover"
                  style={{ borderRadius: m.radius }}
                />
                <div
                  className="absolute inset-0 border-2 border-dashed border-[#ec4899]/40 pointer-events-none"
                  style={{ borderRadius: m.radius }}
                />
              </div>
              <span className="text-[10px] text-[#8C8071] mt-1.5">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Google SERP ---- */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section px-1 mb-2">
          Google Search Result
        </p>
        <div className="bg-white rounded-2xl p-4 shadow-md text-left">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={masterDataUrl}
              alt="serp"
              className="w-7 h-7 rounded-full p-0.5 border border-neutral-200"
            />
            <div>
              <p className="text-xs text-neutral-800 leading-tight">
                {appName || "My App"}
              </p>
              <p className="text-[10px] text-neutral-500">
                https://example.com
              </p>
            </div>
          </div>
          <p className="text-sm text-[#be185d] hover:underline cursor-pointer">
            {appName || "My App"} - Official Website
          </p>
          <p className="text-xs text-neutral-600 mt-0.5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor...
          </p>
        </div>
      </div>

      {/* ---- Social link preview ---- */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section px-1 mb-2">
          Link Preview (Social)
        </p>
        <div className="bg-[#1C1916] rounded-2xl border border-[#2B2620] overflow-hidden">
          <div className="bg-[#25211D] h-28 flex items-center justify-center checkboard-bg">
            <img
              src={masterDataUrl}
              alt="og"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="p-3">
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#A06D3B]">
              example.com
            </p>
            <p className="text-sm text-neutral-200 font-medium">
              {appName || "My App"}
            </p>
            <p className="text-[11px] text-[#A39686] mt-0.5 truncate">
              A short description of the page...
            </p>
          </div>
        </div>
      </div>

      {/* ---- All sizes ---- */}
      <div className="bg-[#141210] rounded-2xl p-4 border border-[#25201A]">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section mb-3">
          All Sizes
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          {[16, 32, 48, 180, 192, 512].map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <div className="checkboard-bg rounded">
                <img
                  src={masterDataUrl}
                  alt={`${size}px`}
                  style={{
                    width: Math.min(size, 64),
                    height: Math.min(size, 64),
                  }}
                  className="object-contain"
                />
              </div>
              <span className="text-[9px] text-[#736A5E] font-mono">
                {size}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Contrast warnings ---- */}
      <ContrastWarning results={contrastResults} />
    </div>
  );
}
