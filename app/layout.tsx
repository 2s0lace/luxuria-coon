import type { Metadata, Viewport } from "next";
import { Albert_Sans } from "next/font/google";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import { dictionaries } from "@/lib/dictionaries";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

const albertSans = Albert_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-albert-sans",
});

const matemasie = localFont({
  src: "./fonts/Matemasie-Regular.ttf",
  display: "swap",
  weight: "400",
  variable: "--font-matemasie",
});

const pl = dictionaries.pl;

export const metadata: Metadata = {
  metadataBase: new URL("https://luxuriacoon.pl"),
  title: {
    default: pl.meta.title,
    template: "%s | Luxuria Coon",
  },
  description: pl.meta.description,
  keywords: [
    "hodowla maine coon",
    "kocięta maine coon",
    "maine coon Polska",
    "koty rasowe",
    "kot z rodowodem",
  ],
  authors: [{ name: "Luxuria Coon" }],
  alternates: {
    canonical: "/",
    languages: { pl: "/" },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    alternateLocale: ["en_GB"],
    url: "/",
    siteName: "Luxuria Coon",
    title: pl.meta.title,
    description: pl.meta.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: pl.meta.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pl.meta.title,
    description: pl.meta.description,
    images: ["/og-image.jpg"],
  },
  // Demo site with a made-up cattery: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F5EE" },
    { media: "(prefers-color-scheme: dark)", color: "#141218" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${albertSans.variable} ${matemasie.variable}`}
        style={{
          fontFamily: "var(--font-albert-sans), system-ui, sans-serif",
        }}
      >
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
