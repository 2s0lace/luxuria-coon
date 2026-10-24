"use client";

import { Cat, Heart, House, Images, Mail, Newspaper } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useModuleNavigation } from "@/lib/module-navigation";
import { LAUNCHER_KEYS } from "@/lib/modules";
import { LanguageToggle, ThemeToggle } from "./Toggles";

const ICONS = { cats: Cat, gallery: Images, news: Newspaper, cattery: House, about: Heart };

export default function ModuleLauncher() {
  const { t } = useLanguage();
  const { openModule } = useModuleNavigation();
  return (
    <nav aria-labelledby="launcher-title" className="welcome-launcher">
      <h2 id="launcher-title" className="welcome-launcher-title text-xs font-medium uppercase tracking-[0.16em] text-on-surface-variant">
        {t.launcher.title}
      </h2>
      <ul className="welcome-module-grid">
        {LAUNCHER_KEYS.map((key) => {
          const Icon = ICONS[key];
          return (
            <li key={key}>
              <button
                type="button"
                data-module-launcher={key}
                onClick={() => openModule(key)}
                className="module-launcher m3-interactive cookie-button flex h-full w-full items-center rounded-m3-lg text-left text-on-surface"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="module-launcher-label block text-sm font-medium">{t.nav[key]}</span>
                  <span className="module-launcher-description mt-0.5 block text-xs leading-relaxed text-on-surface-variant">{t.launcher.descriptions[key]}</span>
                </span>
              </button>
            </li>
          );
        })}
        {/* Only shown in the compact 3-column grid, where it replaces the Kontakt pill below. */}
        <li className="welcome-module-contact">
          <button
            type="button"
            data-module-launcher="contact"
            onClick={() => openModule("contact")}
            className="module-launcher m3-interactive cookie-button flex h-full w-full items-center rounded-m3-lg text-left text-on-surface"
          >
            <Mail className="h-5 w-5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="module-launcher-label block text-sm font-medium">{t.nav.contact}</span>
            </span>
          </button>
        </li>
      </ul>
      <div className="welcome-settings flex items-center justify-center gap-2">
        <button
          type="button"
          data-module-launcher="contact"
          onClick={() => openModule("contact")}
          className="welcome-contact-button m3-interactive cookie-button-high items-center justify-center rounded-m3-full text-sm font-semibold text-on-surface transition-colors duration-short ease-pixel"
        >
          <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
          {t.nav.contact}
        </button>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </nav>
  );
}
