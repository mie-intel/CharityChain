"use client";

import { useEffect, useState } from "react";
import useBreakpoint from "use-breakpoint";

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Custom hook to determine the current Tailwind CSS breakpoint.
 *
 * @returns {Object} - An object containing boolean values for each breakpoint:
 *                     { isSm, isMd, isLg, isXl, is2Xl }.
 *
 * @example
 * const { isSm, isMd, isLg, isXl, is2Xl } = useTailwindBreakpoint();
 * if (isLg) {
 *   console.log("Large breakpoint or above");
 * }
 */

export function useTailwindBreakpoint() {
  const { minWidth } = useBreakpoint(BREAKPOINTS);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);

  useEffect(() => {
    if (minWidth) {
      setCurrentBreakpoint([
        minWidth >= BREAKPOINTS.sm,
        minWidth >= BREAKPOINTS.md,
        minWidth >= BREAKPOINTS.lg,
        minWidth >= BREAKPOINTS.xl,
        minWidth >= BREAKPOINTS["2xl"],
      ]);
    } else {
      setCurrentBreakpoint([false, false, false, false, false]);
    }
  }, [minWidth]);

  const [isSm, isMd, isLg, isXl, is2Xl] = currentBreakpoint;
  return { isSm, isMd, isLg, isXl, is2Xl };
}
