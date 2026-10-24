"use client";

import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

type SlotContextValue = {
  activeId: string;
  target: HTMLDivElement | null;
};

const SlotContext = createContext<SlotContextValue | null>(null);

export function ViewToggleSlotProvider({
  activeId,
  target,
  children,
}: SlotContextValue & { children: ReactNode }) {
  return (
    <SlotContext.Provider value={{ activeId, target }}>
      {children}
    </SlotContext.Provider>
  );
}

export function ViewTogglePortal({
  ownerId,
  children,
}: {
  ownerId: string;
  children: ReactNode;
}) {
  const slot = useContext(SlotContext);
  if (!slot?.target || slot.activeId !== ownerId) return null;
  return createPortal(children, slot.target);
}
