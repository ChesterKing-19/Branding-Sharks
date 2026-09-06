import { useEffect, useRef, type RefObject } from "react";

export type LiquidPoint = {
  x: number;
  y: number;
  velocity: number;
};

const POINTS = 96;
const DESKTOP_MIN = 801;

export function useLiquidMesh(width: number): RefObject<LiquidPoint[]> {
  const pointsRef = useRef<LiquidPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 9999 });
  const widthRef = useRef(width);
  const prevWidthRef = useRef(width);

  useEffect(() => {
    let points = pointsRef.current;

    if (points.length === 0 || prevWidthRef.current === 0) {
      points = Array.from({ length: POINTS }, (_, i) => ({
        x: (i / (POINTS - 1)) * width,
        y: 0,
        velocity: 0,
      }));
      pointsRef.current = points;
    } else if (prevWidthRef.current !== width) {
      const scale = width / prevWidthRef.current;
      for (const point of points) {
        point.x *= scale;
      }
    }

    prevWidthRef.current = width;
    widthRef.current = width;

    if (width < DESKTOP_MIN) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove);

    let frame: number;

    const animate = () => {
      const stiffness = 0.03;
      const damping = 0.93;
      const spread = 0.1;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const point of points) {
        const dx = Math.abs(point.x - mx);

        if (dx < 400) {
          const influence = 1 - dx / 400;
          const proximity = Math.max(0, Math.min(1, 1 - (my - 90) / 500));
          point.velocity += influence * proximity * 0.8;
        }

        point.velocity += -point.y * stiffness;
        point.velocity *= damping;
      }

      for (let k = 0; k < 8; k++) {
        for (let i = 0; i < points.length; i++) {
          if (i > 0) {
            points[i - 1].velocity += spread * (points[i].y - points[i - 1].y);
          }
          if (i < points.length - 1) {
            points[i + 1].velocity += spread * (points[i].y - points[i + 1].y);
          }
        }
      }

      for (const point of points) {
        point.y += point.velocity;

        if (!Number.isFinite(point.y)) {
          point.y = 0;
          point.velocity = 0;
        }

        point.y = Math.max(-28, Math.min(44, point.y));
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, [width]);

  return pointsRef;
}