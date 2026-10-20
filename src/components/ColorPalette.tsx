interface Props {
  colors: string[];
  onSelectColor: (hex: string) => void;
}

export default function ColorPalette({ colors, onSelectColor }: Props) {
  if (colors.length === 0) return null;

  return (
    <div className="bg-[#141210] rounded-2xl p-5 border border-[#25201A] space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#A08A75] font-section">
        Extracted Brand Colors
      </h4>
      <p className="text-[11px] text-[#736A5E] mt-0.5">
        Click to use as theme color or background.
      </p>
      <div className="grid grid-cols-5 gap-2 pt-1">
        {colors.map((hex) => (
          <button
            key={hex}
            onClick={() => onSelectColor(hex)}
            className="flex flex-col items-center group text-center focus:outline-none"
            title={hex}
          >
            <div
              className="w-full aspect-square rounded-lg border border-[#3E372E] shadow group-hover:scale-105 transition-transform"
              style={{ backgroundColor: hex }}
            />
            <span className="text-[9px] font-mono text-[#8C8071] mt-1 group-hover:text-white">
              {hex}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
