"use client";

import { Image, NotebookText } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "@/lib/i18n";

export type PanelView = "text" | "media";

const VIEWS: PanelView[] = ["text", "media"];

export default function ViewToggle({
  view,
  onChange,
  label,
}: {
  view: PanelView;
  onChange: (view: PanelView) => void;
  label: string;
}) {
  const { t } = useLanguage();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + VIEWS.length) % VIEWS.length;
    onChange(VIEWS[next]);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-m3-full bg-surface-container-lowest p-1"
    >
      {VIEWS.map((item, index) => {
        const selected = item === view;
        const Icon = item === "text" ? NotebookText : Image;
        return (
          <button
            key={item}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={
              item === "text" ? t.panelView.text : t.panelView.photos
            }
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`m3-interactive grid h-10 place-items-center rounded-m3-full transition-[width,background-color,color] duration-medium ease-spring ${
              selected
                ? "view-toggle-react w-16 bg-secondary-container text-secondary-on-container"
                : "w-10 text-on-surface-variant"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
