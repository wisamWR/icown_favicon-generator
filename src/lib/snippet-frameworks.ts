import type { Framework } from '../types';

interface Opts {
  themeColor?: string;
  hasSvg?: boolean;
  appName?: string;
}

export const FRAMEWORK_META: Record<Framework, { label: string; desc: string }> = {
  generic:   { label: 'Generic HTML',    desc: 'Standard <head> tags' },
  nextjs:    { label: 'Next.js (App)',    desc: 'app/layout.tsx metadata' },
  vite:      { label: 'Vite',            desc: 'index.html + public/' },
  astro:     { label: 'Astro',           desc: 'Layout + public/' },
  laravel:   { label: 'Laravel Blade',   desc: 'Blade layout + public/' },
  wordpress: { label: 'WordPress',       desc: 'functions.php' },
};

export function generateFrameworkSnippet(
  fw: Framework,
  o: Opts = {},
): { code: string; lang: string; instructions: string; paths: string[] } {
  const tc = o.themeColor || '#ffffff';
  const svg = o.hasSvg;
  const name = o.appName || 'My App';

  switch (fw) {
    case 'nextjs':
      return {
        lang: 'tsx',
        paths: ['app/favicon.ico', svg ? 'app/icon.svg' : 'app/icon.png', 'app/apple-icon.png',
                'public/icon-192.png', 'public/icon-512.png', 'public/icon-maskable-192.png', 'public/icon-maskable-512.png'],
        instructions: 'Place files in app/ and public/. Next.js generates <head> tags automatically.',
        code:
`// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${name}',
  manifest: '/site.webmanifest',
  themeColor: '${tc}',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },${svg ? "\n      { url: '/icon.svg', type: 'image/svg+xml' }," : ''}
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};`,
      };

    case 'vite':
      return {
        lang: 'html',
        paths: ['public/favicon.ico', ...(svg ? ['public/favicon.svg'] : []),
                'public/favicon-16x16.png', 'public/favicon-32x32.png',
                'public/apple-touch-icon.png', 'public/icon-192.png', 'public/icon-512.png',
                'public/icon-maskable-192.png', 'public/icon-maskable-512.png', 'public/site.webmanifest'],
        instructions: 'Place all files in public/. Add tags to index.html <head>.',
        code:
`<!-- index.html -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />${svg ? '\n<link rel="icon" type="image/svg+xml" href="/favicon.svg" />' : ''}
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="${tc}" />`,
      };

    case 'astro':
      return {
        lang: 'astro',
        paths: ['public/favicon.ico', ...(svg ? ['public/favicon.svg'] : []),
                'public/apple-touch-icon.png', 'public/icon-192.png', 'public/icon-512.png',
                'public/icon-maskable-192.png', 'public/icon-maskable-512.png', 'public/site.webmanifest'],
        instructions: 'Place files in public/. Add tags to your Layout component <head>.',
        code:
`---
// src/layouts/Layout.astro
---
<head>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />${svg ? '\n  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />' : ''}
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="${tc}" />
</head>`,
      };

    case 'laravel':
      return {
        lang: 'php',
        paths: ['public/favicon.ico', ...(svg ? ['public/favicon.svg'] : []),
                'public/apple-touch-icon.png', 'public/icon-192.png', 'public/icon-512.png', 'public/site.webmanifest'],
        instructions: 'Place files in public/. Add to Blade layout <head>.',
        code:
`{{-- resources/views/layouts/app.blade.php --}}
<link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />${svg ? "\n<link rel=\"icon\" type=\"image/svg+xml\" href=\"{{ asset('favicon.svg') }}\" />" : ''}
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}" />
<link rel="manifest" href="{{ asset('site.webmanifest') }}" />
<meta name="theme-color" content="${tc}" />`,
      };

    case 'wordpress':
      return {
        lang: 'php',
        paths: ['favicon.ico', ...(svg ? ['favicon.svg'] : []),
                'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest'],
        instructions: 'Add to functions.php or use Customizer > Site Identity.',
        code:
`<?php // functions.php
function iconsmith_favicons() { ?>
  <link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico" />${svg ? '\n  <link rel="icon" type="image/svg+xml" href="<?php echo get_template_directory_uri(); ?>/favicon.svg" />' : ''}
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/apple-touch-icon.png" />
  <link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/site.webmanifest" />
  <meta name="theme-color" content="${tc}" />
<?php }
add_action('wp_head', 'iconsmith_favicons');`,
      };

    default:
      return {
        lang: 'html',
        paths: ['favicon.ico', ...(svg ? ['favicon.svg'] : []),
                'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png',
                'icon-192.png', 'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png',
                'site.webmanifest'],
        instructions: 'Place files in site root. Add tags to <head>.',
        code:
`<link rel="icon" type="image/x-icon" href="/favicon.ico" />${svg ? '\n<link rel="icon" type="image/svg+xml" href="/favicon.svg" />' : ''}
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="${tc}" />`,
      };
  }
}
