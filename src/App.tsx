import { useState, useEffect, useCallback } from "react";
import type {
  InputMode,
  TextConfig,
  EditorConfig,
  DarkModeConfig,
  SmallIconConfig,
  ContrastResult,
} from "./types";
import {
  renderMasterCanvas,
  renderEmojiToCanvas,
  renderTextToCanvas,
} from "./lib/render/master-canvas";
import { stepDownResize, loadImage } from "./lib/render/resize";
import { buildTextSvg, buildEmojiSvg } from "./lib/render/svg-builder";
import { generateIconPackage } from "./lib/export";
import { analyzeContrast } from "./lib/contrast";
import { extractDominantColors } from "./lib/color-extract";

import ImageInput from "./components/ImageInput";
import EmojiInput from "./components/EmojiInput";
import TextInput from "./components/TextInput";
import EditorControls from "./components/EditorControls";
import DarkModeSettings from "./components/DarkModeSettings";
import SmallIconOptimizer from "./components/SmallIconOptimizer";
import ColorPalette from "./components/ColorPalette";
import PreviewPanel from "./components/PreviewPanel";
import ExportPanel from "./components/ExportPanel";
import AnimatedTools from "./components/AnimatedTools";

/* ================================================================
   localStorage persistence
   ================================================================ */

const STORAGE_KEY = "iconsmith_state";

interface PersistedState {
  inputMode: InputMode;
  imageDataUrl: string | null;
  selectedEmoji: string;
  textConfig: TextConfig;
  editorConfig: EditorConfig;
  darkMode: DarkModeConfig;
  smallIcon: SmallIconConfig;
  appName: string;
  themeColor: string;
}

// Parse once at module load (before component renders) - avoids flash
let _init: Partial<PersistedState> = {};
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) _init = JSON.parse(raw);
} catch {
  /* ignore corrupt data */
}

function init<T>(key: keyof PersistedState, fallback: T): T {
  const v = _init[key];
  return (v !== undefined && v !== null ? v : fallback) as T;
}

/* ================================================================ */

type Page = "generate" | "animate";

const INPUT_TABS: { mode: InputMode; label: string }[] = [
  { mode: "image", label: "Image" },
  { mode: "emoji", label: "Emoji" },
  { mode: "text", label: "Text" },
];

export default function App() {
  const [page, setPage] = useState<Page>("generate");

  /* ---- input ---- */
  const [inputMode, setInputMode] = useState<InputMode>(
    init("inputMode", "text"),
  );
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(
    init("imageDataUrl", null),
  );
  const [selectedEmoji, setSelectedEmoji] = useState(
    init("selectedEmoji", "🔥"),
  );
  const [textConfig, setTextConfig] = useState<TextConfig>(
    init("textConfig", {
      text: "A",
      fontFamily: "system-ui, -apple-system, sans-serif",
      textColor: "#ffffff",
      bgColor: "#4F46E5",
      shape: "rounded" as const,
    }),
  );

  /* ---- editor ---- */
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(
    init("editorConfig", {
      padding: 10,
      backgroundColor: "#ffffff",
      borderRadius: 0,
      transparentBg: false,
    }),
  );

  /* ---- dark mode ---- */
  const [darkMode, setDarkMode] = useState<DarkModeConfig>(
    init("darkMode", {
      enabled: false,
      textColor: "#e0e0e0",
      bgColor: "#312e81",
      editorBg: "#1e1e2e",
    }),
  );

  /* ---- small icon optimizer ---- */
  const [smallIcon, setSmallIcon] = useState<SmallIconConfig>(
    init("smallIcon", {
      brightness: 0,
      contrast: 0,
      sharpen: false,
      pixelSnap: false,
    }),
  );

  /* ---- export ---- */
  const [appName, setAppName] = useState(init("appName", "My App"));
  const [themeColor, setThemeColor] = useState(init("themeColor", "#4F46E5"));
  const [isExporting, setIsExporting] = useState(false);

  /* ---- derived ---- */
  const [masterDataUrl, setMasterDataUrl] = useState<string | null>(null);
  const [maskableDataUrl, setMaskableDataUrl] = useState<string | null>(null);
  const [contrastResults, setContrastResults] = useState<ContrastResult[]>([]);
  const [brandColors, setBrandColors] = useState<string[]>([]);
  const [smallPreviewUrl, setSmallPreviewUrl] = useState<string | null>(null);
  const [smallOriginalUrl, setSmallOriginalUrl] = useState<string | null>(null);

  /* ---- save to localStorage (debounced 500ms) ---- */
  useEffect(() => {
    const timer = setTimeout(() => {
      const state: PersistedState = {
        inputMode,
        imageDataUrl,
        selectedEmoji,
        textConfig,
        editorConfig,
        darkMode,
        smallIcon,
        appName,
        themeColor,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // QuotaExceeded - save without image data
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...state, imageDataUrl: null }),
          );
        } catch {
          /* give up */
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [
    inputMode,
    imageDataUrl,
    selectedEmoji,
    textConfig,
    editorConfig,
    darkMode,
    smallIcon,
    appName,
    themeColor,
  ]);

  /* ---- render master canvas ---- */
  useEffect(() => {
    const update = (source: HTMLCanvasElement | HTMLImageElement) => {
      const master = renderMasterCanvas(source, editorConfig, false);
      setMasterDataUrl(master.toDataURL("image/png"));

      const maskable = renderMasterCanvas(source, editorConfig, true);
      setMaskableDataUrl(maskable.toDataURL("image/png"));

      setContrastResults(analyzeContrast(master));

      // 16px preview: original (no adjustments) + adjusted
      const orig16 = stepDownResize(master, 16, 16);
      setSmallOriginalUrl(orig16.toDataURL("image/png"));

      const adj16 = stepDownResize(master, 16, 16, smallIcon);
      setSmallPreviewUrl(adj16.toDataURL("image/png"));
    };

    if (inputMode === "emoji" && selectedEmoji) {
      update(renderEmojiToCanvas(selectedEmoji));
    } else if (inputMode === "text" && textConfig.text) {
      update(renderTextToCanvas(textConfig));
    } else if (inputMode === "image" && imageDataUrl) {
      const img = new Image();
      img.onload = () => update(img);
      img.src = imageDataUrl;
    } else {
      setMasterDataUrl(null);
      setMaskableDataUrl(null);
      setContrastResults([]);
      setSmallPreviewUrl(null);
      setSmallOriginalUrl(null);
    }
  }, [
    inputMode,
    imageDataUrl,
    selectedEmoji,
    textConfig,
    editorConfig,
    smallIcon,
  ]);

  /* ---- extract brand colors ---- */
  useEffect(() => {
    if (inputMode === "image" && imageDataUrl) {
      extractDominantColors(imageDataUrl).then(setBrandColors);
    } else {
      setBrandColors([]);
    }
  }, [inputMode, imageDataUrl]);

  /* ---- SVG content ---- */
  const hasSvg = inputMode === "text" || inputMode === "emoji";
  const getSvgContent = useCallback((): string | null => {
    if (inputMode === "text")
      return buildTextSvg(
        textConfig,
        editorConfig,
        darkMode.enabled ? darkMode : undefined,
      );
    if (inputMode === "emoji")
      return buildEmojiSvg(
        selectedEmoji,
        editorConfig,
        darkMode.enabled ? darkMode : undefined,
      );
    return null;
  }, [inputMode, textConfig, selectedEmoji, editorConfig, darkMode]);

  /* ---- export ---- */
  const handleExport = useCallback(async () => {
    if (!masterDataUrl || !maskableDataUrl) return;
    setIsExporting(true);
    try {
      const zip = await generateIconPackage({
        masterDataUrl,
        maskableDataUrl,
        svgContent: getSvgContent(),
        appName,
        themeColor,
        smallIconConfig: smallIcon,
      });
      const url = URL.createObjectURL(zip);
      const a = document.createElement("a");
      a.href = url;
      a.download = "iconsmith-icons.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Check console.");
    } finally {
      setIsExporting(false);
    }
  }, [
    masterDataUrl,
    maskableDataUrl,
    getSvgContent,
    appName,
    themeColor,
    smallIcon,
  ]);

  const handleBrandColor = (hex: string) => {
    setThemeColor(hex);
    setEditorConfig((c) => ({ ...c, backgroundColor: hex }));
  };

  /* ================================================================ */
  return (
    <div className="min-h-screen bg-[#0D0B0A] text-[#EBE7E1] flex flex-col">
      <header
        className="border-b border-[#24201C] backdrop-blur-md sticky top-0 z-50 px-6 py-3 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(18,16,14,0.92), rgba(18,16,14,0.85), rgba(18,16,14,0.92)), url('/cow-pattern.jpeg')`,
        }}
      >
        <div className="max-w-[1520px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo_icown.png"
              alt="icown logo"
              className="h-11 w-auto object-contain flex-shrink-0 select-none"
            />
            <h1
              className="text-4xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "BaksoTahu, sans-serif" }}
            >
              icown
            </h1>
          </div>
          <div className="flex p-1 bg-[#1A1715] rounded-xl border border-[#2E2924]">
            {[
              { id: "generate" as Page, label: "Generate" },
              { id: "animate" as Page, label: "Animate" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPage(t.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  page === t.id
                    ? "bg-[#ec4899]/20 text-[#fbcfe8] border border-[#f472b6] shadow-sm"
                    : "text-[#9E9385] hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {page === "generate" && (
        <main className="flex-1 max-w-[1520px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div>
              <div className="bg-[#171412] p-1 rounded-xl border border-[#2B2621] flex text-xs font-medium">
                {INPUT_TABS.map((tab) => (
                  <button
                    key={tab.mode}
                    onClick={() => setInputMode(tab.mode)}
                    className={`flex-1 py-1.5 rounded-lg transition ${
                      inputMode === tab.mode
                        ? "bg-[#2B2420] text-[#fbcfe8] border border-[#ec4899]/30 shadow font-semibold"
                        : "text-[#94897B] hover:text-white transition"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                {inputMode === "image" && (
                  <ImageInput onImageChange={setImageDataUrl} />
                )}
                {inputMode === "emoji" && (
                  <EmojiInput
                    value={selectedEmoji}
                    onChange={setSelectedEmoji}
                  />
                )}
                {inputMode === "text" && (
                  <TextInput config={textConfig} onChange={setTextConfig} />
                )}
              </div>
            </div>

            <EditorControls config={editorConfig} onChange={setEditorConfig} />
            <DarkModeSettings
              config={darkMode}
              inputMode={inputMode}
              onChange={setDarkMode}
            />
            <SmallIconOptimizer
              config={smallIcon}
              onChange={setSmallIcon}
              previewDataUrl={smallPreviewUrl}
              originalPreviewUrl={smallOriginalUrl}
            />
            <ColorPalette
              colors={brandColors}
              onSelectColor={handleBrandColor}
            />
          </div>

          {/* Center */}
          <div className="lg:col-span-8 xl:col-span-5">
            <PreviewPanel
              masterDataUrl={masterDataUrl}
              maskableDataUrl={maskableDataUrl}
              contrastResults={contrastResults}
              appName={appName}
            />
          </div>

          {/* Right */}
          <div className="lg:col-span-12 xl:col-span-4">
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
      )}

      {page === "animate" && <AnimatedTools masterDataUrl={masterDataUrl} />}
    </div>
  );
}
