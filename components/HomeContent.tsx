"use client";

import { useEffect, useRef } from "react";
import { useModuleNavigation } from "@/lib/module-navigation";
import type { ModuleKey } from "@/lib/modules";
import Hero from "./Hero";
import ModuleSheet from "./ModuleSheet";

export default function HomeContent() {
  const { activeModule } = useModuleNavigation();
  const previousModule = useRef<ModuleKey | null>(null);

  useEffect(() => {
    // Mobile/tablet portrait scrolls (intro screen + launcher); other layouts fit one viewport.
    const scrollable = window.matchMedia("(max-width: 1023px) and (orientation: portrait)");
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const sync = () => { root.style.overflow = scrollable.matches ? previousOverflow : "hidden"; };
    sync();
    scrollable.addEventListener("change", sync);
    return () => {
      scrollable.removeEventListener("change", sync);
      root.style.overflow = previousOverflow;
    };
  }, []);

  // Closing a module sheet hands focus back to the tile it was opened from.
  useEffect(() => {
    const previous = previousModule.current;
    previousModule.current = activeModule;
    if (activeModule || !previous) return;
    const frame = window.requestAnimationFrame(() => {
      const selector = `[data-module-launcher="${previous}"]`;
      const trigger = Array.from(document.querySelectorAll<HTMLElement>(selector)).find((el) => el.offsetParent !== null);
      trigger?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeModule]);

  return (
    <main>
      {/* The home screen stays put; modules open over it as sheets. */}
      <div className="welcome-home">
        <Hero />
      </div>
      <ModuleSheet />
    </main>
  );
}
