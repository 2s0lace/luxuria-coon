"use client";

import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FIRST_FRAME_PHOTOS } from "@/lib/cats";
import { useLanguage } from "@/lib/i18n";
import { useModuleNavigation } from "@/lib/module-navigation";
import type { ModuleKey } from "@/lib/modules";
// Imported up front: a lazy chunk would show a loading line and swap in the content mid-morph.
import ModuleWorkspace from "./ModuleWorkspace";

/** M3 emphasized easing — one curve for size, corners, colour and content, so they move as one shape. */
const EASE = "cubic-bezier(0.2, 0, 0, 1)";
const EASE_EXIT = "cubic-bezier(0.3, 0, 0.8, 0.15)";
const OPEN_MS = 520;
const CLOSE_MS = 420;
/** Card corner radius at rest (--md-shape-xl). */
const CARD_RADIUS = 28;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The visible tile the module was opened from — the popup grows out of it and shrinks back into it. */
function findTrigger(module: ModuleKey) {
  for (const el of Array.from(document.querySelectorAll<HTMLElement>(`[data-module-launcher="${module}"]`))) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) return el;
  }
  return null;
}

/*
 * Shape morph rules (a circle has to turn into a square smoothly):
 * 1. Corner radii are clamped to what is actually drawn — at most half the shorter side.
 *    A pill's `9999px` would otherwise stay round for most of the animation and snap
 *    square at the end; clamped, the corner shrinks evenly the whole way.
 * 2. Size and corners morph through clip-path with px radii, never through scale(),
 *    which would stretch the corners into ellipses. No overshoot: the card's own box
 *    would cut it off and the motion would stop dead.
 * 3. The content rides the shape: the tile's face grows with it and fades out, the
 *    card's content is scaled uniformly by the width ratio and fades in.
 */
function drawnRadius(el: Element, r: DOMRect) {
  const raw = getComputedStyle(el).borderTopLeftRadius;
  const px = raw.endsWith("%") ? (parseFloat(raw) / 100) * Math.min(r.width, r.height) : parseFloat(raw);
  return Math.min(px || 0, r.width / 2, r.height / 2);
}

type Morph = {
  /** Tile position relative to the card. */
  x: number;
  y: number;
  /** Tile width ÷ card width — the uniform scale content uses to ride the shape. */
  scale: number;
  tileClip: string;
  cardClip: string;
  tileColor: string;
  cardColor: string;
};

/*
 * A tile can sit partly outside the card's box (the right column on a narrow card). The card
 * would cut it off there: its background and overflow end at its own box. While morphing the
 * surface lets content overflow and paints its colour as a huge spread shadow — the clip-path
 * alone draws the shape, wherever the tile is.
 */
const paint = (color: string) => ({ backgroundColor: color, boxShadow: `0 0 0 200vmax ${color}` });

function measureMorph(card: DOMRect, cardEl: Element, tile: HTMLElement): Morph {
  const r = tile.getBoundingClientRect();
  const x = r.left - card.left;
  const y = r.top - card.top;
  return {
    x,
    y,
    scale: r.width / card.width,
    tileClip: `inset(${y}px ${card.right - r.right}px ${card.bottom - r.bottom}px ${x}px round ${drawnRadius(tile, r)}px)`,
    cardClip: `inset(0px 0px 0px 0px round ${Math.min(CARD_RADIUS, card.width / 2, card.height / 2)}px)`,
    tileColor: getComputedStyle(tile).backgroundColor,
    cardColor: getComputedStyle(cardEl).backgroundColor,
  };
}

/** A non-interactive copy of the tile's face, placed over the tile's spot inside the card. */
function tileGhost(tile: HTMLElement, m: Morph) {
  const r = tile.getBoundingClientRect();
  const ghost = tile.cloneNode(true) as HTMLElement;
  ghost.removeAttribute("data-module-launcher");
  ghost.removeAttribute("id");
  ghost.setAttribute("aria-hidden", "true");
  ghost.tabIndex = -1;
  ghost.classList.add("module-sheet-ghost");
  Object.assign(ghost.style, {
    left: `${m.x}px`,
    top: `${m.y}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  });
  return ghost;
}

export default function ModuleSheet() {
  const { t } = useLanguage();
  const { activeModule, openModule } = useModuleNavigation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  /** The card itself (background + clip); the dialog around it only carries the shadow. */
  const surfaceRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  /** The tile that turned into the popup; hidden while the popup is open, like a hero. */
  const anchorRef = useRef<HTMLElement | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  /** Module still on screen — stays set while the closing animation runs. */
  const [shown, setShown] = useState<ModuleKey | null>(null);
  const [closing, setClosing] = useState(false);

  // Warm up the popup photos while the home page idles: fetched and decoded before the first tap.
  useEffect(() => {
    const warm = () => {
      for (const src of FIRST_FRAME_PHOTOS) {
        const img = new Image();
        img.src = src;
        img.decode().catch(() => {});
      }
    };
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (activeModule) {
      setShown(activeModule);
      setClosing(false);
    } else if (shown) {
      setClosing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule]);

  // Open: the tile morphs into the card — clip, colour and a spring.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const surface = surfaceRef.current;
    if (!dialog || !surface || !shown || closing || dialog.open) return;
    const anchor = findTrigger(shown);
    anchorRef.current = anchor;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    headingRef.current?.focus({ preventScroll: true });
    if (reducedMotion()) return;

    const card = surface.getBoundingClientRect();
    const content = bodyRef.current?.parentElement;
    if (anchor) {
      const m = measureMorph(card, surface, anchor);
      const ghost = tileGhost(anchor, m);
      surface.append(ghost);
      ghostRef.current = ghost;
      anchor.style.visibility = "hidden";
      const timing = { duration: OPEN_MS, easing: EASE };
      surface.dataset.morphing = "";
      surface.animate(
        [{ clipPath: m.tileClip, ...paint(m.tileColor) }, { clipPath: m.cardClip, ...paint(m.cardColor) }],
        timing,
      ).onfinish = () => {
        delete surface.dataset.morphing;
      };
      ghost.animate(
        [
          { transform: "none", opacity: 1 },
          { opacity: 0, offset: 0.3 },
          { transform: `translate(${-m.x}px, ${-m.y}px) scale(${1 / m.scale})`, opacity: 0 },
        ],
        // Hold the faded end state until it is removed — otherwise it flashes back for a frame.
        { ...timing, fill: "forwards" },
      ).onfinish = () => {
        ghost.remove();
        if (ghostRef.current === ghost) ghostRef.current = null;
      };
      // The content rides the shape on the very same timing — it lands together with the card.
      content?.animate(
        [
          { transform: `translate(${m.x}px, ${m.y}px) scale(${m.scale})`, opacity: 0 },
          { opacity: 1, offset: 0.2 },
          { transform: "none", opacity: 1 },
        ],
        timing,
      );
    } else {
      dialog.animate(
        [{ opacity: 0, transform: "scale(0.92)" }, { opacity: 1, transform: "scale(1)" }],
        { duration: OPEN_MS, easing: EASE },
      );
    }
  }, [shown, closing]);

  // Close: the card shrinks back into the tile, then the tile reappears.
  useEffect(() => {
    const dialog = dialogRef.current;
    const surface = surfaceRef.current;
    if (!dialog || !surface || !closing || !shown) return;
    const finish = () => {
      if (dialog.open) dialog.close();
      reset();
    };
    if (reducedMotion() || !dialog.open) return finish();

    const card = surface.getBoundingClientRect();
    const anchor = anchorRef.current?.isConnected ? anchorRef.current : null;
    const content = bodyRef.current?.parentElement;
    let animation: Animation;
    if (anchor) {
      // The tile is only visibility-hidden, so it still measures where it sits.
      const m = measureMorph(card, surface, anchor);
      ghostRef.current?.remove();
      const ghost = tileGhost(anchor, m);
      surface.append(ghost);
      ghostRef.current = ghost;
      const timing = { duration: CLOSE_MS, easing: EASE, fill: "forwards" as const };
      surface.dataset.morphing = "";
      animation = surface.animate(
        [{ clipPath: m.cardClip, ...paint(m.cardColor) }, { clipPath: m.tileClip, ...paint(m.tileColor) }],
        timing,
      );
      ghost.animate(
        [
          { transform: `translate(${-m.x}px, ${-m.y}px) scale(${1 / m.scale})`, opacity: 0 },
          { opacity: 0, offset: 0.55 },
          { transform: "none", opacity: 1 },
        ],
        timing,
      );
      content?.animate(
        [
          { transform: "none", opacity: 1 },
          { opacity: 0, offset: 0.4 },
          { transform: `translate(${m.x}px, ${m.y}px) scale(${m.scale})`, opacity: 0 },
        ],
        timing,
      );
    } else {
      content?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: EASE_EXIT, fill: "forwards" });
      animation = dialog.animate(
        [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.92)" }],
        { duration: 220, easing: EASE_EXIT, fill: "forwards" },
      );
    }
    // Background tabs may not tick animations — never leave the popup stuck half-closed.
    const fallback = window.setTimeout(finish, CLOSE_MS + 300);
    animation.onfinish = () => { window.clearTimeout(fallback); finish(); };
    return () => { animation.onfinish = null; window.clearTimeout(fallback); };
  }, [closing, shown]);

  const close = () => openModule(null);

  function reset() {
    const dialog = dialogRef.current;
    dialog?.getAnimations().forEach((a) => a.cancel());
    surfaceRef.current?.getAnimations().forEach((a) => a.cancel());
    if (surfaceRef.current) delete surfaceRef.current.dataset.morphing;
    bodyRef.current?.parentElement?.getAnimations().forEach((a) => a.cancel());
    ghostRef.current?.remove();
    ghostRef.current = null;
    if (anchorRef.current) anchorRef.current.style.visibility = "";
    anchorRef.current = null;
    document.body.style.overflow = "";
    setShown(null);
    setClosing(false);
  }

  /** The browser can close the dialog on its own (e.g. a repeated Escape) — sync the page with it. */
  const onClose = () => {
    // A late event from an earlier close must not touch a popup that has reopened since.
    if (!shown || dialogRef.current?.open) return;
    reset();
    if (activeModule) close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="module-sheet text-on-surface"
      data-module={shown ?? undefined}
      data-closing={closing}
      aria-labelledby="workspace-title"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div ref={surfaceRef} className="module-sheet-surface bg-surface-container">
        {shown && (
          <div className="module-sheet-inner">
            <header className="module-sheet-header">
              <h1 ref={headingRef} tabIndex={-1} id="workspace-title" className="module-sheet-title text-on-surface focus:outline-none">
                {t.nav[shown]}
              </h1>
              <button
                type="button"
                onClick={close}
                aria-label={t.launcher.close}
                className="m3-interactive cookie-button-high inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-m3-full text-on-surface"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </header>
            <div ref={bodyRef} className="module-sheet-body">
              <div key={shown} className="module-sheet-content content-panel-shell rounded-m3-xl bg-surface-container-low p-4 text-on-surface sm:p-6">
                <ModuleWorkspace moduleKey={shown} />
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
