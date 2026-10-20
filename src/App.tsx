import { useState, useEffect, useCallback } from 'react';
import type { InputMode, TextConfig, EditorConfig } from './types';
import {
  renderMasterCanvas,
  renderEmojiToCanvas,
  renderTextToCanvas,
} from './lib/render/master-canvas';
import { buildTextSvg, buildEmojiSvg } from './lib/render/svg-builder';
import { generateIconPackage } from './lib/export';

import ImageInput from './components/ImageInput';
import EmojiInput from './components/EmojiInput';
import TextInput from './components/TextInput';
import EditorControls from './components/EditorControls';
import PreviewPanel from './components/PreviewPanel';
import ExportPanel from './components/ExportPanel';

const INPUT_TABS: { mode: InputMode; label: string }[] = [
  { mode: 'image', label: 'Image' },
  { mode: 'emoji', label: 'Emoji' },
  { mode: 'text', label: 'Text' },
];

export default function App() {
  /* ---- input state ---- */
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [textConfig, setTextConfig] = useState<TextConfig>({
    text: 'A',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textColor: '#ffffff',
    bgColor: '#4F46E5',
    shape: 'rounded',
  });

  /* ---- editor state ---- */
  const [editorConfig, setEditorConfig] = useState<EditorConfig>({
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    transparentBg: false,
  });

  /* ---- export state ---- */
  const [appName, setAppName] = useState('My App');
  const [themeColor, setThemeColor] = useState('#4F46E5');
  const [isExporting, setIsExporting] = useState(false);

  /* ---- derived canvases ---- */
  const [masterDataUrl, setMasterDataUrl] = useState<string | null>(null);
  const [maskableDataUrl, setMaskableDataUrl] = useState<string | null>(null);

  /* ---- render master canvas whenever inputs change ---- */
  useEffect(() => {
    const updateMaster = (source: HTMLCanvasElement | HTMLImageElement) => {
      const master = renderMasterCanvas(source, editorConfig, false);
      setMasterDataUrl(master.toDataURL('image/png'));
      const maskable = renderMasterCanvas(source, editorConfig, true);
      setMaskableDataUrl(maskable.toDataURL('image/png'));
    };

    if (inputMode === 'emoji' && selectedEmoji) {
      updateMaster(renderEmojiToCanvas(selectedEmoji));
    } else if (inputMode === 'text' && textConfig.text) {
      updateMaster(renderTextToCanvas(textConfig));
    } else if (inputMode === 'image' && imageDataUrl) {
      const img = new Image();
      img.onload = () => updateMaster(img);
      img.src = imageDataUrl;
    } else {
      setMasterDataUrl(null);
      setMaskableDataUrl(null);
    }
  }, [inputMode, imageDataUrl, selectedEmoji, textConfig, editorConfig]);

  /* ---- SVG content (for text/emoji favicons) ---- */
  const hasSvg = inputMode === 'text' || inputMode === 'emoji';
  const getSvgContent = useCallback((): string | null => {
    if (inputMode === 'text') return buildTextSvg(textConfig, editorConfig);
    if (inputMode === 'emoji') return buildEmojiSvg(selectedEmoji, editorConfig);
    return null;
  }, [inputMode, textConfig, selectedEmoji, editorConfig]);

  /* ---- export handler ---- */
  const handleExport = useCallback(async () => {
    if (!masterDataUrl || !maskableDataUrl) return;
    setIsExporting(true);
    try {
      const zipBlob = await generateIconPackage({
        masterDataUrl,
        maskableDataUrl,
        svgContent: getSvgContent(),
        appName,
        themeColor,
      });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iconsmith-icons.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  }, [masterDataUrl, maskableDataUrl, getSvgContent, appName, themeColor]);

  /* ---- render ---- */
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800 px-6 py-4">
        <h1 className="text-xl font-bold">
          IconSmith
          <span className="text-neutral-500 font-normal text-sm ml-2">
            Favicon & App Icon Generator
          </span>
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---- Left column: Input + Editor ---- */}
        <div className="space-y-6">
          {/* Input mode tabs */}
          <div>
            <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
              {INPUT_TABS.map((tab) => (
                <button
                  key={tab.mode}
                  onClick={() => setInputMode(tab.mode)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    inputMode === tab.mode
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input content */}
            <div className="mt-3">
              {inputMode === 'image' && (
                <ImageInput onImageChange={setImageDataUrl} />
              )}
              {inputMode === 'emoji' && (
                <EmojiInput value={selectedEmoji} onChange={setSelectedEmoji} />
              )}
              {inputMode === 'text' && (
                <TextInput config={textConfig} onChange={setTextConfig} />
              )}
            </div>
          </div>

          {/* Editor controls */}
          <EditorControls config={editorConfig} onChange={setEditorConfig} />
        </div>

        {/* ---- Center column: Preview ---- */}
        <div>
          <PreviewPanel
            masterDataUrl={masterDataUrl}
            maskableDataUrl={maskableDataUrl}
          />
        </div>

        {/* ---- Right column: Export ---- */}
        <div>
          <ExportPanel
            appName={appName}
            themeColor={themeColor}
            hasSvg={hasSvg}
            canExport={!!masterDataUrl}
            isExporting={isExporting}
            onAppNameChange={setAppName}
            onThemeColorChange={setThemeColor}
            onExport={handleExport}
          />
        </div>
      </main>
    </div>
  );
}
