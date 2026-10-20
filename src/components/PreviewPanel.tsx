interface Props {
  masterDataUrl: string | null;
  maskableDataUrl: string | null;
}

/** Checkerboard background for transparent icons */
const checker =
  'bg-[length:16px_16px] bg-[image:linear-gradient(45deg,#333_25%,transparent_25%),linear-gradient(-45deg,#333_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#333_75%),linear-gradient(-45deg,transparent_75%,#333_75%)] bg-[position:0_0,0_8px,8px_-8px,-8px_0px]';

export default function PreviewPanel({ masterDataUrl, maskableDataUrl }: Props) {
  if (!masterDataUrl) {
    return (
      <div className="text-neutral-500 text-center py-12">
        Choose an input to see preview
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
        Preview
      </h3>

      {/* Large preview */}
      <div className="flex justify-center">
        <div className={`rounded-lg overflow-hidden ${checker}`}>
          <img
            src={masterDataUrl}
            alt="Icon preview"
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>

      {/* Size previews */}
      <div className="grid grid-cols-2 gap-4">
        {/* Browser tab mock */}
        <div>
          <p className="text-xs text-neutral-500 mb-2 text-center">Browser Tab</p>
          <div className="bg-neutral-800 rounded-t-lg px-3 py-2 flex items-center gap-2">
            <img src={masterDataUrl} alt="16px" className="w-4 h-4" />
            <span className="text-xs text-neutral-400 truncate">My Page</span>
            <span className="text-neutral-600 ml-auto text-xs">&times;</span>
          </div>
        </div>

        {/* Bookmark bar */}
        <div>
          <p className="text-xs text-neutral-500 mb-2 text-center">Bookmark</p>
          <div className="bg-neutral-800 rounded px-3 py-2 flex items-center gap-2">
            <img src={masterDataUrl} alt="16px" className="w-4 h-4" />
            <span className="text-xs text-neutral-400">Bookmark</span>
          </div>
        </div>

        {/* Home screen */}
        <div>
          <p className="text-xs text-neutral-500 mb-2 text-center">Home Screen</p>
          <div className="flex flex-col items-center gap-1 bg-neutral-800 rounded-lg p-3">
            <img
              src={masterDataUrl}
              alt="192px"
              className="w-14 h-14 rounded-2xl"
            />
            <span className="text-[10px] text-neutral-400">App</span>
          </div>
        </div>

        {/* Maskable */}
        <div>
          <p className="text-xs text-neutral-500 mb-2 text-center">Maskable</p>
          <div className="flex flex-col items-center gap-1 bg-neutral-800 rounded-lg p-3">
            <div className="relative w-14 h-14">
              <img
                src={maskableDataUrl ?? masterDataUrl}
                alt="maskable"
                className="w-14 h-14 rounded-full"
              />
              {/* safe zone ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/40 pointer-events-none" />
            </div>
            <span className="text-[10px] text-neutral-400">Maskable</span>
          </div>
        </div>
      </div>

      {/* All sizes */}
      <div>
        <p className="text-xs text-neutral-500 mb-2">All sizes</p>
        <div className="flex items-end gap-3 flex-wrap">
          {[16, 32, 48, 180, 192, 512].map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <div className={`${checker} rounded`}>
                <img
                  src={masterDataUrl}
                  alt={`${size}px`}
                  style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] text-neutral-500">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
