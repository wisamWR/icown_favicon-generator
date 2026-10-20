import type { IconFile, SmallIconConfig } from '../types';
import { ICON_PRESETS, ICO_SIZES } from './presets';
import { stepDownResize, canvasToBlob, loadImage } from './render/resize';
import { encodeICO } from './render/ico';
import { generateManifest } from './package/manifest';
import { generateSnippet } from './package/snippet';
import { createIconZip } from './package/zip';

export interface ExportOptions {
  masterDataUrl: string;
  maskableDataUrl: string;
  svgContent: string | null;
  appName: string;
  themeColor: string;
  smallIconConfig?: SmallIconConfig;
}

export async function generateIconPackage(
  options: ExportOptions,
): Promise<Blob> {
  const masterImg = await loadImage(options.masterDataUrl);
  const maskableImg = await loadImage(options.maskableDataUrl);
  const sic = options.smallIconConfig;

  const files: IconFile[] = [];

  // --- PNG sizes ---
  for (const preset of ICON_PRESETS) {
    const img = preset.purpose === 'maskable' ? maskableImg : masterImg;
    const canvas = stepDownResize(
      img,
      preset.width,
      preset.height,
      preset.width <= 48 ? sic : undefined,
    );
    files.push({ name: preset.filename, data: await canvasToBlob(canvas) });
  }

  // --- ICO ---
  const icoEntries: { size: number; blob: Blob }[] = [];
  for (const size of ICO_SIZES) {
    const canvas = stepDownResize(masterImg, size, size, sic);
    icoEntries.push({ size, blob: await canvasToBlob(canvas) });
  }
  files.push({ name: 'favicon.ico', data: await encodeICO(icoEntries) });

  // --- SVG ---
  if (options.svgContent) {
    files.push({ name: 'favicon.svg', data: options.svgContent });
  }

  // --- Manifest ---
  files.push({
    name: 'site.webmanifest',
    data: generateManifest({ name: options.appName, themeColor: options.themeColor }),
  });

  // --- Snippet ---
  files.push({
    name: 'snippet.html',
    data: generateSnippet({ themeColor: options.themeColor, hasSvg: !!options.svgContent }),
  });

  return createIconZip(files);
}
