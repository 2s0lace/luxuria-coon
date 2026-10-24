"use client";

import { useLanguage } from "@/lib/i18n";
import { SOCIALS } from "@/lib/socials";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLanguage();
  // Modules open as sheets over the home screen, so the footer shows only in the scrolling phone/tablet portrait layout.
  return (
    <footer className={`hidden max-lg:portrait:block relative mt-20 w-full rounded-t-m3-xl bg-[color-mix(in_srgb,rgb(var(--md-surface-container))_45%,rgb(var(--md-cookie-button-high)))] transition-colors lg:rounded-none lg:bg-transparent duration-medium ease-pixel`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row">
        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
          <Logo className="h-8 w-auto text-on-surface" />
          {/* The author credit lives in the Contact popup. */}
          <p className="text-center text-sm text-on-surface-variant md:text-left">{t.footer.rights}</p>
        </div>

        <nav aria-label={t.footer.social}>
          <ul className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.name} (demo)`}
                  className="m3-interactive block text-on-surface transition-colors duration-short ease-pixel hover:text-primary active:text-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
