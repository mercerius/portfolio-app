"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface ModalSlotPresenceProps {
  children: React.ReactNode;
}

// `isValidElement` and `cloneElement` cannot be used here: Next.js RSC passes
// parallel-route slot content as a React client reference whose $$typeof is
// Symbol.for('react.client.reference'), not Symbol.for('react.element').
// isValidElement returns false for these references, causing the modal never
// to render (and causing a hydration mismatch).
//
// Instead, use a keyed Fragment as the direct AnimatePresence child.
// Motion communicates exit via React context, so nested motion components
// with exit props still fire their animations even through a Fragment wrapper.
export function ModalSlotPresence({ children }: ModalSlotPresenceProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="sync">
      {children != null ? <Fragment key={pathname}>{children}</Fragment> : null}
    </AnimatePresence>
  );
}
