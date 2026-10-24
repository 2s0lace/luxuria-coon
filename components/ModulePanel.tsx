"use client";

import { useState } from "react";
import Carousel, { type Slide } from "./Carousel";
import ViewToggle, { type PanelView } from "./ViewToggle";
import ViewTransition from "./ViewTransition";

/**
 * Every module popup looks the same: a photos/description toggle and a carousel
 * that fills the popup's height (popups never scroll).
 */
export default function ModulePanel({
  label,
  body,
  slides,
}: {
  /** Accessible name for the view toggle. */
  label: string;
  body: string;
  slides: Slide[];
}) {
  const [view, setView] = useState<PanelView>("media");

  return (
    // The popup header already shows the section name.
    <section aria-labelledby="workspace-title" data-panel-view={view} className="flex h-full flex-col">
      <div className="mb-3 flex flex-none justify-end">
        <ViewToggle view={view} onChange={setView} label={label} />
      </div>
      {/* Both views share one cell: switching swaps them in place instead of collapsing one. */}
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-1">
        <ViewTransition active={view === "media"}>
          <Carousel fill slides={slides} />
        </ViewTransition>
        <ViewTransition active={view === "text"}>
          <p className="m3-body-large max-w-xl text-on-surface-variant">{body}</p>
        </ViewTransition>
      </div>
    </section>
  );
}
