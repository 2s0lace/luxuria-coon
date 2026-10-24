"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SECTION_IDS } from "./dictionaries";
import { moduleFromHash, type ModuleKey } from "./modules";

type ModuleNavigation = {
  activeModule: ModuleKey | null;
  openModule: (module: ModuleKey | null) => void;
};

const ModuleContext = createContext<ModuleNavigation | null>(null);

export function ModuleNavigationProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);

  useEffect(() => {
    const sync = () => setActiveModule(moduleFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const openModule = useCallback((module: ModuleKey | null) => {
    const hash = `#${SECTION_IDS[module ?? "welcome"]}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    setActiveModule(module);
  }, []);

  const value = useMemo(() => ({ activeModule, openModule }), [activeModule, openModule]);
  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export function useModuleNavigation() {
  const context = useContext(ModuleContext);
  if (!context) throw new Error("Module navigation requires ModuleNavigationProvider");
  return context;
}
