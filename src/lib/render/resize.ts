/**
 * Step-down resize: halve canvas dimensions repeatedly until close to target,
 * then do one final draw. Produces sharper small icons than a single resize.
 */
export function stepDownResize(
  source: CanvasImageSource,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement {
  // Draw source onto a canvas first
  const srcCanvas = document.createElement('canvas');
  const sw = (source as HTMLImageElement).naturalWidth
    ?? (source as HTMLCanvasElement).width;
  const sh = (source as HTMLImageElement).naturalHeight
    ?? (source as HTMLCanvasElement).height;
  srcCanvas.width = sw;
  srcCanvas.height = sh;
  srcCanvas.getContext('2d')!.drawImage(source, 0, 0);

  let current: HTMLCanvasElement = srcCanvas;

  while (current.width / 2 > targetWidth && current.height / 2 > targetHeight) {
    const next = document.createElement('canvas');
    next.width = Math.floor(current.width / 2);
    next.height = Math.floor(current.height / 2);
    const ctx = next.getContext('2d')!;
    ctx.drawImage(current, 0, 0, next.width, next.height);
    current = next;
  }

  const final = document.createElement('canvas');
  final.width = targetWidth;
  final.height = targetHeight;
  const ctx = final.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(current, 0, 0, targetWidth, targetHeight);
  return final;
}

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
