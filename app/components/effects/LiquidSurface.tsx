"use client";

import { useEffect, useRef, type RefObject } from "react";
import { type LiquidPoint } from "../../hooks/useLiquidMesh";

const FILL = "#101113";

export function LiquidSurface({
  width,
  points,
  staticRender = false,
}: {
  width: number;
  points: RefObject<LiquidPoint[]>;
  staticRender?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const paint = () => {
      const baseY = 124;

      let d = `M 0 0 L 0 ${baseY}`;

      for (const point of points.current) {
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
        d += `L ${point.x} ${baseY + point.y}`;
      }

      d += `L ${width} 0 Z`;

      if (pathRef.current) {
        pathRef.current.setAttribute("d", d);
      }
    };

    // Reduced-motion: paint once, no continuous RAF.
    if (staticRender) {
      paint();
      return;
    }

    let frame: number;

    const render = () => {
      paint();
      frame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frame);
  }, [width, points, staticRender]);

  return (
    <svg className="liquid-surface" aria-hidden>
      <path ref={pathRef} fill={FILL} />
    </svg>
  );
}