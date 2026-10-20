export type InputMode = 'image' | 'emoji' | 'text';
export type TextShape = 'square' | 'circle' | 'rounded';

export interface TextConfig {
  text: string;
  fontFamily: string;
  textColor: string;
  bgColor: string;
  shape: TextShape;
}

export interface EditorConfig {
  padding: number;        // 0–50 (%)
  backgroundColor: string; // hex
  borderRadius: number;   // 0–50 (%)
  transparentBg: boolean;
}

export interface IconFile {
  name: string;
  data: Blob | string;
}
