"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function getSnapshot(query: string): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(query).matches;
}

/**
 * SSR-safe media query hook. Unlike an effect-based version, the value is
 * read synchronously during render, so consumers (e.g. the Work
 * desktop/mobile fork) render the correct branch on the very first client
 * pass — the wrong branch never mounts, not even for a frame, and an
 * expensive engine (WebGL carousel) never initializes just to be torn down.
 * Defaults to `defaultValue` (false) on the server.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const subscribe = (onChange: () => void) => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return emptySubscribe();
    }
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot(query),
    () => defaultValue
  );
}
