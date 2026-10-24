"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { SECTION_IDS } from "@/lib/dictionaries";
import { useModuleNavigation } from "@/lib/module-navigation";
import type { ModuleKey } from "@/lib/modules";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & { module: ModuleKey | null };

const ModuleLink = forwardRef<HTMLAnchorElement, Props>(function ModuleLink(
  { module, onClick, ...props }, ref,
) {
  const { openModule } = useModuleNavigation();
  return (
    <a
      {...props}
      ref={ref}
      href={`#${SECTION_IDS[module ?? "welcome"]}`}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openModule(module);
      }}
    />
  );
});

export default ModuleLink;
