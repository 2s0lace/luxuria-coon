"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { ModuleNavigationProvider } from "@/lib/module-navigation";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ModuleNavigationProvider>{children}</ModuleNavigationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
