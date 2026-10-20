import type { TextConfig, EditorConfig, DarkModeConfig } from "../../types";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildTextSvg(
  textConfig: TextConfig,
  editorConfig: EditorConfig,
  darkMode?: DarkModeConfig,
): string {
  const V = 100;
  const pad = (editorConfig.padding / 100) * V;
  const cs = V - pad * 2;
  const bgR = (editorConfig.borderRadius / 100) * (V / 2);
  const bgFill = editorConfig.transparentBg
    ? "none"
    : editorConfig.backgroundColor;
  const cx = V / 2;
  const cy = V / 2;
  const fontSize = cs * 0.5;

  // shape element
  let shapeEl: string;
  if (textConfig.shape === "circle") {
    shapeEl = `<circle class="shape" cx="${cx}" cy="${cy}" r="${cs / 2}"/>`;
  } else if (textConfig.shape === "rounded") {
    shapeEl = `<rect class="shape" x="${pad}" y="${pad}" width="${cs}" height="${cs}" rx="${cs * 0.15}"/>`;
  } else {
    shapeEl = `<rect class="shape" x="${pad}" y="${pad}" width="${cs}" height="${cs}"/>`;
  }

  // dark mode CSS
  let styleBlock = "";
  if (darkMode?.enabled) {
    styleBlock = `
  <style>
    .bg   { fill: ${bgFill}; }
    .shape { fill: ${textConfig.bgColor}; }
    .label { fill: ${textConfig.textColor}; }
    @media (prefers-color-scheme: dark) {
      .bg   { fill: ${darkMode.editorBg}; }
      .shape { fill: ${darkMode.bgColor}; }
      .label { fill: ${darkMode.textColor}; }
    }
  </style>`;
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">`,
      styleBlock,
      `  <rect class="bg" width="${V}" height="${V}" rx="${bgR}"/>`,
      `  ${shapeEl}`,
      `  <text class="label" x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"`,
      `        font-family="${escapeXml(textConfig.fontFamily)}" font-weight="bold"`,
      `        font-size="${fontSize}">${escapeXml(textConfig.text)}</text>`,
      `</svg>`,
    ].join("\n");
  }

  // no dark mode - inline fills
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">`,
    `  <rect width="${V}" height="${V}" rx="${bgR}" fill="${bgFill}"/>`,
    `  ${shapeEl.replace('class="shape"', `fill="${textConfig.bgColor}"`)}`,
    `  <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"`,
    `        font-family="${escapeXml(textConfig.fontFamily)}" font-weight="bold"`,
    `        font-size="${fontSize}" fill="${textConfig.textColor}">${escapeXml(textConfig.text)}</text>`,
    `</svg>`,
  ].join("\n");
}

export function buildEmojiSvg(
  emoji: string,
  editorConfig: EditorConfig,
  darkMode?: DarkModeConfig,
): string {
  const V = 100;
  const bgR = (editorConfig.borderRadius / 100) * (V / 2);
  const bgFill = editorConfig.transparentBg
    ? "none"
    : editorConfig.backgroundColor;

  if (darkMode?.enabled) {
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">`,
      `  <style>`,
      `    .bg { fill: ${bgFill}; }`,
      `    @media (prefers-color-scheme: dark) { .bg { fill: ${darkMode.editorBg}; } }`,
      `  </style>`,
      `  <rect class="bg" width="${V}" height="${V}" rx="${bgR}"/>`,
      `  <text x="50" y="54" text-anchor="middle" dominant-baseline="central" font-size="70">${emoji}</text>`,
      `</svg>`,
    ].join("\n");
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">`,
    `  <rect width="${V}" height="${V}" rx="${bgR}" fill="${bgFill}"/>`,
    `  <text x="50" y="54" text-anchor="middle" dominant-baseline="central" font-size="70">${emoji}</text>`,
    `</svg>`,
  ].join("\n");
}
