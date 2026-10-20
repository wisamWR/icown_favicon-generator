export type InputMode = 'image' | 'emoji' | 'text';
export type TextShape = 'square' | 'circle' | 'rounded';
export type Framework = 'generic' | 'nextjs' | 'vite' | 'astro' | 'laravel' | 'wordpress';
export type MaskShape = 'circle' | 'squircle' | 'rounded-square' | 'square';
export type AnimToolType = 'badge' | 'progress' | 'timer' | 'animate';

export interface TextConfig {
  text: string;
  fontFamily: string;
  textColor: string;
  bgColor: string;
  shape: TextShape;
}

export interface DarkModeConfig {
  enabled: boolean;
  textColor: string;
  bgColor: string;
  editorBg: string;
}

export interface EditorConfig {
  padding: number;        // 0–50 (%)
  backgroundColor: string; // hex
  borderRadius: number;   // 0–50 (%)
  transparentBg: boolean;
}

export interface SmallIconConfig {
  brightness: number;  // -50 to 50
  contrast: number;    // -50 to 50
  sharpen: boolean;
  pixelSnap: boolean;
}

export interface IconFile {
  name: string;
  data: Blob | string;
}

export interface ContrastResult {
  ratio: number;
  level: 'good' | 'warning' | 'poor';
  context: string;
  suggestion?: string;
}
