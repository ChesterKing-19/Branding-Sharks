"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BlobCursor = dynamic(() => import("./BlobCursor"), { ssr: false });

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("blob-cursor", enabled);
    return () => document.documentElement.classList.remove("blob-cursor");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <BlobCursor
      material="ink"
      color="#A8C814"
      blend="normal"
      size={24}
      morph={0}
      morphSpeed={0.4}
      depth={1}
      trail={16}
      lag={0}
      goo={1}
      stretch={0.6}
      wobble={0}
      drip={0}
      shine={1}
      splash
      splashCount={12}
      splashSpeed={0.5}
      splashSize={0.4}
      splashGravity={0}
      regrow={0.45}
      shadow={false}
      hideCursor={false}
    />
  );
}
