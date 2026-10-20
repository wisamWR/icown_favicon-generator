<p align="center">
  <img src="public/logo_icown.png" alt="icown logo" width="160" />
</p>

<h1 align="center">icown</h1>

<p align="center">
  <strong>Favicon & App Icon Generator</strong><br/>
  Generate pixel-perfect favicons, app icons, and PWA assets - entirely in your browser.<br/>
  No uploads. No servers. No tracking. Just icons.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-18.3-61dafb?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5.6-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-6-646cff?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwind-4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

---

## Why icown?

Most favicon generators require uploading your image to a server, waiting for processing, and downloading results. **icown** does everything client-side using the Canvas 2D API - your images never leave your browser.

It generates every format you need in one click: ICO, PNG (all standard sizes), SVG with dark mode support, maskable icons for Android, and a complete web manifest - all packaged in a ZIP with framework-specific code snippets.

---

## Features

### Input Modes

| Mode      | Description                                                                                   |
| --------- | --------------------------------------------------------------------------------------------- |
| **Image** | Drag & drop, click to browse, or paste from clipboard. Supports PNG, JPG, SVG, WebP           |
| **Emoji** | Pick from 50 popular emojis or type any emoji directly                                        |
| **Text**  | Type initials or short text with customizable font, colors, and shape (square/rounded/circle) |

### Editor Controls

- **Padding** - Adjust spacing around icon content (0-45%)
- **Background Color** - Solid color or transparent
- **Corner Radius** - From sharp square to full circle
- **SVG Dark Mode** - Automatic color switching via CSS `@media (prefers-color-scheme: dark)` (Text & Emoji inputs)

### Preview System

See your icon in every real-world context before exporting:

- **Browser Tabs** - Chrome (light & dark), Firefox, Safari address bar
- **Home Screen** - iOS (rounded square) and Android (circle) with app name
- **Android Adaptive Masks** - Circle, squircle, rounded square, square with safe-zone overlay
- **Google SERP** - How your favicon appears in search results
- **Social Link Preview** - OpenGraph card mockup
- **All Sizes** - Side-by-side 16px through 512px comparison
- **WCAG Contrast Check** - Automatic analysis with ratio scores and fix suggestions

### Small Icon Optimizer

Icons that look great at 512px can turn to mush at 16px. The optimizer lets you:

- Adjust **brightness** and **contrast** for small sizes only
- Enable **sharpening** (unsharp mask) for crisp edges
- Toggle **pixel snapping** to align to the pixel grid
- Compare **before/after** at 16px and 32px zoom

### Export Package

One click generates a complete ZIP containing:

```
favicon.ico          - Multi-size ICO (16, 32, 48px)
favicon.svg          - Scalable with optional dark mode
favicon-16x16.png    - Standard DPI
favicon-32x32.png    - High DPI
apple-touch-icon.png - iOS home screen (180x180)
icon-192.png         - PWA icon
icon-512.png         - PWA splash
icon-maskable-192.png - Android adaptive
icon-maskable-512.png - Android adaptive
site.webmanifest     - PWA manifest
```

### Framework Snippets

Ready-to-paste integration code for:

| Framework                | Output                                     |
| ------------------------ | ------------------------------------------ |
| **Generic HTML**         | Standard `<link>` and `<meta>` tags        |
| **Next.js (App Router)** | `metadata` export in `layout.tsx`          |
| **Vite / React**         | Index HTML head tags + public folder paths |
| **Astro**                | `<head>` partial for layouts               |
| **Laravel**              | Blade `@section` template                  |
| **WordPress**            | `functions.php` hook with `wp_head`        |

### Animated Favicons

Generate JavaScript snippets for dynamic favicon effects:

- **Badge** - Notification count overlay (position, size, colors configurable)
- **Progress** - Circle or bar progress indicator
- **Timer** - Countdown display with ring or text style
- **Animation** - Frame-by-frame favicon rotation

All snippets include `prefers-reduced-motion` guard and pause when the tab is hidden.

### Brand Color Extraction

Upload an image and icown automatically extracts dominant colors using histogram bucketing. Click any swatch to apply as theme color or icon background.

---

## Tech Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| UI Framework     | React 18                                 |
| Language         | TypeScript 5.6                           |
| Build Tool       | Vite 6                                   |
| Styling          | Tailwind CSS v4                          |
| ZIP Generation   | JSZip                                    |
| Image Processing | Canvas 2D API                            |
| ICO Encoding     | Custom encoder (ICONDIR + embedded PNGs) |
| Deployment       | Static - any CDN/host                    |

---

## Project Structure

```
src/
  App.tsx                    - Main app with state management & localStorage persistence
  components/
    ImageInput.tsx            - Drag/drop/paste image input
    EmojiInput.tsx            - Emoji picker grid
    TextInput.tsx             - Text/initials with font & color config
    EditorControls.tsx        - Padding, background, corner radius
    DarkModeSettings.tsx      - SVG dark mode color overrides
    SmallIconOptimizer.tsx    - 16-48px brightness/contrast/sharpen
    PreviewPanel.tsx          - Multi-context preview (tabs, home screen, SERP, etc.)
    ExportPanel.tsx           - Export config, framework snippets, download
    AnimatedTools.tsx         - Badge/progress/timer/animation snippet generator
    ContrastWarning.tsx       - WCAG contrast ratio cards
    ColorPalette.tsx          - Extracted brand color swatches
    BrowserInfo.tsx           - File guide & browser behavior reference
  lib/
    render/
      master-canvas.ts        - Core 1024x1024 canvas rendering
      resize.ts               - Step-down resize with sharpen/pixel-snap
      ico.ts                  - Custom ICO file encoder
      svg-builder.ts          - SVG favicon with dark mode CSS
    export.ts                 - Full icon package ZIP generation
    contrast.ts               - WCAG contrast analysis
    color-extract.ts           - Dominant color extraction
    snippet-frameworks.ts      - Framework-specific code snippets
    animated-snippets.ts       - JS snippet generators for animated favicons
  types.ts                    - Shared TypeScript type definitions
public/
  fonts/                      - Custom fonts (BaksoTahu, BaksoSapi)
  logo_icown.png              - App logo
  cow-pattern.jpeg            - Header background texture
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How It Works

1. **Input** - User provides an image, emoji, or text
2. **Render** - Canvas 2D draws the source onto a 1024x1024 master canvas with padding, background, and border radius
3. **Preview** - Master canvas data URL feeds into all preview contexts
4. **Optimize** - Small icon optimizer applies brightness/contrast/sharpen adjustments during step-down resize (only for sizes ≤48px)
5. **Export** - Master canvas is resized to each target size, encoded as PNG (and ICO via custom encoder), bundled with SVG and manifest into a ZIP via JSZip
6. **Persist** - All settings auto-save to localStorage with 500ms debounce

Everything runs in the browser. Zero network requests for processing.

---

## License

MIT
