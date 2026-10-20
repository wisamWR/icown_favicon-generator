export interface IconPreset {
  name: string;
  filename: string;
  width: number;
  height: number;
  purpose?: 'any' | 'maskable';
}

export const ICON_PRESETS: IconPreset[] = [
  { name: 'favicon-16x16',      filename: 'favicon-16x16.png',      width: 16,  height: 16 },
  { name: 'favicon-32x32',      filename: 'favicon-32x32.png',      width: 32,  height: 32 },
  { name: 'favicon-48x48',      filename: 'favicon-48x48.png',      width: 48,  height: 48 },
  { name: 'apple-touch-icon',   filename: 'apple-touch-icon.png',   width: 180, height: 180 },
  { name: 'icon-192',           filename: 'icon-192.png',           width: 192, height: 192, purpose: 'any' },
  { name: 'icon-512',           filename: 'icon-512.png',           width: 512, height: 512, purpose: 'any' },
  { name: 'icon-maskable-192',  filename: 'icon-maskable-192.png',  width: 192, height: 192, purpose: 'maskable' },
  { name: 'icon-maskable-512',  filename: 'icon-maskable-512.png',  width: 512, height: 512, purpose: 'maskable' },
];

export const ICO_SIZES = [16, 32, 48];
