"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { LiquidSurface } from "./LiquidSurface";
import { useLiquidMesh } from "../../hooks/useLiquidMesh";

const DESKTOP_MIN = 801;

export function LiquidHeader() {
  const [width, setWidth] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    let raf = 0;
    // Coalesce resize bursts: measuring every pixel tears down physics + RAF.
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const points = useLiquidMesh(width, reduceMotion);

  if (width < DESKTOP_MIN) return null;

  return (
    <div className="liquid-header">
      <LiquidSurface width={width} points={points} staticRender={reduceMotion} />
    </div>
  );
}