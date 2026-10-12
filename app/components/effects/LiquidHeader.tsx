"use client";

import { useEffect, useState } from "react";

import { LiquidSurface } from "./LiquidSurface";
import { useLiquidMesh } from "../../hooks/useLiquidMesh";

const DESKTOP_MIN = 801;

export function LiquidHeader() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const measure = () => setWidth(window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const points = useLiquidMesh(width);

  if (width < DESKTOP_MIN) return null;

  return (
    <div className="liquid-header">
      <LiquidSurface width={width} points={points} />
    </div>
  );
}