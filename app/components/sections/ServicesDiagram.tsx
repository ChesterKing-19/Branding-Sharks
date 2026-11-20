"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { REFERENCE_OUTCOMES, REFERENCE_SERVICES } from "../../data/content";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import "./Services.css";

const COMPACT_QUERY = "(max-width: 839px)";
const IN_COUNT = 5;
const OUT_COUNT = 9;

type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

const round = (value: number) => Math.round(value * 100) / 100;

/** Layout box in ancestor coordinates; offset* ignores GSAP transforms. */
function boxOf(el: HTMLElement, ancestor: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;

  for (let i = 0; i < 16 && node; i += 1) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    if (!parent || parent === ancestor) break;
    node = parent;
  }

  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function curve(a: Point, c1: Point, c2: Point, b: Point): string {
  return `M ${round(a.x)} ${round(a.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(
    c2.x
  )} ${round(c2.y)}, ${round(b.x)} ${round(b.y)}`;
}

/** Head tail is sampled from the real stroke so it can never float off it. */
function headPath(tail: Point, tip: Point, size: number): string {
  const dx = tip.x - tail.x;
  const dy = tip.y - tail.y;
  const length = Math.hypot(dx, dy) || 1;
  const half = (size * 0.44 * 1) / 1;
  const px = (-dy / length) * half;
  const py = (dx / length) * half;
  return `M ${round(tail.x + px)} ${round(tail.y + py)} L ${round(tip.x)} ${round(
    tip.y
  )} L ${round(tail.x - px)} ${round(tail.y - py)} Z`;
}

function headSize(a: Point, b: Point): number {
  return Math.min(11, Math.max(8, Math.hypot(b.x - a.x, b.y - a.y) * 0.24));
}

/**
 * The reference loop: the hub snaps down from a close-up, the pastel service
 * pills fly in from the left, portraits pop in on the right, everything holds,
 * then both sides scatter outward as the hub zooms back in.
 */
export function ServicesDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  /* ---- connectors ---- */
  useEffect(() => {
    const diagram = diagramRef.current;
    const svg = svgRef.current;
    const hubEl = hubRef.current;
    if (!diagram || !svg || !hubEl) return;

    const linesIn = Array.from(
      svg.querySelectorAll<SVGPathElement>(".js-arrow-in")
    );
    const headsIn = Array.from(
      svg.querySelectorAll<SVGPathElement>(".js-arrow-in-head")
    );
    const linesOut = Array.from(
      svg.querySelectorAll<SVGPathElement>(".js-arrow-out")
    );
    const headsOut = Array.from(
      svg.querySelectorAll<SVGPathElement>(".js-arrow-out-head")
    );
    const nodesIn = Array.from(
      svg.querySelectorAll<SVGCircleElement>(".js-node-in")
    );
    const nodesOut = Array.from(
      svg.querySelectorAll<SVGCircleElement>(".js-node-out")
    );
    const gradsIn = Array.from(
      svg.querySelectorAll<SVGLinearGradientElement>(".js-grad-in")
    );
    const gradsOut = Array.from(
      svg.querySelectorAll<SVGLinearGradientElement>(".js-grad-out")
    );
    const flowsIn = Array.from(
      svg.querySelectorAll<SVGPathElement>(".js-flow-in")
    );
    const flowsOut = Array.from(
      svg.querySelectorAll<SVGPathElement>(".js-flow-out")
    );

    const draw = (
      index: number,
      a: Point,
      c1: Point,
      c2: Point,
      b: Point,
      lines: SVGPathElement[],
      heads: SVGPathElement[],
      nodes: SVGCircleElement[],
      grads: SVGLinearGradientElement[],
      flows: SVGPathElement[]
    ) => {
      const line = lines[index];
      const head = heads[index];
      if (!line) return;
      const d = curve(a, c1, c2, b);
      line.setAttribute("d", d);
      flows[index]?.setAttribute("d", d);

      const grad = grads[index];
      if (grad) {
        grad.setAttribute("x1", String(round(a.x)));
        grad.setAttribute("y1", String(round(a.y)));
        grad.setAttribute("x2", String(round(b.x)));
        grad.setAttribute("y2", String(round(b.y)));
      }

      const node = nodes[index];
      if (node) {
        node.setAttribute("cx", String(round(b.x)));
        node.setAttribute("cy", String(round(b.y)));
        node.setAttribute("r", "2.2");
      }

      if (head) {
        const size = headSize(a, b);
        const tail = line.getPointAtLength(
          Math.max(0, line.getTotalLength() - size)
        );
        head.setAttribute("d", headPath(tail, b, size));
      }
    };

    const hide = (
      index: number,
      lines: SVGPathElement[],
      heads: SVGPathElement[],
      nodes: SVGCircleElement[],
      flows: SVGPathElement[]
    ) => {
      lines[index]?.setAttribute("d", "");
      heads[index]?.setAttribute("d", "");
      nodes[index]?.setAttribute("r", "0");
      flows[index]?.setAttribute("d", "");
    };

    const measure = () => {
      const width = diagram.clientWidth;
      const height = diagram.clientHeight;
      if (width < 2 || height < 2) return;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      const pills = Array.from(
        diagram.querySelectorAll<HTMLElement>(".js-svc")
      );
      const outcomes = Array.from(
        diagram.querySelectorAll<HTMLElement>(".js-out")
      );
      const cluster = diagram.querySelector<HTMLElement>(
        ".services-diagram__cluster"
      );
      if (pills.length < 17 || outcomes.length < OUT_COUNT || !cluster) return;

      const hub = boxOf(hubEl, diagram);
      const compact = window.matchMedia(COMPACT_QUERY).matches;

      if (glowRef.current) {
        const shift = compact ? hub.y + hub.h / 2 - height / 2 : 0;
        glowRef.current.style.transform =
          Math.abs(shift) < 0.5 ? "" : `translateY(${round(shift)}px)`;
      }

      if (compact) {
        const clusterBox = boxOf(cluster, diagram);
        const bottom = clusterBox.y + clusterBox.h - 1;
        const top = hub.y - 1;
        const dy = top - bottom;

        for (let i = 0; i < IN_COUNT; i += 1) {
          const a = {
            x: clusterBox.x + (clusterBox.w * (i + 1)) / (IN_COUNT + 1),
            y: bottom,
          };
          const b = { x: hub.x + (hub.w * (i + 1)) / (IN_COUNT + 1), y: top };
          draw(
            i, a,
            { x: a.x, y: a.y + dy * 0.5 },
            { x: b.x, y: b.y - dy * 0.45 },
            b, linesIn, headsIn, nodesIn, gradsIn, flowsIn
          );
        }

        const startY = hub.y + hub.h + 1;
        for (let i = 0; i < OUT_COUNT; i += 1) {
          const outcome = boxOf(outcomes[i], diagram);
          const a = {
            x: hub.x + hub.w * (0.15 + (0.7 * i) / (OUT_COUNT - 1)),
            y: startY,
          };
          const b = { x: outcome.x + outcome.w / 2, y: outcome.y - 1 };
          const run = b.y - a.y;
          draw(
            i, a,
            { x: a.x, y: a.y + run * 0.5 },
            { x: b.x, y: b.y - run * 0.45 },
            b, linesOut, headsOut, nodesOut, gradsOut, flowsOut
          );
        }
        return;
      }

      const fan = [2, 5, 8, 11, 14];
      for (let i = 0; i < IN_COUNT; i += 1) {
        const pill = boxOf(pills[fan[i]], diagram);
        const a = { x: pill.x + pill.w - 1, y: pill.y + pill.h / 2 };
        const b = { x: hub.x - 1, y: hub.y + (hub.h * (i + 1)) / (IN_COUNT + 1) };
        const dx = b.x - a.x;
        // Overlapping pills leave no horizontal run; the cubic would collapse
        // into a stray vertical line beside the hub.
        if (dx < 18) {
          hide(i, linesIn, headsIn, nodesIn, flowsIn);
          continue;
        }
        draw(
          i, a,
          { x: a.x + dx * 0.5, y: a.y },
          { x: b.x - dx * 0.45, y: b.y },
          b, linesIn, headsIn, nodesIn, gradsIn, flowsIn
        );
      }

      /* Spread the outbound anchors along the hub edge in angular order of
         their targets, so the fan reads as a flow instead of a bundle. */
      const targets = Array.from({ length: OUT_COUNT }, (_, i) => {
        const o = boxOf(outcomes[i], diagram);
        return { i, x: o.x - 1, y: o.y + o.h / 2 };
      });
      const hubCx = hub.x + hub.w / 2;
      const hubCy = hub.y + hub.h / 2;
      const rank = new Array<number>(OUT_COUNT);
      [...targets]
        .sort(
          (p, q) =>
            Math.atan2(p.y - hubCy, p.x - hubCx) -
            Math.atan2(q.y - hubCy, q.x - hubCx)
        )
        .forEach((t, r) => {
          rank[t.i] = r;
        });

      for (let i = 0; i < OUT_COUNT; i += 1) {
        const b = targets[i];
        const a = {
          x: hub.x + hub.w + 1,
          y: hub.y + hub.h * (0.2 + (0.6 * rank[i]) / (OUT_COUNT - 1)),
        };
        const dx = b.x - a.x;
        if (dx < 18) {
          hide(i, linesOut, headsOut, nodesOut, flowsOut);
          continue;
        }
        draw(
          i, a,
          { x: a.x + dx * 0.5, y: a.y },
          { x: b.x - dx * 0.45, y: b.y },
          b, linesOut, headsOut, nodesOut, gradsOut, flowsOut
        );
      }
    };

    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(diagram);
    measure();
    schedule();
    if (document.fonts?.ready) document.fonts.ready.then(schedule).catch(() => {});
    window.addEventListener("resize", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* ---- 11.5s loop ---- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReduced) return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const hub = hubRef.current;
    if (!hub) return;

    const rawZoom = getComputedStyle(diagramRef.current ?? root).getPropertyValue(
      "--hub-zoom"
    );
    const parsed = Number.parseFloat(rawZoom);
    const zoom = Number.isFinite(parsed) && parsed > 1 ? parsed : 2.6;

    let timeline: gsap.core.Timeline | null = null;
    let float: gsap.core.Tween | null = null;
    let drift: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const pills = gsap.utils.toArray<HTMLElement>(".js-svc");
      const outcomes = gsap.utils.toArray<HTMLElement>(".js-out");
      const linesIn = gsap.utils.toArray<SVGPathElement>(".js-arrow-in");
      const headsIn = gsap.utils.toArray<SVGPathElement>(".js-arrow-in-head");
      const linesOut = gsap.utils.toArray<SVGPathElement>(".js-arrow-out");
      const headsOut = gsap.utils.toArray<SVGPathElement>(".js-arrow-out-head");
      const nodes = gsap.utils.toArray<SVGCircleElement>(".services-diagram__node");
      const flows = gsap.utils.toArray<SVGPathElement>(".services-diagram__flow");
      const arrows = [...linesIn, ...headsIn, ...linesOut, ...headsOut, ...nodes, ...flows];

      timeline = gsap.timeline({
        paused: true,
        repeat: -1,
        // The heading listens for this and replays its flap on every seam.
        onRepeat: () => window.dispatchEvent(new CustomEvent("services:loop")),
      });

      timeline
        .set(hub, { scale: zoom * 1.06, transformOrigin: "50% 50%" }, 0)
        .set(pills, { opacity: 0, x: -46 }, 0)
        .set(outcomes, { opacity: 0, scale: 0.45 }, 0)
        .set(arrows, { opacity: 0 }, 0)
        .set([...linesIn, ...linesOut], { strokeDashoffset: 1 }, 0)

        /* hub eases down from the close-up */
        .to(hub, { scale: 1, duration: 1, ease: "power2.inOut" }, 0.1)

        /* pastel pills fly in from the left */
        .to(
          pills,
          {
            opacity: 1,
            x: 0,
            duration: 0.52,
            stagger: 0.035,
            ease: "back.out(1.5)",
          },
          0.24
        )

        /* portraits pop in one by one */
        .to(
          outcomes,
          {
            opacity: 1,
            scale: 1,
            duration: 0.42,
            stagger: 0.1,
            ease: "back.out(2.2)",
          },
          0.85
        )

        .to(
          linesIn,
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: "power2.inOut",
          },
          0.9
        )
        .to(headsIn, { opacity: 1, duration: 0.2, stagger: 0.03 }, 1.35)
        .to(
          linesOut,
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.6,
            stagger: 0.045,
            ease: "power2.inOut",
          },
          1.25
        )
        .to(headsOut, { opacity: 1, duration: 0.2, stagger: 0.045 }, 1.8)
        .to([...nodes, ...flows], { opacity: 1, duration: 0.4, ease: "power1.out" }, 1.65)

        /* hold */
        .to({}, { duration: 7.9 }, 2.5)

        /* both sides scatter outward */
        .to(
          pills,
          { opacity: 0, x: -38, duration: 0.6, stagger: 0.02, ease: "power2.in" },
          10.2
        )
        .to(
          outcomes,
          { opacity: 0, x: 34, scale: 0.75, duration: 0.6, stagger: 0.025, ease: "power2.in" },
          10.2
        )
        .to(arrows, { opacity: 0, duration: 0.45 }, 10.2)

        /* zoom back into the hub */
        .to(hub, { scale: zoom * 1.06, duration: 1.05, ease: "power2.inOut" }, 10.25)
        .to({}, { duration: 0.18 }, 11.32);

      timeline.pause(0);

      float = gsap.to(".js-out img", {
        y: -4,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
        ease: "sine.inOut",
        paused: true,
      });

      // One short dash per connector travels source → target every 8s.
      drift = gsap.to(flows, {
        attr: { "stroke-dashoffset": -1 },
        duration: 8,
        repeat: -1,
        ease: "none",
        paused: true,
      });
    }, root);

    let inView = false;
    const sync = () => {
      const active = inView && !document.hidden;
      if (active) {
        timeline?.play();
        float?.play();
        drift?.play();
      } else {
        timeline?.pause();
        float?.pause();
        drift?.pause();
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        }
        sync();
      },
      { threshold: [0, 0.35, 0.6, 0.9] }
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      ctx.revert();
    };
  }, [prefersReduced]);

  return (
    <div className="services-panel" ref={rootRef}>
      <div className="services-diagram" ref={diagramRef}>
        <div className="services-diagram__glow" ref={glowRef} aria-hidden="true" />

        <svg
          className="services-diagram__arrows"
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {Array.from({ length: IN_COUNT }, (_, i) => (
              <linearGradient
                key={`gin-${i}`}
                id={`gradIn${i}`}
                className="js-grad-in"
                gradientUnits="userSpaceOnUse"
                x1="0" y1="0" x2="1" y2="0"
              >
                <stop offset="0%" stopColor="rgba(168,200,20,0.10)" />
                <stop offset="62%" stopColor="rgba(168,200,20,0.38)" />
                <stop offset="100%" stopColor="rgba(168,200,20,0.9)" />
              </linearGradient>
            ))}
            {Array.from({ length: OUT_COUNT }, (_, i) => (
              <linearGradient
                key={`gout-${i}`}
                id={`gradOut${i}`}
                className="js-grad-out"
                gradientUnits="userSpaceOnUse"
                x1="0" y1="0" x2="1" y2="0"
              >
                <stop offset="0%" stopColor="rgba(168,200,20,0.10)" />
                <stop offset="62%" stopColor="rgba(168,200,20,0.38)" />
                <stop offset="100%" stopColor="rgba(168,200,20,0.9)" />
              </linearGradient>
            ))}
          </defs>

          {Array.from({ length: IN_COUNT }, (_, i) => (
            <g key={`in-${i}`}>
              <path
                className="services-diagram__arrow-line js-arrow-in"
                stroke={`url(#gradIn${i})`}
                pathLength={1}
              />
              <path className="services-diagram__flow js-flow-in" pathLength={1} />
              <path className="services-diagram__arrow-head js-arrow-in-head" pathLength={1} />
              <circle className="services-diagram__node js-node-in" r={2.2} />
            </g>
          ))}
          {Array.from({ length: OUT_COUNT }, (_, i) => (
            <g key={`out-${i}`}>
              <path
                className="services-diagram__arrow-line js-arrow-out"
                stroke={`url(#gradOut${i})`}
                pathLength={1}
              />
              <path className="services-diagram__flow js-flow-out" pathLength={1} />
              <path className="services-diagram__arrow-head js-arrow-out-head" pathLength={1} />
              <circle className="services-diagram__node js-node-out" r={2.2} />
            </g>
          ))}
        </svg>

        <ul className="services-diagram__cluster">
          {REFERENCE_SERVICES.map(({ label, color, ink, thumb, x, y, w, h }) => (
            <li
              className="services-diagram__service js-svc"
              key={label}
              style={
                {
                  "--pill-bg": color,
                  "--pill-ink": ink,
                  "--sx": `${x}`,
                  "--sy": `${y}`,
                  "--sw": `${w}`,
                  "--sh": `${h}`,
                } as React.CSSProperties
              }
              title={label}
            >
              {thumb && (
                <img src={thumb} alt="" width={190} height={120} decoding="async" />
              )}
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="services-diagram__hub-anchor">
          <div className="services-diagram__hub" ref={hubRef}>
            <img
              src="/media/logo/logo-bs-960.webp"
              alt="Branding Sharks"
              width={960}
              height={464}
              decoding="async"
            />
          </div>
        </div>

        <ul className="services-diagram__outcomes">
          {REFERENCE_OUTCOMES.map(({ label, color, ink, image, x, y, size }, i) => (
            <li
              className="services-diagram__outcome js-out"
              key={label}
              style={
                {
                  "--chip-bg": color,
                  "--chip-ink": ink,
                  "--ox": `${x}`,
                  "--oy": `${y}`,
                  "--os": `${size}`,
                  "--i": i,
                } as React.CSSProperties
              }
            >
              <img src={image} alt={label} width={280} height={280} decoding="async" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
