"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { MOTION_REVEAL_MS } from "@/lib/motion";
import { ViewToggleSlotProvider } from "./ViewToggleSlot";

type RevealStyle = CSSProperties & {
  "--reveal-x": string;
  "--reveal-y": string;
  "--reveal-r": string;
};

const EMPTY_REVEAL: RevealStyle = {
  "--reveal-x": "0px",
  "--reveal-y": "0px",
  "--reveal-r": "0px",
};

/**
 * Górny próg feathera z `--reveal-feather` w globals.css. Promień docelowy musi
 * przekroczyć przekątną o tyle, żeby nieprzezroczysty rdzeń maski przykrył cały
 * panel — inaczej rogi zostają półprzezroczyste po zakończeniu animacji.
 */
const REVEAL_FEATHER_MAX = 160;

export type ModuleTab = {
  /** id kotwicy — kliknięcie w nawigacji przewija tu i otwiera tę zakładkę */
  id: string;
  label: string;
  panel: ReactNode;
};

/**
 * Moduł w stylu Control Center z Pixel UI: rząd pigułek nad jednym dużym,
 * zaokrąglonym panelem. Zakładki przełączają zawartość panelu bez przeładowania.
 */
export default function ControlModule({
  tabs,
  ariaLabel,
}: {
  tabs: ModuleTab[];
  ariaLabel: string;
}) {
  const [active, setActive] = useState(tabs[0].id);
  const [viewToggleTarget, setViewToggleTarget] =
    useState<HTMLDivElement | null>(null);
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [revealStyle, setRevealStyle] = useState<RevealStyle>(EMPTY_REVEAL);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const revealOriginRef = useRef<{ x: number; y: number } | null>(null);
  const revealRadiusRef = useRef(0);
  const revealFrameRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const ids = useMemo(() => tabs.map((t) => t.id), [tabs]);
  const idsKey = ids.join(",");

  const selectTab = useCallback(
    (id: string, origin?: { x: number; y: number }) => {
      if (id === active) return;
      const index = tabs.findIndex((tab) => tab.id === id);
      const triggerRect = tabRefs.current[index]?.getBoundingClientRect();
      revealOriginRef.current =
        origin ??
        (triggerRect
          ? {
              x: triggerRect.left + triggerRect.width / 2,
              y: triggerRect.top + triggerRect.height / 2,
            }
          : null);
      setRevealStyle(EMPTY_REVEAL);
      setRevealingId(id);
      setActive(id);
    },
    [active, tabs],
  );

  useLayoutEffect(() => {
    if (!revealingId || revealingId !== active) return;
    const index = tabs.findIndex((tab) => tab.id === active);
    const panel = panelRefs.current[index];
    const origin = revealOriginRef.current;
    if (!panel || !origin) {
      setRevealingId(null);
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const revealX = origin.x - panelRect.left;
    const revealY = origin.y - panelRect.top;
    const width = panelRect.width;
    const height = panel.firstElementChild?.scrollHeight ?? panel.scrollHeight;
    const revealRadius =
      Math.max(
        Math.hypot(revealX, revealY),
        Math.hypot(width - revealX, revealY),
        Math.hypot(revealX, height - revealY),
        Math.hypot(width - revealX, height - revealY),
      ) +
      REVEAL_FEATHER_MAX +
      24;

    revealRadiusRef.current = revealRadius;

    setRevealStyle({
      "--reveal-x": `${revealX}px`,
      "--reveal-y": `${revealY}px`,
      "--reveal-r": "0px",
    });
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /*
     * Zapadka bezpieczeństwa. Normalnie kończy `transitionend`, ale gdy rAF nie
     * dojdzie do skutku — karta w tle, brak kompozycji — promień nigdy nie
     * ruszy i `revealingId` zostałby ustawiony na stałe. Bufor jest dłuższy od
     * animacji, więc nie potrafi jej uciąć.
     */
    revealTimerRef.current = window.setTimeout(
      () => {
        setRevealingId(null);
        revealTimerRef.current = null;
      },
      reduced ? 0 : MOTION_REVEAL_MS + 200,
    );

    revealFrameRef.current = window.requestAnimationFrame(() => {
      revealFrameRef.current = window.requestAnimationFrame(() => {
        revealFrameRef.current = null;
        setRevealStyle((current) => ({
          ...current,
          "--reveal-r": `${revealRadiusRef.current}px`,
        }));
      });
    });

    return () => {
      if (revealFrameRef.current !== null) {
        window.cancelAnimationFrame(revealFrameRef.current);
        revealFrameRef.current = null;
      }
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [active, revealingId, tabs]);

  // Kotwica w adresie → aktywna zakładka (przy wejściu i przy każdej zmianie hasha)
  useEffect(() => {
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (idsKey.split(",").includes(hash)) selectTab(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [idsKey, selectTab]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const delta =
        e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -index : e.key === "End" ? tabs.length - 1 - index : 0;
      if (!delta && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      const next = (index + delta + tabs.length) % tabs.length;
      selectTab(tabs[next].id);
      tabRefs.current[next]?.focus();
    },
    [tabs, selectTab],
  );

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === active),
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      {/* cele kotwic — po jednej na zakładkę, z odstępem na sticky header */}
      {tabs.map((tab) => (
        <span
          key={tab.id}
          id={tab.id}
          className="block h-0 scroll-mt-[var(--header-h)]"
        />
      ))}

      <div className="flex items-center gap-2 pb-5 sm:gap-4 md:gap-6 md:pb-6">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="flex min-w-0 flex-1 gap-2 sm:gap-4 md:gap-6"
        >
          {tabs.map((tab, i) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={(event: ReactMouseEvent<HTMLButtonElement>) =>
                  selectTab(
                    tab.id,
                    event.detail
                      ? { x: event.clientX, y: event.clientY }
                      : undefined,
                  )
                }
                onKeyDown={(e) => onKeyDown(e, i)}
                style={{ flexBasis: 0, flexGrow: selected ? 1.15 : 0.925 }}
                 className={`m3-interactive min-w-0 whitespace-nowrap rounded-m3-md px-1 py-4 text-center text-[clamp(0.625rem,3vw,0.875rem)] font-medium transition-[flex-grow,background-color,color] duration-medium ease-spring sm:px-8 sm:py-5 sm:text-xl md:text-2xl ${
                   selected
                     ? "control-tab-react bg-primary-container text-on-primary-container"
                     : "cookie-button-high cookie-button-hover text-on-surface-variant hover:text-on-surface"
                 }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div
          ref={setViewToggleTarget}
          className="flex min-h-12 shrink-0 items-center justify-end"
        />
      </div>

      <div className="content-panel-shell w-full rounded-m3-md bg-surface-container p-6 text-on-surface transition-[padding,border-radius] duration-long ease-pixel sm:p-10 md:p-14">
        <ViewToggleSlotProvider activeId={active} target={viewToggleTarget}>
          <div className="grid">
            {tabs.map((tab, index) => {
              const selected = index === activeIndex;
              return (
                <div
                  key={tab.id}
                  ref={(element) => {
                    panelRefs.current[index] = element;
                  }}
                  style={revealingId === tab.id ? revealStyle : undefined}
                  onTransitionEnd={(event) => {
                    if (
                      event.target === event.currentTarget &&
                      (event.propertyName === "--reveal-r" ||
                        event.propertyName === "clip-path") &&
                      revealingId === tab.id
                    ) {
                      if (revealTimerRef.current !== null) {
                        window.clearTimeout(revealTimerRef.current);
                        revealTimerRef.current = null;
                      }
                      setRevealingId(null);
                    }
                  }}
                  className={`col-start-1 row-start-1 grid transition-[grid-template-rows,opacity] ${
                    selected
                      ? "z-10 grid-rows-[1fr] opacity-100 duration-long ease-pixel"
                      : "pointer-events-none z-0 grid-rows-[0fr] opacity-0 duration-medium ease-exit"
                  } ${
                    revealingId === tab.id
                      ? "control-panel-reveal liquid-reveal liquid-reveal-animating"
                      : ""
                  }`}
                >
                  <div
                    role="tabpanel"
                    id={`panel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    aria-hidden={!selected}
                    tabIndex={selected ? 0 : -1}
                    className="min-h-0 overflow-hidden"
                  >
                    {tab.panel}
                  </div>
                </div>
              );
            })}
          </div>
        </ViewToggleSlotProvider>
      </div>
    </div>
  );
}
