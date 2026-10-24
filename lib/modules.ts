import { SECTION_IDS } from "./dictionaries";

/** Add a module here, its translated launcher copy, and its workspace content. */
export const MODULE_KEYS = ["kittens", "cats", "gallery", "news", "cattery", "about", "contact"] as const;
export type ModuleKey = (typeof MODULE_KEYS)[number];

/** Kittens open from the header menu; contact has its own compact button. */
export const LAUNCHER_KEYS = ["cats", "gallery", "news", "cattery", "about"] as const satisfies readonly ModuleKey[];

export function moduleFromHash(hash: string): ModuleKey | null {
  return MODULE_KEYS.find((key) => `#${SECTION_IDS[key]}` === hash) ?? null;
}
