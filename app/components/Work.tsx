"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Arrow } from "./Arrow";

const PROJECTS = [
  { name: "NOVA", type: "Brand strategy + campaign", result: "+184% qualified leads", shade: "nova" },
  { name: "VANTA", type: "Performance marketing", result: "3.9× ROAS", shade: "vanta" },
  { name: "AURA", type: "Branding + creative", result: "+62% brand engagement", shade: "aura" },
  { name: "NORTH", type: "Social + content", result: "28M organic impressions", shade: "north" },
  { name: "FORGE", type: "Digital + performance", result: "+117% conversion rate", shade: "forge" },
];

interface WorkProps {
  activeProject: number;
  onActiveProjectChange: (i: number) => void;
}

export function Work({ activeProject, onActiveProjectChange }: WorkProps) {
  const [workProgress, setWorkProgress] = useState(0);
  const workPin = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  const handleDesktopScroll = useCallback(() => {
    const el = workPin.current;
    if (!el || window.innerWidth <= 800) return;
    const box = el.getBoundingClientRect();
    const distance = el.offsetHeight - window.innerHeight;
    const next = Math.min(1, Math.max(0, -box.top / Math.max(distance, 1)));
    setWorkProgress(next);
    onActiveProjectChange(
      Math.min(PROJECTS.length - 1, Math.round(next * (PROJECTS.length - 1)))
    );
  }, [onActiveProjectChange]);

  const handleRailScroll = useCallback(() => {
    const el = rail.current;
    if (!el || window.innerWidth > 800) return;
    const w = el.clientWidth;
    onActiveProjectChange(
      Math.min(
        PROJECTS.length - 1,
        Math.max(0, Math.round(el.scrollLeft / (w * 0.76)))
      )
    );
  }, [onActiveProjectChange]);

  useEffect(() => {
    handleDesktopScroll();
    window.addEventListener("scroll", handleDesktopScroll, { passive: true });
    window.addEventListener("resize", handleDesktopScroll);
    return () => {
      window.removeEventListener("scroll", handleDesktopScroll);
      window.removeEventListener("resize", handleDesktopScroll);
    };
  }, [handleDesktopScroll]);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", handleRailScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleRailScroll);
  }, [handleRailScroll]);

  return (
    <section className="work" id="work" ref={workPin}>
      <div className="work-stage">
        <div className="work-head section">
          <p className="eyebrow">Selected work / 2023—26</p>
          <h2>WORK THAT<br />MOVES <em>PEOPLE.</em></h2>
          <p>Scroll through the currents. Each story was built to make an impact.</p>
        </div>

        <div
          className="work-rail"
          ref={rail}
          style={{ "--rail-progress": workProgress } as React.CSSProperties}
        >
          {PROJECTS.map((p, i) => (
            <a className={`project ${p.shade}`} href="#case-study" key={p.name}>
              <div className="project-art">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div className="project-mark">{p.name}</div>
                <i />
              </div>
              <div className="project-meta">
                <p>{p.type}</p>
                <h3>{p.name}</h3>
                <strong>{p.result}</strong>
                <Arrow />
              </div>
            </a>
          ))}
        </div>

        <div className="rail-progress">
          <span>{String(activeProject + 1).padStart(2, "0")}</span>
          <i>
            <b style={{ width: `${(activeProject + 1) / PROJECTS.length * 100}%` }} />
          </i>
          <span>0{PROJECTS.length}</span>
        </div>
      </div>
    </section>
  );
}
