# Luxuria Coon — strona hodowli kotów Maine Coon

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Bez bibliotek UI.
Interfejs korzysta z semantycznych ról Material Design 3 (Material You), tonalnej
hierarchii powierzchni, oficjalnej skali kształtów oraz state layers.

## System kolorów i kształtów M3

Role kolorystyczne są zdefiniowane w [`app/globals.css`](app/globals.css) jako
`--md-primary`, `--md-secondary`, `--md-tertiary`, role `on-*`, `outline` oraz
`surface-container-*`. Tryb ciemny przełącza komplet wartości przez klasę `dark`.
Tailwind udostępnia je semantycznie jako `bg-primary`, `text-on-surface`,
`bg-surface-container-high` itd.

Hierarchia powierzchni `surface-container-lowest` → `surface-container-highest`
zastępuje dekoracyjne cienie. Promienie są mapowane na tokeny `m3-xs`, `m3-sm`,
`m3-md`, `m3-lg`, `m3-xl` i `m3-full`.

Interaktywne elementy używają klasy `m3-interactive`, która zapewnia state layer
8% dla hover, 10% dla focus i 12% dla pressed oraz dostępny focus ring.

## Uruchomienie

```bash
npm install
```

```bash
npm run dev
```

Strona: http://localhost:3000

## Struktura

```
app/
  layout.tsx        — fonty (Albert Sans, Caveat), metadata + OG, Footer, providery
  page.tsx          — składa stronę z <HomeContent />
  globals.css       — zmienne CSS motywu jasnego i ciemnego, klasy pomocnicze
components/
  Header.tsx        — poprzednia nawigacja, nie jest renderowana
  Hero.tsx          — CTA Filled/Filled Tonal + typografia M3
  Separator.tsx     — tonalny separator
  ControlModule.tsx — moduł z zakładkami w stylu Control Center (Pixel UI)
  ModulePanel.tsx   — zawartość zakładki: 2 karty z gradientową tacą + karuzela
  Carousel.tsx      — karuzela 2 kafelki naraz, przesuwanie o dwa, swipe
  Gallery.tsx       — grid 1/3 kolumny, 6 zdjęć, lightbox (Esc, ←, →)
  HomeContent.tsx   — ekran główny i aktywny moduł
  ModuleLauncher.tsx — przyciski otwierające moduły
  ModuleLink.tsx    — powrót z modułu na ekran główny
  ModuleWorkspace.tsx — treść aktywnego modułu, ładowana na żądanie
  Footer.tsx        — surface container z promieniem M3 Extra Large, inline SVG social
  Logo.tsx          — znak graficzny (inline SVG, fill=currentColor)
  Toggles.tsx       — przełącznik języka i motywu
  Providers.tsx     — konteksty motywu, języka i nawigacji modułów
lib/
  dictionaries.ts   — CAŁA treść PL i EN + identyfikatory sekcji
  modules.ts        — lista modułów i odczyt adresu modułu
  module-navigation.tsx — stan aktywnego modułu i historia przeglądarki
  i18n.tsx          — kontekst języka (localStorage + navigator.language)
  theme.tsx         — kontekst motywu (localStorage + prefers-color-scheme)
  theme-script.ts   — skrypt anty-migotanie wstrzykiwany w <head>
public/             — placeholdery zdjęć, patrz public/README.md
```

## Edycja treści

Wszystkie teksty (PL i EN) są w jednym pliku: [`lib/dictionaries.ts`](lib/dictionaries.ts).
Zmiana nazwy hodowli — pole `brand` w obu językach oraz `footer.rights` i `meta.*`.

## Ekran główny i moduły

Ekran główny zachowuje oryginalnego kota, kształty i animacje w `Hero`.
Zajmuje dokładnie cały widok i nie przewija się. Nie ma górnego paska nawigacji.
Kontakt, przełącznik języka i jasnego/ciemnego motywu są w jednym rzędzie,
w tym samym tonalnym stylu. Kontakt zachowuje ikonę koperty i napis.
Pod ilustracją kota są przyciski ♀ i ♂: drugi SVG (`kot-hero-drugi.svg`) przedstawia dziewczynkę,
a pierwszy (`kot-hero.svg`) chłopca. Zmiana kota płynnie przełącza grafikę,
zachowuje animowane kształty i pozostaje wybrana po powrocie z modułu.
Pod rombem imię i wiek tworzą łuk w kroju Albert Sans, zmieniający się razem z kotem:
przykładowo Freja, 4 lata, lub Odin, 4 lata. Przełącznik ♀/♂ jest poniżej podpisu.
Pod opisem hodowli są kafelki aktualnego miotu
i dostępnych kociąt; kliknięcie otwiera moduł Kocięta. Przykładowe wartości
edytujesz w `hero.catDetails` i `hero.catteryStatus` w `lib/dictionaries.ts`
osobno dla PL i EN. Układ na małych ekranach jest bardziej zwarty, aby
zachować widoczne koty, informacje i przyciski bez przewijania.
Siedem dekoracyjnych kształtów delikatnie lewituje po zakończeniu animacji wejścia.
Lewitowanie pauzuje poza ekranem głównym i w niewidocznej karcie; jest wyłączone
przy preferencji ograniczenia ruchu. Pomiary są w
[`output/playwright/hero-performance.md`](output/playwright/hero-performance.md).
Na szerokich ekranach kot i przyciski stoją obok siebie, a na telefonach
w pionie układają się jeden pod drugim. Krótkie ekrany pokazują same
etykiety przycisków. Stopka pojawia się dopiero w otwartym module.
Ekran ma pięć neutralnych kafelków: Nasze koty, Galeria, Aktualności,
Hodowla i O rasie. Kocięta otwierasz przez obie karty statusu; tylko Miot L
ma akcent kolorystyczny. Kontakt jest osobnym, niewielkim przyciskiem.
Kafelki nie mają strzałek sugerujących link zewnętrzny. Wszystkie siedem
adresów modułów pozostaje dostępnych przez bezpośrednie linki.
Moduł zastępuje widok główny,
a przycisk „Ekran główny” pozwala wrócić. Hero pozostaje zamontowane,
więc powrót nie uruchamia ponownie animacji wejścia.

`ModuleWorkspace` jest ładowane na żądanie. Galeria ma osobny pakiet,
ładowany dopiero po jej otwarciu; zachowuje filtry i podgląd zdjęć.
Pozostałe moduły treści korzystają z `ModulePanel`, przełącznika Opis/Zdjęcia
i dotychczasowej karuzeli. Kontakt zawiera email, telefon i link do mapy.

Listę modułów (`MODULE_KEYS`) i kafelków (`LAUNCHER_KEYS`) edytujesz w
[`lib/modules.ts`](lib/modules.ts), a etykiety
i opisy przycisków w `launcher` i `nav` w [`lib/dictionaries.ts`](lib/dictionaries.ts).
Treść paneli jest w `modules` w tym samym słowniku. Zdjęcia kart i karuzeli
zmieniasz w `PANEL_IMAGES` i `SLIDE_IMAGES` w
[`components/ModuleWorkspace.tsx`](components/ModuleWorkspace.tsx).

## Karuzela zdjęć

[`components/Carousel.tsx`](components/Carousel.tsx) — cztery rozdzielone
warstwy, żeby kontrolka nigdy nie mieszała się ze zdjęciami:

```
<section aria-roledescription="carousel">
  <div>  viewport (gest swipe)     → <ul> tor ze slajdami
  <div>  kontrolki                 → [ ‹ ] [ scrubber ] [ › ]
  <ul>   kropki (wskaźnik pomocniczy)
```

- **Kafelki**: `rounded-m3-md`, zdjęcie 16:10 u góry, tonalny pasek z nazwą na dole.
  Dwa obok siebie od 768 px, jeden poniżej.
- **Scrubber** — stylizowany na suwak jasności Material You: jeden zaokrąglony
  tor (`rounded-full`, 48 px na mobile / 56 px na desktopie), ciemne wypełnienie
  od lewej, uchwyt jako jasna pionowa kapsuła na krawędzi wypełnienia, ikona
  galerii po lewej. To **nie** jest `<input type="range">` — to `div`
  z `role="slider"` i pełnym zestawem `aria-valuemin/max/now/valuetext`.
  Strona `p` zajmuje na torze przedział `(p/n, (p+1)/n]`, więc tor nigdy nie
  wygląda na pusty.
- **Sterowanie**: klik w dowolne miejsce toru, przeciąganie uchwytu (pointer
  events — mysz i dotyk), strzałki ←/→/↑/↓ oraz Home/End na scrubberze, swipe
  po zdjęciach (próg 60 px), okrągłe przyciski ‹ › po bokach toru. Każda z tych
  dróg aktualizuje wszystkie pozostałe wskaźniki.
- Przyciski mają stan `disabled` na końcach — karuzela nie zawija się.

## Sekcje i kotwice

`#witamy`, `#galeria`, `#aktualnosci`, `#kocieta`, `#koty`, `#hodowla`,
`#o-kotach`, `#kontakt` — zdefiniowane w `SECTION_IDS` w `lib/dictionaries.ts`.
Adres identyfikuje aktywny moduł. Przyciski na ekranie głównym
i powrót z modułów korzystają ze wspólnej nawigacji. Bezpośrednie linki, odświeżenie
oraz przyciski Wstecz/Dalej w przeglądarce przywracają odpowiedni widok.
Otwarcie modułu przenosi fokus na jego nagłówek; powrót na jego przycisk.

## Motyw i język

- Motyw: klasa `dark` na `<html>`, zapis w `localStorage` (`lc-theme`), domyślnie
  wg `prefers-color-scheme`. Skrypt w `<head>` ustawia klasę przed hydracją,
  więc przy odświeżeniu nie ma białego błysku.
- Język: `localStorage` (`lc-locale`), domyślnie `pl`, a przy braku zapisu —
  `en` dla przeglądarek nie-polskich. Atrybut `lang` na `<html>` jest aktualizowany.

## Logo

Źródło: `img/SVG/logo.svg`. Ścieżka jest wklejona inline w
[`components/Logo.tsx`](components/Logo.tsx) z `fill="currentColor"`, więc znak
sam dostosowuje kolor do trybu jasnego/ciemnego i do hovera (bez dwóch wersji
pliku). `viewBox` jest przycięty do bounding boxa ścieżki (`20 102 466 320`),
żeby nie było pustego marginesu wokół znaku.

- Nagłówek: znak + nazwa hodowli pismem odręcznym.
- Stopka: sam znak obok noty copyright.
- Favicon: [`app/icon.svg`](app/icon.svg) — ta sama ścieżka wypełniona gradientem
  `#D98CFF → #C420F5`. Next generuje `<link rel="icon">` automatycznie.
- `public/logo.svg` — kopia oryginału (czarny), do użycia poza aplikacją.

Po zmianie logotypu podmień `LOGO_PATH` i `LOGO_VIEW_BOX` w `components/Logo.tsx`
oraz `app/icon.svg`.

## Zdjęcia

Placeholdery w `/public` to gradienty — podmień je zachowując nazwy plików.
Szczegóły i proporcje: [`public/README.md`](public/README.md).
