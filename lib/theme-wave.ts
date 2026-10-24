import type { HeroCat } from "@/components/CatSelector";

/** Everything painted from the theme tokens — the whole palette follows the selected cat. */
const THEMED = [
  "body",
  "footer",
  '[class*="cookie-button"]',
  '[class*="primary"]',
  '[class*="secondary"]',
  '[class*="tertiary"]',
  '[class*="surface"]',
  '[class*="outline"]',
  ".welcome-status-card",
  ".module-launcher",
].join(", ");
const FADE_MS = 220;
const MAX_DELAY_MS = 260;
const PX_PER_MS = 3.2;

let clearTimer: number | undefined;

/** Switch the gender theme as a wave: surfaces nearest `origin` recolour first. */
export function applyGenderTheme(next: HeroCat, origin: Element | null) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !origin) {
    root.dataset.genderTheme = next;
    return;
  }

  const o = origin.getBoundingClientRect();
  const ox = o.left + o.width / 2;
  const oy = o.top + o.height / 2;

  const touched: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>(THEMED).forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const dist = Math.hypot(r.left + r.width / 2 - ox, r.top + r.height / 2 - oy);
    const delay = `${Math.min(dist / PX_PER_MS, MAX_DELAY_MS)}ms`;
    el.style.transition = ["background-color", "color", "border-color", "fill"]
      .map((property) => `${property} ${FADE_MS}ms ease ${delay}`)
      .join(", ");
    touched.push(el);
  });

  root.dataset.genderTheme = next;

  window.clearTimeout(clearTimer);
  clearTimer = window.setTimeout(() => {
    touched.forEach((el) => el.style.removeProperty("transition"));
  }, FADE_MS + MAX_DELAY_MS + 80);
}
