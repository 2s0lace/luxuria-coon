"use client";

import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

const baseButton =
  "m3-interactive cookie-button-high grid h-10 place-items-center rounded-m3-full text-on-surface transition-colors duration-short ease-pixel";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, t, toggleLocale } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.toggles.language}
      title={t.toggles.language}
      className={`${baseButton} w-14 text-sm font-semibold tracking-wide ${className}`}
    >
      {locale === "pl" ? "PL" : "EN"}
    </button>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, ready, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
  const label = isDark ? t.toggles.toLight : t.toggles.toDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!ready}
      aria-label={ready ? label : t.toggles.theme}
      title={ready ? label : t.toggles.theme}
      aria-pressed={ready ? isDark : undefined}
      className={`${baseButton} w-12 ${className}`}
    >
      {/* Klasa dark jest ustawiana w <head>, zanim React się zamontuje. */}
      <svg
        viewBox="0 0 24 24"
        className="hidden h-5 w-5 dark:block"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 3a1 1 0 0 1 .96 1.28A7 7 0 0 0 19.72 13a1 1 0 0 1 1.2 1.4A9 9 0 1 1 10.6 3.08 1 1 0 0 1 12 3Z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
