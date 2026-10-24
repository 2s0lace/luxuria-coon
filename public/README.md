# Zdjęcia

Projekt demonstracyjny: zdjęcia kotów są wygenerowane przez AI, a hodowla
i dane kontaktowe są przykładowe. Podmieniając plik, zachowaj nazwę i proporcje,
wtedy kod nie wymaga zmian.

| Plik                   | Proporcje | Sugerowany rozmiar | Gdzie się pojawia                    |
| ---------------------- | --------- | ------------------ | ------------------------------------ |
| `og-image.jpg`         | 1.91:1    | 1200 × 630         | Podgląd linku, Open Graph / Twitter (`app/layout.tsx`) |
| `photos/*.webp`        | 4:3       | 1200 × 900         | Galeria i popupy sekcji (`lib/cats.ts`) |

Zdjęcia w `photos/` to gotowe, zmniejszone wersje (WebP, ok. 100 KB). Oryginały
w pełnej rozdzielczości leżą poza `public`, w [`zrodla-zdjec/`](../zrodla-zdjec),
żeby nie trafiały na serwer. Które zdjęcie trafia do którego miejsca, ustawiasz
w [`lib/cats.ts`](../lib/cats.ts) (`GALLERY_PHOTOS`, `MODULE_PHOTOS`).

Podpisy pod zdjęciami (PL i EN) edytujesz w
[`lib/dictionaries.ts`](../lib/dictionaries.ts) → `gallery.captions` oraz
`modules.*.cards` / `modules.*.slides`.
