export type Locale = "pl" | "en";

export const DEFAULT_LOCALE: Locale = "pl";

/**
 * Stałe adresy modułów — wspólne dla nawigacji i bezpośrednich linków.
 */
export const SECTION_IDS = {
  welcome: "witamy",
  news: "aktualnosci",
  kittens: "kocieta",
  cats: "koty",
  cattery: "hodowla",
  about: "o-kotach",
  gallery: "galeria",
  contact: "kontakt",
} as const;

/** Jednoliterowe słowa (i, w, z, a, o, u…), które nie mogą zostać same na końcu wiersza. */
const SHORT_WORD = /(^|[\s\u00A0(„"“])([aiouwzAIOUWZ]) +/g;

/**
 * Zasada polskiej typografii: spójnik czy przyimek z jednej litery wiąże się
 * twardą spacją z następnym słowem, żeby nie wisiał na końcu linii. Dwa przebiegi,
 * bo przy „i w domu” pierwszy zjada spację, od której zaczyna się drugie dopasowanie.
 * Po literze łapiemy tylko zwykłe spacje — `\s` złapałby też wstawioną już twardą.
 */
function tieShortWords<T>(value: T): T {
  if (typeof value === "string") {
    const tie = (text: string) => text.replace(SHORT_WORD, (_, before: string, word: string) => `${before}${word}\u00A0`);
    return tie(tie(value)) as T;
  }
  if (Array.isArray(value)) return value.map(tieShortWords) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, tieShortWords(item)])) as T;
  }
  return value;
}

export const dictionaries = tieShortWords({
  pl: {
    meta: {
      title: "Luxuria Coon | Hodowla Maine Coon",
      description:
        "Luxuria Coon to mała, domowa hodowla Maine Coonów we Wrocławiu. Kocięta z rodowodem FPL/FIFe, przebadani rodzice i dzieciństwo na kanapie, a nie w klatce. Poznaj nasze koty.",
      ogAlt: "Kot rasy Maine Coon z hodowli Luxuria Coon",
    },
    brand: "Luxuria Coon",
    launcher: {
      title: "Poznaj nasz świat",
      home: "Ekran główny",
      close: "Zamknij",
      descriptions: {
        kittens: "Najmłodsi domownicy",
        cats: "Rodzice naszych miotów",
        gallery: "Chwile z codzienności",
        news: "Co u nas słychać",
        cattery: "Dom, w którym dorastają",
        about: "Charakter łagodnego olbrzyma",
        contact: "Porozmawiajmy o Twoim kocie",
      },
    },
    panelView: {
      text: "Opis",
      photos: "Zdjęcia",
    },
    card: {
      toggle: {
        show: "Pokaż wizytówkę",
        back: "Wróć do menu",
      },
      tagline: "Kameralna hodowla Maine Coon · Wrocław",
    },
    nav: {
      main: "Nawigacja główna",
      welcome: "Witamy",
      news: "Aktualności",
      kittens: "Kocięta",
      cats: "Nasze koty",
      cattery: "Hodowla",
      about: "O rasie",
      gallery: "Galeria",
      contact: "Kontakt",
      openMenu: "Otwórz menu",
      closeMenu: "Zamknij menu",
    },
    hero: {
      titleBefore: "Twój",
      titleHighlight: "luksusowy",
      titleAfter: "sposób na Maine Coony. Witamy!",
      lead: "Mała, domowa hodowla Maine Coonów. Nasze kociaki dorastają z nami na kanapie, mają rodowód FPL/FIFe i przebadanych rodziców.",
      ctaPrimary: "Zobacz kocięta",
      ctaSecondary: "Napisz do nas",
      imageAlt: "Dorosły kot Maine Coon siedzący na jasnym tle",
      selectCat: "Wybierz kota na ekranie głównym",
      femaleCat: "Dziewczynka",
      maleCat: "Chłopiec",
      // Dane przykładowe do podmiany przed publikacją.
      catNameLabel: "Imię",
      catAgeLabel: "Wiek",
      catDetails: {
        female: { name: "Freja", age: "4 lata" },
        male: { name: "Odin", age: "4 lata" },
      },
      catteryStatus: {
        title: "Status hodowli",
        litterLabel: "Aktualny miot",
        litterName: "Miot L",
        parents: "Freja × Odin",
        availableLabel: "Szukają domu",
        available: "3 kocięta",
        total: "z 6 w miocie",
      },
    },
    gallery: {
      title: "Galeria",
      description:
        "Tak wygląda u nas zwykły dzień: drzemki w słońcu, gonitwy po salonie i pierwsze, chwiejne kroki kociąt. Nikt tu nie pozuje. Nowe zdjęcia dokładamy na bieżąco, więc zaglądaj, kiedy zatęsknisz.",
      captions: [
        "Luna, czarny marmurek",
        "Odin, red tabby",
        "Nala, 9 tygodni",
        "Thor, blue silver",
        "Freja na spacerze w ogrodzie",
        "Miot L, pierwszy dzień na łapkach",
      ],
    },
    carousel: {
      region: "Karuzela zdjęć",
      prev: "Poprzednie zdjęcia",
      next: "Następne zdjęcia",
      scrubber: "Pozycja karuzeli",
      goToPage: (n: number) => `Przejdź do strony ${n}`,
      pageOf: (n: number, total: number) => `Strona ${n} z ${total}`,
    },
    /** Etykiety obu modułów — dla czytników ekranu (aria-label listy zakładek) */
    moduleLabels: {
      media: "Galeria, aktualności i kocięta",
      cattery: "Nasze koty, hodowla i rasa",
    },
    /** Panele modułów z zakładkami (ControlModule) */
    modules: {
      news: {
        title: "Aktualności",
        body: "Miot L już jest! Freja i Odin doczekali się szóstki kociąt, a połowa z nich ma już swoich przyszłych ludzi. Marzysz o maluchu z kolejnego miotu? Zapisz się na listę oczekujących, a odezwiemy się do Ciebie osobiście, zanim ktokolwiek inny się dowie.",
        cards: [
          { title: "Miot L", desc: "Sześć kociąt, urodzone 12 czerwca" },
          { title: "Wystawa w Poznaniu", desc: "Odin wrócił z tytułem Best in Show" },
        ],
        slides: [
          "Pierwsze dni miotu L",
          "Wystawowy weekend",
          "Odin na ringu",
          "Kocięta poznają dom",
        ],
      },
      kittens: {
        title: "Kocięta",
        body: "Kocięta wyjeżdżają od nas najwcześniej w 13. tygodniu życia. Są wtedy zaszczepione, odrobaczone, mają rodowód i wyprawkę, która pachnie domem. Wcześniej poznają u nas świat: szum odkurzacza, śmiech dzieci i to, że ludzkie ręce są bezpieczne. A po odbiorze? Zostajemy w kontakcie tak długo, jak zechcesz.",
        cards: [
          { title: "Kocię A, kotka", desc: "Black tabby, czeka na swój dom" },
          { title: "Kocię B, kocur", desc: "Blue silver, już zarezerwowany" },
        ],
        slides: [
          "Kocię A, portret",
          "Kocię B, portret",
          "Zabawa w salonie",
          "Pierwszy drapak",
        ],
      },
      cats: {
        title: "Nasze koty",
        body: "Odin i Freja to serce naszej hodowli. Pochodzą z cenionych europejskich linii i mają komplet badań genetycznych i kardiologicznych. Chętnie pokażemy wyniki każdemu, kto zapyta. Poza tym to zwykli domownicy, każde z własnym ulubionym miejscem na kanapie.",
        cards: [
          { title: "Odin", desc: "Red tabby, spokojny dżentelmen" },
          { title: "Freja", desc: "Black silver, troskliwa mama" },
        ],
        slides: [
          "Odin, portret",
          "Freja, portret",
          "Odin w ogrodzie",
          "Freja z miotem",
        ],
      },
      cattery: {
        title: "Hodowla",
        body: "Jesteśmy małą, rodzinną hodowlą, zarejestrowaną w FPL/FIFe od 2019 roku. Nie mamy klatek ani osobnych kocich pokoi. Koty mieszkają z nami, mają cały parter i zabezpieczony ogród. Miotów jest u nas niewiele, bo luksus to dla nas czas: dla każdego kota i dla każdego, kto nas odwiedza.",
        cards: [
          { title: "Dom, nie klatki", desc: "Cały parter i ogród należą do nich" },
          { title: "Rejestracja", desc: "FPL / FIFe, od 2019 roku" },
        ],
        slides: [
          "Salon kotów",
          "Ogród zabezpieczony siatką",
          "Kącik do spania",
          "Drapak pod sufit",
        ],
      },
      about: {
        title: "O rasie",
        body: "Maine Coon to największa rasa kotów domowych i jedna z najłagodniejszych. Wygląda jak ryś, a zachowuje się jak przytulanka: chodzi za Tobą z pokoju do pokoju, „rozmawia” cichym trelem i dorasta powoli, nawet do czwartego roku życia. To kot dla kogoś, kto szuka przyjaciela, a nie ozdoby.",
        cards: [
          { title: "Łagodny olbrzym", desc: "Dorosły kocur waży 8–12 kg" },
          { title: "Pielęgnacja", desc: "Wystarczy szczotkowanie raz w tygodniu" },
        ],
        slides: [
          "Kity na uszach",
          "Puszysty ogon",
          "Duże, owłosione łapy",
          "Sylwetka dorosłego kocura",
        ],
      },
    },
    sections: {
      contact: {
        title: "Kontakt",
        kicker: "Porozmawiajmy",
        body: "Najlepiej poznać się na żywo. Umów wizytę, zobacz, jak mieszkają nasze koty, i zadaj wszystkie pytania przy kawie. Na każdą wiadomość odpowiadamy sami, zwykle jeszcze tego samego dnia.",
        email: "kontakt@luxuriacoon.pl",
        phone: "+48 600 000 000",
        city: "Wrocław, Polska",
        map: "Otwórz lokalizację w Mapach Google",
        aiNote: "Strona zaprojektowana z użyciem AI",
        demoNote: "To strona demonstracyjna: hodowla, dane kontaktowe i profile są przykładowe.",
      },
    },
    footer: {
      rights: "© 2026 Luxuria Coon · projekt demonstracyjny",
      social: "Media społecznościowe (demo)",
      credit: "Made by 2s0lace Patryk",
    },
    toggles: {
      language: "Zmień język",
      theme: "Zmień motyw",
      toLight: "Włącz tryb jasny",
      toDark: "Włącz tryb ciemny",
    },
  },

  en: {
    meta: {
      title: "Luxuria Coon | Maine Coon Cattery",
      description:
        "Luxuria Coon is a small, home-based Maine Coon cattery in Wrocław. FPL/FIFe pedigree kittens, health-tested parents and a childhood on the sofa, not in a cage. Meet our cats.",
      ogAlt: "A Maine Coon cat from the Luxuria Coon cattery",
    },
    brand: "Luxuria Coon",
    launcher: {
      title: "Explore our world",
      home: "Home screen",
      close: "Close",
      descriptions: {
        kittens: "The youngest of the family",
        cats: "The parents of our litters",
        gallery: "Everyday moments",
        news: "The latest from us",
        cattery: "The home they grow up in",
        about: "The gentle giant’s character",
        contact: "Let’s talk about your future cat",
      },
    },
    panelView: {
      text: "Description",
      photos: "Photos",
    },
    card: {
      toggle: {
        show: "Show business card",
        back: "Back to menu",
      },
      tagline: "Boutique Maine Coon cattery · Wrocław",
    },
    nav: {
      main: "Main navigation",
      welcome: "Welcome",
      news: "News",
      kittens: "Kittens",
      cats: "Our cats",
      cattery: "Cattery",
      about: "The breed",
      gallery: "Gallery",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      titleBefore: "Your",
      titleHighlight: "luxurious",
      titleAfter: "way to get into Maine Coons. Welcome!",
      lead: "A small, home-based Maine Coon cattery. Our kittens grow up with us on the sofa, with FPL/FIFe pedigrees and health-tested parents.",
      ctaPrimary: "See the kittens",
      ctaSecondary: "Get in touch",
      imageAlt: "An adult Maine Coon cat sitting against a light background",
      selectCat: "Choose the welcome screen cat",
      femaleCat: "Female cat",
      maleCat: "Male cat",
      // Demo details; replace before publishing.
      catNameLabel: "Name",
      catAgeLabel: "Age",
      catDetails: {
        female: { name: "Freja", age: "4 years old" },
        male: { name: "Odin", age: "4 years old" },
      },
      catteryStatus: {
        title: "Cattery status",
        litterLabel: "Current litter",
        litterName: "Litter L",
        parents: "Freja × Odin",
        availableLabel: "Looking for a home",
        available: "3 kittens",
        total: "of 6 in the litter",
      },
    },
    gallery: {
      title: "Gallery",
      description:
        "This is an ordinary day at ours: naps in the sun, chases around the living room and the kittens’ first wobbly steps. Nobody’s posing. We add new photos all the time, so drop by whenever you miss them.",
      captions: [
        "Luna, black blotched tabby",
        "Odin, red tabby",
        "Nala, 9 weeks old",
        "Thor, blue silver",
        "Freja out for a garden stroll",
        "Litter L, first day on their paws",
      ],
    },
    carousel: {
      region: "Photo carousel",
      prev: "Previous photos",
      next: "Next photos",
      scrubber: "Carousel position",
      goToPage: (n: number) => `Go to page ${n}`,
      pageOf: (n: number, total: number) => `Page ${n} of ${total}`,
    },
    /** Module labels — for screen readers (tablist aria-label) */
    moduleLabels: {
      media: "Gallery, news and kittens",
      cattery: "Our cats, the cattery and the breed",
    },
    /** Tabbed module panels (ControlModule) */
    modules: {
      news: {
        title: "News",
        body: "Litter L is here! Freja and Odin are the proud parents of six, and half of the kittens already have their future people. Dreaming of one from the next litter? Join the waiting list and we’ll get in touch personally, before anyone else hears about it.",
        cards: [
          { title: "Litter L", desc: "Six kittens, born 12 June" },
          { title: "Poznań cat show", desc: "Odin came home with Best in Show" },
        ],
        slides: [
          "Litter L, first days",
          "Show weekend",
          "Odin in the ring",
          "Kittens exploring the house",
        ],
      },
      kittens: {
        title: "Kittens",
        body: "Our kittens leave for their new homes at 13 weeks at the earliest. By then they’re vaccinated, dewormed and come with a pedigree and a starter kit that smells like home. Before that, they learn about the world with us: the hum of the vacuum, kids laughing and that human hands are safe. And after pick-up? We stay in touch for as long as you like.",
        cards: [
          { title: "Kitten A, female", desc: "Black tabby, waiting for her home" },
          { title: "Kitten B, male", desc: "Blue silver, already reserved" },
        ],
        slides: [
          "Kitten A, portrait",
          "Kitten B, portrait",
          "Playtime in the living room",
          "The first cat tree",
        ],
      },
      cats: {
        title: "Our cats",
        body: "Odin and Freja are the heart of our cattery. They come from respected European lines and have full genetic and cardiac screening. We’re happy to show the results to anyone who asks. Otherwise they’re just family, each with a favourite spot on the sofa.",
        cards: [
          { title: "Odin", desc: "Red tabby, a calm gentleman" },
          { title: "Freja", desc: "Black silver, a devoted mother" },
        ],
        slides: [
          "Odin, portrait",
          "Freja, portrait",
          "Odin in the garden",
          "Freja with her litter",
        ],
      },
      cattery: {
        title: "Cattery",
        body: "We’re a small family cattery, registered with FPL/FIFe since 2019. No cages, no separate cat rooms. Our cats live with us and have the whole ground floor and a secure garden. We only have a few litters a year, because to us luxury means time: for every cat and for everyone who visits.",
        cards: [
          { title: "A home, not cages", desc: "The ground floor and garden are theirs" },
          { title: "Registration", desc: "FPL / FIFe, since 2019" },
        ],
        slides: [
          "The cats living room",
          "The netted garden",
          "A sleeping corner",
          "Floor-to-ceiling cat tree",
        ],
      },
      about: {
        title: "The breed",
        body: "The Maine Coon is the largest domestic cat breed, and one of the gentlest. It looks like a lynx and acts like a teddy bear: it follows you from room to room, “talks” in soft trills and takes its time growing up, up to four years. It’s a cat for someone looking for a friend, not an ornament.",
        cards: [
          { title: "Gentle giant", desc: "An adult male weighs 8–12 kg" },
          { title: "Grooming", desc: "Brushing once a week is enough" },
        ],
        slides: [
          "Ear tufts",
          "A bushy tail",
          "Big, tufted paws",
          "The build of an adult male",
        ],
      },
    },
    sections: {
      contact: {
        title: "Contact",
        kicker: "Let's talk",
        body: "Meeting in person is best. Book a visit, see how our cats live and ask all your questions over coffee. We answer every message ourselves, usually the same day.",
        email: "kontakt@luxuriacoon.pl",
        phone: "+48 600 000 000",
        city: "Wrocław, Poland",
        map: "Open the location in Google Maps",
        aiNote: "Website designed with the help of AI",
        demoNote: "This is a demo site: the cattery, contact details and profiles are made up.",
      },
    },
    footer: {
      rights: "© 2026 Luxuria Coon · demo project",
      social: "Social media (demo)",
      credit: "Made by 2s0lace Patryk",
    },
    toggles: {
      language: "Change language",
      theme: "Change theme",
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
  },
} as const);

export type Dictionary = (typeof dictionaries)[Locale];

/** Klucze paneli w modułach z zakładkami */
export type ModuleKey = keyof Dictionary["modules"];

/**
 * Szerszy odpowiednik wpisu z `modules` — słowniki są `as const`, więc
 * bez tego typu odczyt `t.modules[key]` daje unię krotek, po której nie da się
 * wygodnie iterować.
 */
export type PanelContent = {
  title: string;
  body: string;
  extended?: readonly string[];
  cards: readonly { title: string; desc: string }[];
  slides: readonly string[];
};
