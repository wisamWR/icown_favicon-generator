import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/* Global range slider fill tracking via CSS custom property */
function updateRangeFill(el: HTMLInputElement) {
  const min = Number(el.min) || 0;
  const max = Number(el.max) || 100;
  const val = Number(el.value);
  const pct = ((val - min) / (max - min)) * 100;
  el.style.setProperty('--range-pct', `${pct}%`);
}
document.addEventListener('input', (e) => {
  const t = e.target as HTMLElement;
  if (t instanceof HTMLInputElement && t.type === 'range') updateRangeFill(t);
});
// Init all existing range inputs after first paint
requestAnimationFrame(() => {
  document.querySelectorAll<HTMLInputElement>('input[type=range]').forEach(updateRangeFill);
});
// Observe DOM for new range inputs
new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node instanceof HTMLElement) {
        node.querySelectorAll<HTMLInputElement>('input[type=range]').forEach(updateRangeFill);
        if (node instanceof HTMLInputElement && node.type === 'range') updateRangeFill(node);
      }
    }
  }
}).observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
