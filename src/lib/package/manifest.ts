export function generateManifest(options: {
  name?: string;
  themeColor?: string;
}): string {
  return JSON.stringify(
    {
      name: options.name || 'My App',
      short_name: options.name || 'App',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      theme_color: options.themeColor || '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
    },
    null,
    2,
  );
}
