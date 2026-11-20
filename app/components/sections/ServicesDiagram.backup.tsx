"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { SERVICE_OUTCOMES, SERVICES } from "../../data/content";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import "./Services.css";

/** Matches the portrait breakpoint in Services.css. */
const COMPACT_QUERY = "(max-width: 839px)";

type Point = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Layout box of `el` in the coordinate space of `ancestor`.
 *
 * offsetLeft/offsetTop/offsetWidth/offsetHeight describe layout, not paint,
 * so this stays correct while GSAP is scaling the hub or nudging pills.
 * getBoundingClientRect would report the transformed box and drift.
 */
function boxOf(el: HTMLElement, ancestor: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;

  // Walking offsetParent is capped so a detached node can never loop forever.
  for (let i = 0; i < 16 && node; i += 1) {
    x += node.offsetLeft;
    y += node.offsetTop;

    const parent = node.offsetParent as HTMLElement | null;
    if (!parent || parent === ancestor) break;
    node = parent;
  }

  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** Single cubic segment from `a` to `b`, leaving along a→c1 and arriving c2→b. */
function curve(a: Point, c1: Point, c2: Point, b: Point): string {
  return `M ${round(a.x)} ${round(a.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(
    c2.x
  )} ${round(c2.y)}, ${round(b.x)} ${round(b.y)}`;
}

/**
 * Filled arrowhead at `tip`, with its tail centred on `tail` — a point sampled
 * from the real line. Deriving the direction from the cubic's analytic end
 * tangent leaves the tail floating off steep lines, because the curve is still
 * climbing/falling where the head sits.
 */
function headPath(tail: Point, tip: Point, size: number): string {
  const dx = tip.x - tail.x;
  const dy = tip.y - tail.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;

  const half = size * 0.44;
  const px = -uy * half;
  const py = ux * half;

  return `M ${round(tail.x + px)} ${round(tail.y + py)} L ${round(tip.x)} ${round(
    tip.y
  )} L ${round(tail.x - px)} ${round(tail.y - py)} Z`;
}

/** Head size tracks the run length so short portrait arrows stay readable. */
function headSize(a: Point, b: Point): number {
  return Math.min(14, Math.max(9, Math.hypot(b.x - a.x, b.y - a.y) * 0.32));
}

/**
 * The panel is one continuous 13s loop: the logo starts zoomed in on itself,
 * shrinks into the hub as the card surface fades up, the service cluster and
 * outcomes build around it with arrows drawing toward and away from the hub,
 * then everything but the hub clears and the zoom returns — so the last frame
 * matches the first and the loop restarts without a snap.
 *
 * The connectors are measured from live layout on every resize, so the lines
 * always terminate on the hub edge and the pill edges in both orientations.
 */
export function ServicesDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  /* ---- measured connectors (run for everyone, motion or not) ---- */
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

    const draw = (
      index: number,
      a: Point,
      c1: Point,
      c2: Point,
      b: Point,
      lines: SVGPathElement[],
      heads: SVGPathElement[]
    ) => {
      const line = lines[index];
      const head = heads[index];
      if (!line) return;

      line.setAttribute("d", curve(a, c1, c2, b));

      if (head) {
        const size = headSize(a, b);
        // Sample the stroke itself: the tail then sits on the line even when
        // the final approach is steep and the analytic end tangent is flat.
        const tail = line.getPointAtLength(
          Math.max(0, line.getTotalLength() - size)
        );
        head.setAttribute("d", headPath(tail, b, size));
      }
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
      if (pills.length < 10 || outcomes.length < 5 || !cluster) return;

      const hub = boxOf(hubEl, diagram);
      const compact = window.matchMedia(COMPACT_QUERY).matches;

      /* The glow is centred on the panel, but in the portrait stack the hub
         sits below the panel centre — move the oval onto the logo instead. */
      if (glowRef.current) {
        const shift = compact ? hub.y + hub.h / 2 - height / 2 : 0;
        glowRef.current.style.transform =
          Math.abs(shift) < 0.5 ? "" : `translateY(${round(shift)}px)`;
      }

      if (compact) {
        /* Portrait: cluster on top, hub centred, outcomes along the bottom. */
        const clusterBox = boxOf(cluster, diagram);
        const bottom = clusterBox.y + clusterBox.h - 1;
        const top = hub.y - 1;
        const dy = top - bottom;

        for (let i = 0; i < 5; i += 1) {
          const a = {
            x: clusterBox.x + (clusterBox.w * (i + 1)) / 6,
            y: bottom,
          };
          const b = { x: hub.x + (hub.w * (i + 1)) / 6, y: top };
          draw(
            i,
            a,
            { x: a.x, y: a.y + dy * 0.5 },
            { x: b.x, y: b.y - dy * 0.45 },
            b,
            linesIn,
            headsIn
          );
        }

        const startY = hub.y + hub.h + 1;
        for (let i = 0; i < 5; i += 1) {
          const outcome = boxOf(outcomes[i], diagram);
          const a = { x: hub.x + (hub.w * (i + 1)) / 6, y: startY };
          const b = { x: outcome.x + outcome.w / 2, y: outcome.y - 1 };
          const run = b.y - a.y;
          draw(
            i,
            a,
            { x: a.x, y: a.y + run * 0.5 },
            { x: b.x, y: b.y - run * 0.45 },
            b,
            linesOut,
            headsOut
          );
        }

        return;
      }

      /* Landscape: cluster left, hub centred, outcomes fanned right. */
      const rightColumn = pills.slice(5);
      for (let i = 0; i < 5; i += 1) {
        const pill = boxOf(rightColumn[i], diagram);
        const a = { x: pill.x + pill.w - 1, y: pill.y + pill.h / 2 };
        const b = { x: hub.x - 1, y: hub.y + (hub.h * (i + 1)) / 6 };
        const dx = b.x - a.x;
        draw(
          i,
          a,
          { x: a.x + dx * 0.5, y: a.y },
          { x: b.x - dx * 0.45, y: b.y },
          b,
          linesIn,
          headsIn
        );
      }

      for (let i = 0; i < 5; i += 1) {
        const outcome = boxOf(outcomes[i], diagram);
        const a = { x: hub.x + hub.w + 1, y: hub.y + (hub.h * (i + 1)) / 6 };
        const b = { x: outcome.x - 1, y: outcome.y + outcome.h / 2 };
        const dx = b.x - a.x;
        draw(
          i,
          a,
          { x: a.x + dx * 0.5, y: a.y },
          { x: b.x - dx * 0.45, y: b.y },
          b,
          linesOut,
          headsOut
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

    // Web fonts change the pill widths after first paint.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    window.addEventListener("resize", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* ---- loop ---- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReduced) return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // First effect pass runs before the hook has read the media query.
      // Bail out synchronously so nobody sees a hidden-then-stuck diagram.
      return;
    }

    const hub = hubRef.current;
    const surface = surfaceRef.current;
    if (!hub || !surface) return;

    const rawZoom = getComputedStyle(diagramRef.current ?? root).getPropertyValue(
      "--hub-zoom"
    );
    const parsedZoom = Number.parseFloat(rawZoom);
    const zoom = Number.isFinite(parsedZoom) && parsedZoom > 1 ? parsedZoom : 2.2;
    const compact = window.matchMedia(COMPACT_QUERY).matches;

    let timeline: gsap.core.Timeline | null = null;
    let breathe: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const pills = gsap.utils.toArray<HTMLElement>(".js-svc");
      const outcomes = gsap.utils.toArray<HTMLElement>(".js-out");
      const linesIn = gsap.utils.toArray<SVGPathElement>(".js-arrow-in");
      const headsIn = gsap.utils.toArray<SVGPathElement>(".js-arrow-in-head");
      const linesOut = gsap.utils.toArray<SVGPathElement>(".js-arrow-out");
      const headsOut = gsap.utils.toArray<SVGPathElement>(".js-arrow-out-head");
      const glowCore = gsap.utils.toArray<HTMLElement>(".js-glow-core");
      const arrows = [...linesIn, ...headsIn, ...linesOut, ...headsOut];

      timeline = gsap.timeline({ paused: true, repeat: -1 });

      timeline
        /* First frame: logo zoomed on itself, everything else cleared. */
        .set(hub, { scale: zoom, transformOrigin: "50% 50%" }, 0)
        .set(surface, { opacity: 0 }, 0)
        .set(pills, { opacity: 0, y: 14 }, 0)
        .set(
          outcomes,
          compact ? { opacity: 0, y: 12 } : { opacity: 0, x: 16, scale: 0.94 },
          0
        )
        .set(arrows, { opacity: 0 }, 0)
        .set([...linesIn, ...linesOut], { strokeDashoffset: 1 }, 0)

        /* Hold the close-up, then shrink into the finished hub. */
        .fromTo(
          hub,
          { scale: zoom * 1.06 },
          { scale: zoom, duration: 0.9, ease: "power2.out" },
          0
        )
        .to(surface, { opacity: 1, duration: 1.1, ease: "power1.inOut" }, 0.95)
        .to(hub, { scale: 1, duration: 1.2, ease: "power3.inOut" }, 0.9)

        /* Services, then connectors, then outcomes. */
        .to(
          pills,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.075,
            ease: "power2.out",
          },
          2.1
        )
        .to(
          linesIn,
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.85,
            stagger: 0.05,
            ease: "power2.inOut",
          },
          2.5
        )
        .to(
          headsIn,
          { opacity: 1, duration: 0.22, stagger: 0.05, ease: "power1.out" },
          3.3
        )
        .to(
          linesOut,
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.055,
            ease: "power2.inOut",
          },
          3.2
        )
        .to(
          headsOut,
          { opacity: 1, duration: 0.22, stagger: 0.055, ease: "power1.out" },
          3.95
        )
        .to(
          outcomes,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
          },
          3.4
        )

        /* Hold with the glow breathing, then clear and re-zoom. */
        .to({}, { duration: 6.2 }, 4.4)
        .to(arrows, { opacity: 0, duration: 0.5, ease: "power1.inOut" }, 10.6)
        .to(
          [...pills, ...outcomes],
          { opacity: 0, duration: 0.8, ease: "power1.inOut" },
          10.6
        )
        /* Grow back to exactly the intro frame's start so the loop seam is invisible. */
        .to(hub, { scale: zoom * 1.06, duration: 1.1, ease: "power3.inOut" }, 11)
        .to(surface, { opacity: 0, duration: 0.5, ease: "power1.out" }, 11)
        .to({}, { duration: 0.9 }, 12.1);

      /* Render frame 0 now: without this the zoomed logo would sit on top of
         the still-visible pills until the observer first plays the timeline. */
      timeline.pause(0);

      breathe = gsap.to(glowCore, {
        opacity: 0.55,
        scale: 1.1,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });
    }, root);

    let inView = false;

    const sync = () => {
      const active = inView && !document.hidden;
      if (active) {
        timeline?.play();
        breathe?.play();
      } else {
        timeline?.pause();
        breathe?.pause();
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
        <div className="services-diagram__grid" aria-hidden="true" />
        <div className="services-diagram__glow" ref={glowRef} aria-hidden="true">
          <span className="services-diagram__glow-core js-glow-core" />
        </div>

        <svg
          className="services-diagram__arrows"
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <g key={`in-${i}`}>
              <path
                className="services-diagram__arrow-line js-arrow-in"
                pathLength={1}
              />
              <path
                className="services-diagram__arrow-head js-arrow-in-head"
                pathLength={1}
              />
            </g>
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <g key={`out-${i}`}>
              <path
                className="services-diagram__arrow-line js-arrow-out"
                pathLength={1}
              />
              <path
                className="services-diagram__arrow-head js-arrow-out-head"
                pathLength={1}
              />
            </g>
          ))}
        </svg>

        <ul className="services-diagram__cluster">
          {SERVICES.map(({ title, short, description, image }) => (
            <li
              className="services-diagram__service js-svc"
              key={title}
              title={title}
            >
              <img
                src={image}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                decoding="async"
              />
              <span aria-hidden="true">{short ?? title}</span>
              <span className="sr-only">
                {title} — {description}
              </span>
            </li>
          ))}
        </ul>

        <div className="services-diagram__hub-anchor">
          <div className="services-diagram__hub" ref={hubRef}>
            <span
              className="services-diagram__hub-surface"
              ref={surfaceRef}
              aria-hidden="true"
            />
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
          {SERVICE_OUTCOMES.map((outcome) => (
            <li className="services-diagram__outcome js-out" key={outcome}>
              {outcome}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
