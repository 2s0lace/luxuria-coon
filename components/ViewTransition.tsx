"use client";

import type { ReactNode } from "react";

/**
 * Wspólne przejście widoku Opis ↔ Zdjęcia.
 *
 * Oba widoki leżą w tej samej komórce siatki rodzica (`grid-area: 1 / 1`), więc
 * nic się nie zwija ani nie rozwija w pionie. Wychodzący widok cały naraz
 * „wchłania się” — lekko maleje i gaśnie (duration-short = 200ms) — a wchodzący
 * wyłania się w jego miejscu dopiero potem (delay-200), więc nigdy się nie mieszają.
 */
export default function ViewTransition({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden={!active}
      className={`min-h-0 overflow-hidden transition-[opacity,transform] [grid-area:1/1] ${
        active
          ? "scale-100 opacity-100 delay-200 duration-medium ease-pixel"
          : "pointer-events-none scale-[0.94] opacity-0 duration-short ease-exit"
      }`}
    >
      {children}
    </div>
  );
}
