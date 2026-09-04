"use client";

import { useState } from "react";
import { Arrow } from "./Arrow";

const SERVICES = [
  ["01", "Brand Strategy", "Position your brand to win before the first campaign goes live."],
  ["02", "Branding", "Identity systems with a sharper point of view and a longer shelf life."],
  ["03", "Creative", "Ideas, art direction and production designed to earn attention."],
  ["04", "Performance Marketing", "Media, measurement and creative testing that turns demand into revenue."],
  ["05", "Social Media", "Always-on social systems that give a brand its own momentum."],
  ["06", "Content", "Stories and assets built for culture, channels and conversion."],
  ["07", "SEO", "Search visibility engineered for how people discover now."],
  ["08", "Web Design & Development", "Digital flagships with clarity, pace and a reason to act."],
  ["09", "Lead Generation", "Demand systems that turn interest into qualified conversations."],
  ["10", "Email & CRM", "Lifecycle moments that make customers return, refer and remember."],
];

export function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="services section" id="services">
      <div className="section-top">
        <p className="eyebrow">Our capability set</p>
        <h2>WHAT WE <em>DO.</em></h2>
        <p>From positioning to performance, we build the systems that make brands grow.</p>
      </div>
      <div className="service-list">
        {SERVICES.map(([num, title, copy], i) => (
          <button
            className={`service${active === i ? " active" : ""}`}
            key={num}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(active === i ? null : i)}
          >
            <span>{num}</span>
            <strong>{title}</strong>
            <div className="service-expand">
              <p>{copy}</p>
              <div className={`mini-visual visual-${i % 5}`} />
            </div>
            <Arrow />
          </button>
        ))}
      </div>
    </section>
  );
}
