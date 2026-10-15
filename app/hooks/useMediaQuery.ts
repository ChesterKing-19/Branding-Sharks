"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// Layout effect on the client so the value settles *before* paint:
// consumers (e.g. the Work desktop/mobile fork) never flash the
// wrong branch for a frame. No-op on the server (SSR keeps defaultValue).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** SSR-safe media query hook. Defaults to `defaultValue` (false) on server. */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
