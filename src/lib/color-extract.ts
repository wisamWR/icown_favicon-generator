/**
 * Extract dominant colors from an image via histogram bucketing.
 * Runs on a 64×64 down-sample for speed.
 */
export function extractDominantColors(
  imageDataUrl: string,
  count = 5,
): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const S = 64;
      canvas.width = S;
      canvas.height = S;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, S, S);
      const data = ctx.getImageData(0, 0, S, S).data;

      const map = new Map<string, number>();
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        map.set(key, (map.get(key) || 0) + 1);
      }

      const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
      const result: string[] = [];

      for (const [key] of sorted) {
        if (result.length >= count) break;
        const [r, g, b] = key.split(',').map(Number);
        const hex =
          '#' +
          [r, g, b]
            .map((c) =>
              Math.min(255, c)
                .toString(16)
                .padStart(2, '0'),
            )
            .join('');

        const tooSimilar = result.some((ex) => {
          const er = parseInt(ex.slice(1, 3), 16);
          const eg = parseInt(ex.slice(3, 5), 16);
          const eb = parseInt(ex.slice(5, 7), 16);
          return Math.abs(r - er) + Math.abs(g - eg) + Math.abs(b - eb) < 80;
        });
        if (!tooSimilar) result.push(hex);
      }
      resolve(result);
    };
    img.onerror = () => resolve([]);
    img.src = imageDataUrl;
  });
}
