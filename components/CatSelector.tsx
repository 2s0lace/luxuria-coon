"use client";

import { Mars, Venus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export type HeroCat = "female" | "male";

export default function CatSelector({ cat, onChange }: { cat: HeroCat; onChange: (cat: HeroCat) => void }) {
  const { t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t.hero.selectCat}
      data-selected={cat}
      className="gender-selector cookie-button-high relative isolate flex items-center gap-1 rounded-m3-full p-1"
    >
      {(["female", "male"] as const).map((option) => {
        const Icon = option === "female" ? Venus : Mars;
        const label = option === "female" ? t.hero.femaleCat : t.hero.maleCat;
        return (
          <button
            key={option}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={cat === option}
            data-cat-selector={option}
            onClick={() => onChange(option)}
            className="gender-selector-option m3-interactive relative z-10 grid h-10 w-10 place-items-center rounded-m3-full text-on-surface-variant"
          >
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
