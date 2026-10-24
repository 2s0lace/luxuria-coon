"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { SECTION_IDS } from "@/lib/dictionaries";
import { useLanguage } from "@/lib/i18n";
import { SOCIALS } from "@/lib/socials";
import { applyGenderTheme } from "@/lib/theme-wave";
import Logo from "./Logo";
import ModuleLauncher from "./ModuleLauncher";
import CatSelector, { type HeroCat } from "./CatSelector";
import HeroCatDetails from "./HeroCatDetails";
import CatteryStatus from "./CatteryStatus";
import PawTrail from "./PawTrail";
import {
  CAT_SHAPES,
  M3_SHAPES,
  type CatShapeName,
  type M3ShapeName,
} from "@/lib/m3Shapes";

type ShapeSpec = {
  /** kształt z biblioteki M3 albo prosty kształt CSS */
  shape: M3ShapeName | CatShapeName | "pill" | "arch";
  /** środek kształtu na scenie, w % szerokości/wysokości */
  x: number;
  y: number;
  /** szerokość (i wysokość dla kształtów niekwadratowych), w % sceny */
  w: number;
  h?: number;
  rot: number;
  tone: 1 | 2 | 3 | 4 | "base";
  /**
   * back  — za kotem, wychyla się zza jego sylwetki, z rozmyciem ruchu
   * front — przed kotem, ostry
   * base  — jasne podłoże pod kotem
   */
  layer: "base" | "back" | "front";
  /** siła rozmycia ruchu dla warstwy back */
  blur?: "soft" | "strong";
  /** powolny obrót, jak wskaźnik ładowania w M3 */
  spin?: boolean;
};

/** Środek kota na scenie — stąd kształty wychodzą i od niego uciekają. */
const ORIGIN = { x: 50, y: 52 };

/*
 * Kolejność = kolejność wejścia. Podłoże jest kremowe, bo białe futro w grafice
 * to przezroczystość — kot musi zawsze stać na jasnym kształcie, także w dark mode.
 * Kształty "back" stoją tak, że zachodzą za sylwetkę kota: wyglądają, jakby
 * z niego wylatywały.
 */
const SHAPES: ShapeSpec[] = [
  { shape: "diamond", x: 50, y: 55, w: 100, rot: 0, tone: "base", layer: "base" },
  { shape: "fish", x: 70, y: 19, w: 30, h: 18, rot: 122, tone: 3, layer: "back", blur: "strong" },
  { shape: "paw", x: 21, y: 22, w: 30, rot: -24, tone: 2, layer: "back", blur: "soft" },
  { shape: "head", x: 85, y: 56, w: 25, rot: 12, tone: 1, layer: "back", blur: "soft" },
  { shape: "paw", x: 14, y: 66, w: 20, rot: -70, tone: 2, layer: "back", blur: "strong" },
  { shape: "ear", x: 50, y: 4, w: 16, rot: 0, tone: 3, layer: "back", blur: "soft" },
  { shape: "head", x: 79, y: 86, w: 16, rot: -12, tone: 4, layer: "front" },
  { shape: "paw", x: 22, y: 90, w: 12, rot: 18, tone: 3, layer: "front" },
];

/** Kąt od środka kota do kształtu — kierunek „ucieczki" i rozmycia ruchu. */
function outwardAngle(x: number, y: number) {
  // Rounded: server and browser differ in the last float digits, which breaks hydration.
  return Math.round((Math.atan2(y - ORIGIN.y, x - ORIGIN.x) * 180_000) / Math.PI) / 1000;
}

export default function Hero() {
  const { t } = useLanguage();
  const [cat, setCat] = useState<HeroCat>("female");
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.genderTheme = cat;
  }, [cat]);

  useEffect(() => {
    const syncVisibility = () => setPageHidden(document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return (
    <section
      id={SECTION_IDS.welcome}
      data-nav-section
      aria-labelledby="hero-title"
      className="welcome-screen relative isolate w-full"
    >
      <div className="welcome-layout">
        <div className="welcome-art">
        <div className="hero-stage" data-float-paused={pageHidden} aria-hidden>
          {/* rozmycie ruchu wzdłuż lokalnej osi X — wrapper jest obrócony w kierunku ucieczki */}
          <svg className="hero-filters" aria-hidden>
            <filter id="hero-mblur-soft" x="-60%" y="-20%" width="220%" height="140%">
              <feGaussianBlur stdDeviation="4 0" />
            </filter>
            <filter id="hero-mblur-strong" x="-80%" y="-20%" width="260%" height="140%">
              <feGaussianBlur stdDeviation="8 0" />
            </filter>
          </svg>

          {SHAPES.map((s, i) => {
            const dir = s.layer === "base" ? 0 : outwardAngle(s.x, s.y);
            const style = {
              left: `${s.x - s.w / 2}%`,
              top: `${s.y - (s.h ?? s.w) / 2}%`,
              width: `${s.w}%`,
              height: `${s.h ?? s.w}%`,
              "--rot": `${dir}deg`,
              "--from-x": `${ORIGIN.x - s.x}cqw`,
              "--from-y": `${ORIGIN.y - s.y}cqw`,
              "--delay": `${120 + i * 70}ms`,
              "--float-duration": `${6.5 + i * 0.45}s`,
              "--float-start": `${1020 + i * 70}ms`,
            } as CSSProperties;

            return (
              <div
                key={`${s.shape}-${i}`}
                className={`hero-shape-anchor hero-shape-${s.layer} ${s.layer === "base" ? "" : "hero-shape-float"}`}
                style={style}
              >
              <div
                className={`hero-shape hero-shape-${s.layer} hero-tone-${s.tone} ${
                  s.blur ? `hero-mblur-${s.blur}` : ""
                }`}
              >
                <div
                  className="hero-shape-orient"
                  style={{ transform: `rotate(${Math.round((s.rot - dir) * 1000) / 1000}deg)` }}
                >
                  {s.shape === "pill" || s.shape === "arch" ? (
                    <div className={`hero-shape-fill hero-shape-${s.shape}`} />
                  ) : (
                    <svg
                      viewBox="0 0 100 100"
                      className={`hero-shape-fill ${s.spin ? "hero-shape-spin" : ""}`}
                    >
                      <path
                        d={
                          s.shape in CAT_SHAPES
                            ? CAT_SHAPES[s.shape as CatShapeName]
                            : M3_SHAPES[s.shape as M3ShapeName]
                        }
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </div>
              </div>
              </div>
            );
          })}

          {/* Same colours as in the photos: Freja is the dark silver tabby, Odin the red one. */}
          <div className="hero-cat">
            <Image
              src="/kot-hero.svg"
              alt=""
              width={152}
              height={181}
              priority
              unoptimized
              className="hero-cat-image h-full w-auto"
              data-selected={cat === "female"}
              data-hero-cat="female"
            />
          </div>
          <div className="hero-cat">
            <Image
              src="/kot-hero-drugi.svg"
              alt=""
              width={175}
              height={175}
              priority
              unoptimized
              className="hero-cat-image h-full w-auto"
              data-selected={cat === "male"}
              data-hero-cat="male"
            />
          </div>
        </div>
        <HeroCatDetails cat={cat} />
        <div className="welcome-cat-controls">
          <CatSelector
            cat={cat}
            onChange={(nextCat) => {
              applyGenderTheme(nextCat, document.querySelector(".welcome-cat-controls"));
              setCat(nextCat);
            }}
          />
        </div>
        </div>
        <div className="welcome-content text-center">
          <div className="welcome-brand">
          <div style={{ containerType: "inline-size" }}>
            <h1
              id="hero-title"
              className="whitespace-nowrap text-on-surface"
              style={{
                fontFamily: "var(--font-matemasie), cursive",
                fontWeight: 400,
                fontSize: "calc(100cqw / 6.9)",
                lineHeight: 1.15,
              }}
            >
              {t.brand}
            </h1>
          </div>
          <p className="welcome-lead text-on-surface-variant">
            {t.hero.lead}
          </p>
          </div>
          <CatteryStatus />
          <PawTrail />
          <ModuleLauncher />
        </div>
      </div>
      <div className="welcome-credit flex items-center gap-3 text-on-surface-variant">
        <Logo className="h-6 w-auto text-on-surface" />
        {/* The author credit lives in the Contact popup. */}
        <p>{t.footer.rights}</p>
      </div>
      <nav aria-label={t.footer.social} className="welcome-socials">
        <ul className="flex items-center gap-4">
          {SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.name} (demo)`}
                className="m3-interactive block text-on-surface transition-colors duration-short ease-pixel hover:text-primary active:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
