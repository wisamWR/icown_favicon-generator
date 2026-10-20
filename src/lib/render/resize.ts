import type { SmallIconConfig } from '../../types';

/**
 * Step-down resize: halve canvas dimensions repeatedly until close to target,
 * then do one final draw.  Optionally applies pixel-snap and sharpen for small sizes.
 */
export function stepDownResize(
  source: CanvasImageSource,
  targetWidth: number,
  targetHeight: number,
  opts?: SmallIconConfig,
): HTMLCanvasElement {
  const srcCanvas = document.createElement('canvas');
  const sw =
    (source as HTMLImageElement).naturalWidth ??
    (source as HTMLCanvasElement).width;
  const sh =
    (source as HTMLImageElement).naturalHeight ??
    (source as HTMLCanvasElement).height;
  srcCanvas.width = sw;
  srcCanvas.height = sh;
  srcCanvas.getContext('2d')!.drawImage(source, 0, 0);

  let current: HTMLCanvasElement = srcCanvas;

  while (current.width / 2 > targetWidth && current.height / 2 > targetHeight) {
    const next = document.createElement('canvas');
    next.width = Math.floor(current.width / 2);
    next.height = Math.floor(current.height / 2);
    next.getContext('2d')!.drawImage(current, 0, 0, next.width, next.height);
    current = next;
  }

  const final = document.createElement('canvas');
  final.width = targetWidth;
  final.height = targetHeight;
  const ctx = final.getContext('2d')!;

  const isSmall = targetWidth <= 48;

  if (opts?.pixelSnap && isSmall) {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  ctx.drawImage(current, 0, 0, targetWidth, targetHeight);

  // post-process small icons
  if (isSmall && opts) {
    if (opts.sharpen) sharpenCanvas(ctx, targetWidth, targetHeight);
    if (opts.brightness !== 0 || opts.contrast !== 0) {
      adjustBrightnessContrast(ctx, targetWidth, targetHeight, opts.brightness, opts.contrast);
    }
  }

  return final;
}

/* ---- Sharpen (unsharp-mask lite) ---- */
function sharpenCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const copy = new Uint8ClampedArray(d);
  const strength = 0.4;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = copy[i + c];
        const avg =
          (copy[i + c - 4] + copy[i + c + 4] +
           copy[i + c - w * 4] + copy[i + c + w * 4]) / 4;
        d[i + c] = Math.max(0, Math.min(255, center + (center - avg) * strength));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

/* ---- Brightness / contrast ---- */
function adjustBrightnessContrast(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  brightness: number,
  contrast: number,
) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const b = brightness * 2.55;
  const f =
    contrast > 0
      ? (259 * (contrast * 2.55 + 255)) / (255 * (259 - contrast * 2.55))
      : 1 + contrast / 50;

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    for (let c = 0; c < 3; c++) {
      d[i + c] = Math.max(0, Math.min(255, f * (d[i + c] - 128) + 128 + b));
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

/* ---- Helpers ---- */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      type,
      quality,
    );
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
