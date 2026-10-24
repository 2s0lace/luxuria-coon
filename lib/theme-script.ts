export const THEME_STORAGE_KEY = "lc-theme";

/**
 * Skrypt wstrzykiwany w <head> — ustawia klasę `dark` zanim React się zamontuje,
 * dzięki czemu przy odświeżeniu nie miga jasne tło.
 * Plik celowo bez "use client" — jest importowany także w Server Component.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;
