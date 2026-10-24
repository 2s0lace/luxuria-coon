"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  MOTION_EASE_STANDARD,
  MOTION_LONG_MS,
  MOTION_SHORT_MS,
} from "@/lib/motion";

export type Slide = { src: string; caption: string; detail?: string };

const SWIPE_THRESHOLD = 60;
/** Gdzie na torze stoi uchwyt na pierwszej i ostatniej stronie (jak w `left` uchwytu niżej). */
const THUMB_START_PX = 56;
const THUMB_END_INSET_PX = 20;
/** Krótkie „tyknięcie” przy każdej mijanej stronie — jak suwaki w Pixelu. */
const tick = () => navigator.vibrate?.(8);

/** setPointerCapture rzuca, jeśli wskaźnik zdążył zniknąć — gest ma to przeżyć */
function capture(el: Element | null, pointerId: number) {
  try {
    el?.setPointerCapture(pointerId);
  } catch {
    /* bez przechwycenia gest nadal działa, dopóki kursor jest nad elementem */
  }
}

const roundButton =
  "icon-button disabled:pointer-events-none disabled:opacity-35 sm:h-14 sm:w-14";
/** Na telefonie strzałki schodzą do rzędu z kropkami — suwak dostaje całą szerokość. */
const sideButton = `${roundButton} max-sm:hidden`;
const dotsButton = `${roundButton} sm:hidden`;

/**
 * Karuzela zdjęć + osobny scrubber pod nią.
 *
 * Układ celowo rozdzielony na cztery warstwy, żeby kontrolka nie mieszała się
 * ze zdjęciami: viewport → tor ze slajdami → kontrolki (przyciski + scrubber)
 * → kropki. Scrubber jest stylizowany na suwak jasności z Material You, ale to
 * `role="slider"` zbudowany od zera, nie `<input type="range">`.
 *
 * `fill` — karuzela wypełnia wysokość rodzica (popup bez przewijania): zdjęcia
 * rosną na wysokość zamiast trzymać proporcje 16:10.
 */
export default function Carousel({ slides, fill = false }: { slides: Slide[]; fill?: boolean }) {
  const { t } = useLanguage();
  const [perView, setPerView] = useState(2);
  const [page, setPage] = useState(0);
  const [swipe, setSwipe] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [iconLean, setIconLean] = useState(0);
  const [scrubVisible, setScrubVisible] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const lastScrubPage = useRef(0);
  const lastScrubX = useRef<number | null>(null);
  const iconReturnTimer = useRef<number | null>(null);
  const settleRef = useRef<Animation | null>(null);
  const prevPageRef = useRef(page);

  useEffect(() => {
    return () => {
      if (iconReturnTimer.current !== null) {
        window.clearTimeout(iconReturnTimer.current);
      }
      settleRef.current?.cancel();
    };
  }, []);

  /*
   * Po zmianie strony cały pasek osiada: pochyla się w stronę ruchu, ściska
   * w pionie i wraca. Animacja leci przez WAAPI, a nie przez klasę, bo tę samą
   * klatkę trzeba umieć odtworzyć wielokrotnie na tym samym elemencie —
   * bez remountu, który zerwałby ref scrubbera w trakcie przeciągania.
   */
  useEffect(() => {
    const prev = prevPageRef.current;
    if (prev === page) return;
    prevPageRef.current = page;

    const el = scrubberRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dir = page > prev ? 1 : -1;
    settleRef.current?.cancel();
    // domknij ewentualne wejście paska, żeby jego reszta nie odbiła po osiadaniu
    for (const running of el.getAnimations()) running.finish();
    settleRef.current = el.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(1, 1)" },
        {
          transform: `translate3d(${dir * 2}px, 0, 0) scale(1.01, 0.94)`,
          offset: 0.25,
        },
        {
          transform: `translate3d(${dir * -1.5}px, 0, 0) scale(0.996, 1.03)`,
          offset: 0.55,
        },
        { transform: "translate3d(0, 0, 0) scale(1.002, 0.988)", offset: 0.8 },
        { transform: "translate3d(0, 0, 0) scale(1, 1)" },
      ],
      { duration: MOTION_LONG_MS, easing: MOTION_EASE_STANDARD },
    );
  }, [page]);

  useEffect(() => {
    const scrubber = scrubberRef.current;
    if (!scrubber) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setScrubVisible(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(scrubber);
    return () => observer.disconnect();
  }, []);

  // dwa kafelki od 768 px w górę, poniżej jeden
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setPerView(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const pageCount = Math.max(1, Math.ceil(slides.length / perView));

  // po zmianie szerokości okna strona mogłaby wyjść poza zakres
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const clamp = useCallback(
    (p: number) => Math.min(pageCount - 1, Math.max(0, p)),
    [pageCount],
  );

  const go = useCallback(
    (delta: number) => setPage((p) => clamp(p + delta)),
    [clamp],
  );

  /* ---------- przesuwanie palcem po zdjęciach ---------- */

  const onSwipeDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipeStart.current = e.clientX;
    capture(viewportRef.current, e.pointerId);
  };

  const onSwipeMove = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    setSwipe(e.clientX - swipeStart.current);
  };

  const onSwipeUp = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    setSwipe(0);
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  };

  /* ---------- scrubber ---------- */

  /** Pozycja pod palcem — liczona na tym samym odcinku, po którym jeździ uchwyt. */
  const positionFromClientX = useCallback(
    (clientX: number) => {
      const el = scrubberRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const span = Math.max(1, rect.width - THUMB_START_PX - THUMB_END_INSET_PX);
      const fraction = Math.min(
        1,
        Math.max(0, (clientX - rect.left - THUMB_START_PX) / span),
      );
      return fraction * Math.max(0, pageCount - 1);
    },
    [pageCount],
  );

  const onScrubDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Cały tor jest celem: dotknięcie przeskakuje w to miejsce, a uchwyt od razu jedzie za palcem.
    const position = positionFromClientX(e.clientX);
    lastScrubX.current = e.clientX;
    lastScrubPage.current = Math.round(position);
    if (lastScrubPage.current !== page) tick();
    setScrubbing(true);
    setScrubPosition(position);
    capture(e.currentTarget, e.pointerId);
  };

  const onScrubMove = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    const dx = e.clientX - (lastScrubX.current ?? e.clientX);
    if (Math.abs(dx) >= 1) {
      setIconLean(dx > 0 ? 1 : -1);
      lastScrubX.current = e.clientX;
      if (iconReturnTimer.current !== null) {
        window.clearTimeout(iconReturnTimer.current);
      }
      iconReturnTimer.current = window.setTimeout(() => {
        setIconLean(0);
        iconReturnTimer.current = null;
      }, MOTION_SHORT_MS);
    }
    const position = positionFromClientX(e.clientX);
    if (Math.round(position) !== lastScrubPage.current) {
      lastScrubPage.current = Math.round(position);
      tick();
    }
    setScrubPosition(position);
  };

  const onScrubUp = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    // puszczony uchwyt dosiada do najbliższej strony
    const nextPage = clamp(Math.round(positionFromClientX(e.clientX)));
    lastScrubX.current = null;
    setIconLean(0);
    setScrubPosition(nextPage);
    setPage(nextPage);
    setScrubbing(false);
  };

  const onScrubKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number | "first" | "last"> = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
      Home: "first",
      End: "last",
    };
    const action = map[e.key];
    if (action === undefined) return;
    e.preventDefault();
    if (action === "first") setPage(0);
    else if (action === "last") setPage(pageCount - 1);
    else go(action);
  };

  // wypełnienie rośnie do pełnego toru na ostatniej stronie — nigdy nie jest puste
  const visualPosition = scrubbing ? scrubPosition : page;
  const progress =
    pageCount <= 1 ? 100 : (visualPosition / (pageCount - 1)) * 100;
  // Strony rozłożone równo między skrajnymi pozycjami uchwytu (THUMB_START_PX … szerokość − THUMB_END_INSET_PX).
  // Clamp na procentach całego toru sklejał na wąskim telefonie pierwszą i drugą stronę.
  const thumbLeft = `calc(${THUMB_START_PX}px + (100% - ${THUMB_START_PX + THUMB_END_INSET_PX}px) * ${progress / 100})`;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.carousel.region}
      className={fill ? "flex h-full w-full flex-col" : "w-full"}
    >
      {/* 1. viewport ze zdjęciami — bez żadnych kontrolek w środku */}
      <div
        ref={viewportRef}
        onPointerDown={onSwipeDown}
        onPointerMove={onSwipeMove}
        onPointerUp={onSwipeUp}
        onPointerCancel={onSwipeUp}
        className={fill ? "min-h-0 flex-1 overflow-hidden" : "overflow-hidden"}
        style={{ touchAction: "pan-y" }}
      >
        <ul
          className={`-mx-2 flex sm:-mx-3 ${fill ? "h-full " : ""}${
            swipeStart.current !== null || scrubbing
              ? ""
              : "transition-transform duration-long ease-pixel"
          }`}
          style={{
            transform: `translateX(calc(${-visualPosition * 100}% + ${swipe}px))`,
          }}
        >
          {slides.map((slide, i) => {
            const offPage = i < page * perView || i >= (page + 1) * perView;
            return (
              <li
                key={`${slide.src}-${i}`}
                aria-hidden={offPage || undefined}
                className={`w-full shrink-0 px-2 sm:px-3 md:w-1/2 ${fill ? "h-full" : ""}`}
              >
                <figure className={`relative ${fill ? "h-full pb-16" : "pb-14"}`}>
                  <div className={`relative z-10 w-full overflow-hidden rounded-m3-md ${fill ? "h-full" : "aspect-[16/10]"}`}>
                    <Image
                      src={slide.src}
                      alt={slide.caption}
                      fill
                      // Pre-sized WebP (~100 KB, /public/photos), warmed up on the home page (ModuleSheet):
                      // no lazy load, no optimizer round trip, so the popup never opens on an empty frame.
                      unoptimized
                      loading="eager"
                      // Async decoding paints the first frames of the open animation without the photo.
                      decoding="sync"
                      draggable={false}
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className="select-none object-cover"
                    />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 flex h-20 flex-col justify-end rounded-b-m3-md bg-scrim px-5 pb-3 text-sm font-medium text-on-surface">
                    {slide.caption}
                    {slide.detail && <span className="font-normal text-on-surface-variant">{slide.detail}</span>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. kontrolki — przyciski po bokach, scrubber pośrodku (na telefonie sam scrubber) */}
      <div className={`${fill ? "mt-3 flex-none" : "mt-6"} flex items-center gap-3 sm:gap-4`}>
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={page === 0}
          aria-label={t.carousel.prev}
          className={sideButton}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>

        <div
          ref={scrubberRef}
          role="slider"
          tabIndex={0}
          aria-label={t.carousel.scrubber}
          aria-valuemin={1}
          aria-valuemax={pageCount}
          aria-valuenow={page + 1}
          aria-valuetext={t.carousel.pageOf(page + 1, pageCount)}
          onKeyDown={onScrubKeyDown}
          onPointerDown={onScrubDown}
          onPointerMove={onScrubMove}
          onPointerUp={onScrubUp}
          onPointerCancel={onScrubUp}
          // Bez warstwy stanu na całym torze (podświetlała prostokąt) — na najechanie reaguje uchwyt.
          className={`${scrubVisible ? "scrub-bar " : ""}group relative h-12 flex-1 touch-none select-none rounded-m3-full outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-14 ${
            scrubbing ? "cursor-grabbing" : "cursor-pointer"
          }`}
        >
          {/* Dwa osobne segmenty zostawiają między sobą prawdziwą, przezroczystą szczelinę. */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 left-0 rounded-m3-full bg-primary-container ${
              scrubbing ? "" : "transition-[right] duration-long ease-pixel"
            }`}
            style={{
              right: `calc(100% - ${thumbLeft} + 0.6rem)`,
            }}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 right-0 rounded-m3-full bg-surface-container-highest ${
              scrubbing ? "" : "transition-[left] duration-long ease-pixel"
            }`}
            style={{
              left: `calc(${thumbLeft} + 0.6rem)`,
            }}
          />

          {/* ikona galerii — zawsze na wypełnionej części toru */}
          <span
            className="pointer-events-none absolute inset-y-0 left-0 grid w-[2.9rem] place-items-center text-on-surface transition-transform duration-short ease-pixel"
            style={{
              transform: `translateX(${iconLean * 1.5}px) rotate(${iconLean * 3}deg)`,
            }}
          >
            <ImageIcon
              key={`${page}-${scrubbing ? "drag" : "idle"}`}
              className="slider-icon-react h-5 w-5"
              strokeWidth={2}
              aria-hidden
            />
          </span>

          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 z-10 w-11 -translate-x-1/2 ${
              scrubbing ? "" : "transition-[left] duration-long ease-pixel"
            }`}
            style={{
              left: `${thumbLeft}`,
            }}
          >
            <span
              className={`pointer-events-none absolute left-1/2 top-1/2 block w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-m3-full bg-on-surface/35 transition-[height,width] ${
                scrubbing
                  ? "h-10 w-2"
                  : "h-7 duration-medium ease-pixel group-hover:h-8 sm:h-8"
              }`}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={page === pageCount - 1}
          aria-label={t.carousel.next}
          className={sideButton}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </div>

      {/* 3. kropki — wskaźnik pomocniczy; na telefonie między strzałkami */}
      <div className={`mt-1 flex items-center justify-between sm:justify-center ${fill ? "flex-none" : ""}`}>
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={page === 0}
          aria-label={t.carousel.prev}
          className={dotsButton}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
        {/* Kropki dzielą to, co zostaje między strzałkami — na wąskim telefonie się zwężają, zamiast wypychać strzałkę. */}
        <ul className="flex min-w-0 flex-1 items-center justify-center">
          {Array.from({ length: pageCount }, (_, i) => (
            <li key={i} className="min-w-0 max-w-8 flex-1 sm:max-w-12">
              <button
                type="button"
                onClick={() => setPage(i)}
                aria-label={t.carousel.goToPage(i + 1)}
                aria-current={i === page ? "true" : undefined}
                className="m3-interactive grid h-12 w-full place-items-center rounded-m3-full sm:p-3"
              >
                <span
                  aria-hidden
                  className={`block h-2 rounded-full transition-[width,background-color] duration-medium ease-pixel ${
                      i === page ? "w-6 bg-primary" : "w-2 bg-on-surface/25"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={page === pageCount - 1}
          aria-label={t.carousel.next}
          className={dotsButton}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  );
}
