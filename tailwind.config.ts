import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material 3 system color roles.
        primary: {
          DEFAULT: "rgb(var(--md-primary) / <alpha-value>)",
          foreground: "rgb(var(--md-on-primary) / <alpha-value>)",
          container: "rgb(var(--md-primary-container) / <alpha-value>)",
          "on-container": "rgb(var(--md-on-primary-container) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--md-secondary) / <alpha-value>)",
          foreground: "rgb(var(--md-on-secondary) / <alpha-value>)",
          container: "rgb(var(--md-secondary-container) / <alpha-value>)",
          "on-container": "rgb(var(--md-on-secondary-container) / <alpha-value>)",
        },
        tertiary: {
          DEFAULT: "rgb(var(--md-tertiary) / <alpha-value>)",
          foreground: "rgb(var(--md-on-tertiary) / <alpha-value>)",
          container: "rgb(var(--md-tertiary-container) / <alpha-value>)",
          "on-container": "rgb(var(--md-on-tertiary-container) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--md-surface) / <alpha-value>)",
          container: {
            lowest: "rgb(var(--md-surface-container-lowest) / <alpha-value>)",
            low: "rgb(var(--md-surface-container-low) / <alpha-value>)",
            DEFAULT: "rgb(var(--md-surface-container) / <alpha-value>)",
            high: "rgb(var(--md-surface-container-high) / <alpha-value>)",
            highest: "rgb(var(--md-surface-container-highest) / <alpha-value>)",
          },
        },
        on: {
          surface: "rgb(var(--md-on-surface) / <alpha-value>)",
          "surface-variant": "rgb(var(--md-on-surface-variant) / <alpha-value>)",
        },
        outline: {
          DEFAULT: "rgb(var(--md-outline) / <alpha-value>)",
          variant: "rgb(var(--md-outline-variant) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-albert-sans)", "system-ui", "sans-serif"],
        brand: ["var(--font-matemasie)", "cursive"],
      },
      borderRadius: {
        "m3-none": "var(--md-shape-none)",
        "m3-xs": "var(--md-shape-xs)",
        "m3-sm": "var(--md-shape-sm)",
        "m3-md": "var(--md-shape-md)",
        "m3-lg": "var(--md-shape-lg)",
        "m3-xl": "var(--md-shape-xl)",
        "m3-full": "var(--md-shape-full)",
      },
      backgroundImage: {
        scrim:
          "linear-gradient(to top, rgb(var(--md-surface) / 0.92), transparent)",
      },
      transitionTimingFunction: {
        pixel: "var(--ease-standard)",
        exit: "var(--ease-exit)",
        spring: "var(--ease-spring-soft)",
      },
      transitionDuration: {
        short: "200ms",
        medium: "300ms",
        long: "500ms",
      },
    },
  },
  plugins: [],
};

export default config;
