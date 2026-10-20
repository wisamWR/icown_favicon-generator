/* ------------------------------------------------------------------
   Generates self-contained JavaScript snippets users paste into their
   projects.  Each snippet includes a prefers-reduced-motion guard.
   ------------------------------------------------------------------ */

// ---- Badge notification ----
export interface BadgeOpts {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  bgColor: string;
  textColor: string;
  size: number; // 6–14 px on a 32×32 canvas
}

export function badgeSnippet(opts: BadgeOpts): string {
  const { position, bgColor, textColor, size } = opts;
  const posMap: Record<string, string> = {
    "top-right": `const bx = S - r - 1, by = r + 1;`,
    "top-left": `const bx = r + 1, by = r + 1;`,
    "bottom-right": `const bx = S - r - 1, by = S - r - 1;`,
    "bottom-left": `const bx = r + 1, by = S - r - 1;`,
  };
  return `// Favicon badge notification - paste in your app
(function faviconBadge() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  const S = 32, r = ${size / 2};

  function setBadge(count) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = link.dataset.originalHref || link.href;
    img.onload = function () {
      if (!link.dataset.originalHref) link.dataset.originalHref = link.href;
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, S, S);
      if (count > 0) {
        ${posMap[position]}
        ctx.fillStyle = '${bgColor}';
        ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '${textColor}';
        ctx.font = 'bold ' + (r * 1.2) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(count > 99 ? '99+' : String(count), bx, by);
      }
      link.href = c.toDataURL('image/png');
    };
  }

  window.setFaviconBadge = setBadge;
})();
// Usage: setFaviconBadge(5);  setFaviconBadge(0) to clear.`;
}

// ---- Progress ring / bar ----
export interface ProgressOpts {
  style: "circle" | "bar";
  color: string;
  trackColor: string;
  width: number; // stroke width 2–6
}

export function progressSnippet(opts: ProgressOpts): string {
  if (opts.style === "bar") {
    return `// Favicon progress bar - paste in your app
(function faviconProgress() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  const S = 32;

  function setProgress(pct) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = link.dataset.originalHref || link.href;
    img.onload = function () {
      if (!link.dataset.originalHref) link.dataset.originalHref = link.href;
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, S, S);
      // track
      ctx.fillStyle = '${opts.trackColor}';
      ctx.fillRect(0, S - ${opts.width}, S, ${opts.width});
      // fill
      ctx.fillStyle = '${opts.color}';
      ctx.fillRect(0, S - ${opts.width}, S * Math.min(1, pct / 100), ${opts.width});
      link.href = c.toDataURL('image/png');
    };
  }

  window.setFaviconProgress = setProgress;
})();
// Usage: setFaviconProgress(42);  // 0-100`;
  }

  return `// Favicon progress circle - paste in your app
(function faviconProgress() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  const S = 32, lw = ${opts.width};

  function setProgress(pct) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = link.dataset.originalHref || link.href;
    img.onload = function () {
      if (!link.dataset.originalHref) link.dataset.originalHref = link.href;
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, S, S);
      const cx = S / 2, cy = S / 2, r = S / 2 - lw;
      // track
      ctx.strokeStyle = '${opts.trackColor}';
      ctx.lineWidth = lw;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      // arc
      ctx.strokeStyle = '${opts.color}';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (pct / 100) * Math.PI * 2);
      ctx.stroke();
      link.href = c.toDataURL('image/png');
    };
  }

  window.setFaviconProgress = setProgress;
})();
// Usage: setFaviconProgress(42);  // 0-100`;
}

// ---- Timer / countdown ----
export interface TimerOpts {
  bgColor: string;
  textColor: string;
  ringColor: string;
  style: "text" | "ring";
}

export function timerSnippet(opts: TimerOpts): string {
  return `// Favicon countdown timer - paste in your app
(function faviconTimer() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  const S = 32;
  let intervalId = null;

  function draw(remaining) {
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '${opts.bgColor}';
    ctx.fillRect(0, 0, S, S);
${
  opts.style === "ring"
    ? `    // ring
    const pct = remaining / (window._faviconTimerTotal || remaining);
    ctx.strokeStyle = '${opts.ringColor}';
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(S/2, S/2, S/2 - 3, -Math.PI/2, -Math.PI/2 + pct * Math.PI * 2);
    ctx.stroke();`
    : ""
}
    // text
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    ctx.fillStyle = '${opts.textColor}';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(m + ':' + String(s).padStart(2, '0'), S/2, S/2);
    link.href = c.toDataURL('image/png');
  }

  function start(seconds) {
    if (intervalId) clearInterval(intervalId);
    window._faviconTimerTotal = seconds;
    let rem = seconds;
    draw(rem);
    intervalId = setInterval(function () {
      rem--;
      if (rem < 0) { clearInterval(intervalId); return; }
      draw(rem);
    }, 1000);
  }

  function stop() { if (intervalId) clearInterval(intervalId); }

  window.startFaviconTimer = start;
  window.stopFaviconTimer = stop;
})();
// Usage: startFaviconTimer(300);  // 5-minute countdown
//        stopFaviconTimer();`;
}

// ---- Custom frame animation ----
export interface AnimateOpts {
  interval: number; // ms 100-2000
}

export function animateSnippet(opts: AnimateOpts): string {
  return `// Animated favicon (frame rotation) - paste in your app
(function faviconAnimate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  let frames = [];
  let i = 0;
  let intervalId = null;

  // Stop when tab is hidden to save resources
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && intervalId) {
      clearInterval(intervalId); intervalId = null;
    } else if (!document.hidden && frames.length > 1) {
      start();
    }
  });

  function start() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(function () {
      link.href = frames[i % frames.length];
      i++;
    }, ${opts.interval});
  }

  /**
   * @param {string[]} urls - array of image data-URLs or paths
   */
  function setFrames(urls) {
    frames = urls;
    i = 0;
    if (frames.length > 1) start();
    else if (frames.length === 1) link.href = frames[0];
  }

  window.setFaviconFrames = setFrames;
})();
// Usage: setFaviconFrames([dataUrl1, dataUrl2, dataUrl3]);`;
}
