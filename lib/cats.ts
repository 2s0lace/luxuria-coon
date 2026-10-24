/** Photos live in /public/photos (1200×900 WebP); captions live in the dictionaries. */
export type GalleryPhoto = {
  id: string;
  src: string;
  captionIndex: number;
};

const photo = (name: string) => `/photos/${name}.webp`;

export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  { id: "luna-portrait", src: photo("luna"), captionIndex: 0 },
  { id: "odin-portrait", src: photo("odin-salon"), captionIndex: 1 },
  { id: "nala-portrait", src: photo("nala"), captionIndex: 2 },
  { id: "thor-portrait", src: photo("silver-walk"), captionIndex: 3 },
  { id: "freja-garden", src: photo("freja-garden"), captionIndex: 4 },
  { id: "litter-l-first-day", src: photo("litter-l-blanket"), captionIndex: 5 },
] as const;

/**
 * Photos of the other popups, in the order of their texts in the dictionaries:
 * `cards` match `modules.*.cards`, `slides` match `modules.*.slides`.
 */
export const MODULE_PHOTOS = {
  news: {
    cards: [photo("litter-l-nursing"), photo("show-rosette")],
    slides: [photo("litter-l-sleeping"), photo("show-weekend"), photo("odin-ring"), photo("kittens-salon")],
  },
  kittens: {
    cards: [photo("kitten-tabby"), photo("kitten-silver")],
    slides: [photo("nala"), photo("kittens-salon"), photo("kittens-play"), photo("kitten-scratcher")],
  },
  cats: {
    cards: [photo("odin-portrait"), photo("freja")],
    slides: [photo("odin-salon"), photo("luna"), photo("garden-odin"), photo("freja-litter")],
  },
  cattery: {
    cards: [photo("cat-home"), photo("pedigree")],
    slides: [photo("cat-salon"), photo("garden-netted"), photo("sleeping-bed"), photo("cat-tree-ceiling")],
  },
  about: {
    cards: [photo("gentle-giant"), photo("grooming")],
    slides: [photo("ear-tufts"), photo("tail"), photo("paws"), photo("silver-walk")],
  },
} as const;

/** What a popup shows on its first frame — decoded on the home page ahead of the first tap. */
export const FIRST_FRAME_PHOTOS: readonly string[] = [
  ...GALLERY_PHOTOS.slice(0, 2).map((p) => p.src),
  ...Object.values(MODULE_PHOTOS).flatMap((m) => m.cards),
];
