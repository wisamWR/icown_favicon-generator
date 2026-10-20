import type { ContrastResult } from '../types';

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function analyzeContrast(
  canvas: HTMLCanvasElement,
): ContrastResult[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const size = canvas.width;
  const data = ctx.getImageData(0, 0, size, size).data;

  let edgeR = 0, edgeG = 0, edgeB = 0, edgeN = 0;
  let coreR = 0, coreG = 0, coreB = 0, coreN = 0;
  const q = size / 4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (data[i + 3] < 128) continue;
      const isEdge = x < q || x > size - q || y < q || y > size - q;
      if (isEdge) {
        edgeR += data[i]; edgeG += data[i + 1]; edgeB += data[i + 2]; edgeN++;
      } else {
        coreR += data[i]; coreG += data[i + 1]; coreB += data[i + 2]; coreN++;
      }
    }
  }

  const results: ContrastResult[] = [];

  if (edgeN > 0) {
    const eLum = getLuminance(edgeR / edgeN, edgeG / edgeN, edgeB / edgeN);

    // vs white (light browser chrome)
    const wRatio = contrastRatio(eLum, 1);
    if (wRatio < 3) {
      results.push({
        ratio: Math.round(wRatio * 10) / 10,
        level: wRatio < 1.5 ? 'poor' : 'warning',
        context: 'Light mode tab bar',
        suggestion:
          'Icon edge blends into white backgrounds. Add a border or use darker outer colors.',
      });
    }

    // vs dark (#1e1e1e)
    const dLum = getLuminance(30, 30, 30);
    const dRatio = contrastRatio(eLum, dLum);
    if (dRatio < 3) {
      results.push({
        ratio: Math.round(dRatio * 10) / 10,
        level: dRatio < 1.5 ? 'poor' : 'warning',
        context: 'Dark mode tab bar',
        suggestion:
          'Icon edge blends into dark backgrounds. Use lighter outer colors or enable dark-mode SVG variant.',
      });
    }
  }

  // internal contrast (content vs background within icon)
  if (coreN > 0 && edgeN > 0) {
    const coreLum = getLuminance(coreR / coreN, coreG / coreN, coreB / coreN);
    const edgeLum = getLuminance(edgeR / edgeN, edgeG / edgeN, edgeB / edgeN);
    const iRatio = contrastRatio(coreLum, edgeLum);
    if (iRatio < 2) {
      results.push({
        ratio: Math.round(iRatio * 10) / 10,
        level: 'warning',
        context: 'Internal contrast',
        suggestion:
          'Low contrast between icon content and background. Details will be lost at small sizes.',
      });
    }
  }

  return results;
}
