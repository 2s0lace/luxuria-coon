"use client";

import { useLanguage } from "@/lib/i18n";
import { useId } from "react";
import type { HeroCat } from "./CatSelector";

export default function HeroCatDetails({ cat }: { cat: HeroCat }) {
  const { t } = useLanguage();
  const details = t.hero.catDetails[cat];
  const curveId = `cat-caption-${useId().replace(/:/g, "")}`;
  const caption = `${details.name} · ${details.age}`;
  return (
    <div className="welcome-cat-details text-on-surface" aria-live="polite" aria-atomic="true">
      <span className="sr-only">{caption}</span>
      <svg viewBox="0 0 400 96" className="welcome-cat-caption" aria-hidden>
        <defs>
          <path id={curveId} d="M 48 12 Q 200 142 352 12" />
        </defs>
        <text className="font-sans" fill="currentColor" fontSize="28.8" fontWeight="500" textAnchor="middle" letterSpacing="1.2">
          <textPath href={`#${curveId}`} startOffset="50%">{caption}</textPath>
        </text>
      </svg>
    </div>
  );
}
