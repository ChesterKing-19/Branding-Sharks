"use client";

import { useEffect, useRef, type RefObject } from "react";
import { type LiquidPoint } from "../../hooks/useLiquidMesh";

const FILL = "#101113";

export function LiquidSurface({
  width,
  points,
}: {
  width: number;
  points: RefObject<LiquidPoint[]>;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let frame: number;

    const render = () => {
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

      frame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frame);
  }, [width, points]);

  return (
    <svg className="liquid-surface" aria-hidden>
      <path ref={pathRef} fill={FILL} />
    </svg>
  );
}