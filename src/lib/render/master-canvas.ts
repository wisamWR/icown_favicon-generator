import type { EditorConfig, TextConfig } from '../../types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getSourceDimensions(src: HTMLImageElement | HTMLCanvasElement) {
  if (src instanceof HTMLImageElement) {
    return { w: src.naturalWidth || src.width, h: src.naturalHeight || src.height };
  }
  return { w: src.width, h: src.height };
}

/* ------------------------------------------------------------------ */
/*  Master canvas (1024 x 1024)                                        */
/* ------------------------------------------------------------------ */

export const MASTER_SIZE = 1024;

export function renderMasterCanvas(
  source: HTMLImageElement | HTMLCanvasElement,
  config: EditorConfig,
  maskable = false,
): HTMLCanvasElement {
  const S = MASTER_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;

  // --- background ---
  if (!config.transparentBg) {
    ctx.fillStyle = config.backgroundColor;
    if (config.borderRadius > 0) {
      roundRect(ctx, 0, 0, S, S, (config.borderRadius / 100) * (S / 2));
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, S, S);
    }
  }

  // clip to rounded corners (even on transparent bg)
  if (config.borderRadius > 0) {
    ctx.save();
    roundRect(ctx, 0, 0, S, S, (config.borderRadius / 100) * (S / 2));
    ctx.clip();
  }

  // --- padding ---
  let pad = (config.padding / 100) * S;
  if (maskable) pad = Math.max(pad, S * 0.1);

  // --- draw source (contain) ---
  const { w: srcW, h: srcH } = getSourceDimensions(source);
  if (srcW > 0 && srcH > 0) {
    const contentW = S - pad * 2;
    const contentH = S - pad * 2;
    const scale = Math.min(contentW / srcW, contentH / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const drawX = pad + (contentW - drawW) / 2;
    const drawY = pad + (contentH - drawH) / 2;
    ctx.drawImage(source, drawX, drawY, drawW, drawH);
  }

  if (config.borderRadius > 0) ctx.restore();

  return canvas;
}

/* ------------------------------------------------------------------ */
/*  Source renderers (emoji / text → canvas)                           */
/* ------------------------------------------------------------------ */

export function renderEmojiToCanvas(emoji: string, size = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const fontSize = size * 0.75;
  ctx.font = `${fontSize}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);
  return canvas;
}

export function renderTextToCanvas(config: TextConfig, size = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // shape background
  ctx.fillStyle = config.bgColor;
  if (config.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (config.shape === 'rounded') {
    roundRect(ctx, 0, 0, size, size, size * 0.15);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, size, size);
  }

  // fit text
  let fontSize = size * 0.55;
  ctx.fillStyle = config.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${fontSize}px ${config.fontFamily}`;

  let metrics = ctx.measureText(config.text);
  while (metrics.width > size * 0.7 && fontSize > 12) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px ${config.fontFamily}`;
    metrics = ctx.measureText(config.text);
  }

  ctx.fillText(config.text, size / 2, size / 2 + fontSize * 0.04);
  return canvas;
}
