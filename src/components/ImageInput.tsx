import { useCallback, useRef, useState, useEffect } from 'react';

interface Props {
  onImageChange: (dataUrl: string) => void;
}

export default function ImageInput({ onImageChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  // Paste support
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [handleFile]);

  return (
    <div className="space-y-3">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileRef.current?.click()}
        className={`relative group rounded-2xl bg-[#141210] p-6 text-center cow-dashed-border hover:bg-[#1A1615] transition cursor-pointer flex flex-col items-center justify-center min-h-[175px] ${
          dragging
            ? 'bg-[#1A1615] ring-2 ring-[#ec4899]/40'
            : ''
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-40 object-contain"
          />
        ) : (
          <div className="text-[#8C8172]">
            <p className="text-sm font-semibold text-white">Drop image here</p>
            <p className="text-xs text-[#8C8172] mt-1">or click to browse &middot; paste from clipboard</p>
            <p className="mt-2 text-[10px] tracking-wider text-[#9E8565] font-mono uppercase bg-[#1A1614] px-2 py-0.5 rounded border border-[#3A2D25]">PNG, JPG, SVG, WebP</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
