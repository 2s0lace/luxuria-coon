"use client";

import { Cat, PawPrint } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function CatteryStatus() {
  const { t } = useLanguage();
  const status = t.hero.catteryStatus;
  return (
    <section className="welcome-cattery-status" aria-label={status.title}>
      {/* Information only — the cards don't open anything. */}
      <ul className="grid grid-cols-2 gap-2">
        <li>
          <div className="welcome-status-card flex h-full flex-col items-center justify-center text-center rounded-m3-lg bg-primary-container text-primary-on-container">
            <span className="welcome-status-label flex items-center gap-2">
              <PawPrint className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              {status.litterLabel}
            </span>
            <span className="welcome-status-value font-medium">{status.litterName}</span>
            <span className="welcome-status-detail">{status.parents}</span>
          </div>
        </li>
        <li>
          <div className="welcome-status-card cookie-button-high flex h-full flex-col items-center justify-center text-center rounded-m3-lg text-on-surface">
            <span className="welcome-status-label flex items-center gap-2">
              <Cat className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              {status.availableLabel}
            </span>
            <span className="welcome-status-value font-medium">{status.available}</span>
            <span className="welcome-status-detail">{status.total}</span>
          </div>
        </li>
      </ul>
    </section>
  );
}
