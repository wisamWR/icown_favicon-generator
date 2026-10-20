import type { TextConfig, EditorConfig } from '../../types';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildTextSvg(
  textConfig: TextConfig,
  editorConfig: EditorConfig,
): string {
  const V = 100; // viewBox
  const pad = (editorConfig.padding / 100) * V;
  const contentSize = V - pad * 2;
  const bgR = (editorConfig.borderRadius / 100) * (V / 2);
  const bgFill = editorConfig.transparentBg ? 'none' : editorConfig.backgroundColor;

  let shapeEl: string;
  const cx = V / 2;
  const cy = V / 2;

  if (textConfig.shape === 'circle') {
    const r = contentSize / 2;
    shapeEl = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${textConfig.bgColor}"/>`;
  } else if (textConfig.shape === 'rounded') {
    const sr = contentSize * 0.15;
    shapeEl = `<rect x="${pad}" y="${pad}" width="${contentSize}" height="${contentSize}" rx="${sr}" fill="${textConfig.bgColor}"/>`;
  } else {
    shapeEl = `<rect x="${pad}" y="${pad}" width="${contentSize}" height="${contentSize}" fill="${textConfig.bgColor}"/>`;
  }

  const fontSize = contentSize * 0.5;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">`,
    `  <rect width="${V}" height="${V}" rx="${bgR}" fill="${bgFill}"/>`,
    `  ${shapeEl}`,
    `  <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"`,
    `        font-family="${escapeXml(textConfig.fontFamily)}" font-weight="bold"`,
    `        font-size="${fontSize}" fill="${textConfig.textColor}">${escapeXml(textConfig.text)}</text>`,
    `</svg>`,
  ].join('\n');
}

export function buildEmojiSvg(
  emoji: string,
  editorConfig: EditorConfig,
): string {
  const V = 100;
  const bgR = (editorConfig.borderRadius / 100) * (V / 2);
  const bgFill = editorConfig.transparentBg ? 'none' : editorConfig.backgroundColor;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">`,
    `  <rect width="${V}" height="${V}" rx="${bgR}" fill="${bgFill}"/>`,
    `  <text x="50" y="54" text-anchor="middle" dominant-baseline="central" font-size="70">${emoji}</text>`,
    `</svg>`,
  ].join('\n');
}
