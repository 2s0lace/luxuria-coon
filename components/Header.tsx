"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SECTION_IDS } from "@/lib/dictionaries";
import { useLanguage } from "@/lib/i18n";
import { useModuleNavigation } from "@/lib/module-navigation";
import Logo from "./Logo";
import ModuleLink from "./ModuleLink";
import { LanguageToggle, ThemeToggle } from "./Toggles";

const NAV_ITEMS = [
  { key: "welcome", id: SECTION_IDS.welcome },
  { key: "news", id: SECTION_IDS.news },
  { key: "kittens", id: SECTION_IDS.kittens },
  { key: "cats", id: SECTION_IDS.cats },
  { key: "gallery", id: SECTION_IDS.gallery },
  { key: "cattery", id: SECTION_IDS.cattery },
  { key: "about", id: SECTION_IDS.about },
  { key: "contact", id: SECTION_IDS.contact },
] as const;

export default function Header() {
  const { t } = useLanguage();
  const { activeModule } = useModuleNavigation();
  const activeSection = SECTION_IDS[activeModule ?? "welcome"];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstDrawerLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      firstDrawerLinkRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
        window.requestAnimationFrame(() => {
          menuButtonRef.current?.focus({ preventScroll: true });
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus({ preventScroll: true });
    });
  };

  const linkClass = (id: string) =>
    `m3-interactive flex min-h-12 items-center rounded-m3-full px-5 text-sm font-medium tracking-[0.1px] transition-colors duration-short ease-pixel ${
      activeSection === id
        ? "bg-secondary-container text-secondary-on-container"
        : "text-on-surface-variant hover:text-on-surface"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant/60 bg-surface-container/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[calc(var(--header-h)-1px)] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <ModuleLink
            module={null}
            aria-label={t.brand}
            className="m3-interactive flex min-w-0 items-center gap-3 rounded-m3-full px-2 text-on-surface"
          >
            <Logo className="h-9 w-auto shrink-0 sm:h-10" />
            <span className="truncate font-brand text-3xl leading-none sm:text-4xl">
              {t.brand}
            </span>
          </ModuleLink>

          <nav aria-label={t.nav.main} className="hidden 2xl:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <ModuleLink
                    module={item.key === "welcome" ? null : item.key}
                    aria-current={activeSection === item.id ? "page" : undefined}
                    className={linkClass(item.id)}
                  >
                    {t.nav[item.key]}
                  </ModuleLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 2xl:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={t.nav.openMenu}
            className="icon-button 2xl:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <>
          <button
            type="button"
            aria-label={t.nav.closeMenu}
            onClick={closeDrawer}
            className="fixed inset-0 z-[55] bg-black/[.32]"
          />

          <aside
            id="mobile-navigation-drawer"
            aria-label={t.nav.main}
            className="fixed inset-y-0 left-0 z-[60] w-[min(22rem,calc(100%-4rem))] overflow-y-auto rounded-r-m3-xl bg-surface-container-high p-4 text-on-surface"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <ModuleLink
                module={null}
                onClick={closeDrawer}
                className="m3-interactive flex items-center gap-3 rounded-m3-full px-2"
              >
                <Logo className="h-9 w-auto" />
                <span className="font-brand text-3xl leading-none">{t.brand}</span>
              </ModuleLink>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label={t.nav.closeMenu}
                className="icon-button"
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </div>

            <nav aria-label={t.nav.main}>
              <ul className="grid gap-1">
                {NAV_ITEMS.map((item, index) => (
                  <li key={item.id}>
                    <ModuleLink
                      ref={index === 0 ? firstDrawerLinkRef : undefined}
                      module={item.key === "welcome" ? null : item.key}
                      onClick={closeDrawer}
                      aria-current={activeSection === item.id ? "page" : undefined}
                      className={linkClass(item.id)}
                    >
                      {t.nav[item.key]}
                    </ModuleLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 flex items-center gap-2 border-t border-outline-variant pt-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
