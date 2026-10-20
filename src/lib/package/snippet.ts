export function generateSnippet(options?: {
  themeColor?: string;
  hasSvg?: boolean;
}): string {
  const lines: string[] = [
    '<link rel="icon" type="image/x-icon" href="/favicon.ico" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />',
  ];

  if (options?.hasSvg) {
    lines.push('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
  }

  lines.push(
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
    '<link rel="manifest" href="/site.webmanifest" />',
  );

  if (options?.themeColor) {
    lines.push(`<meta name="theme-color" content="${options.themeColor}" />`);
  }

  return lines.join('\n');
}
