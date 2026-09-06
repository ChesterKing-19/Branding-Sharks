"use client";

import { useState } from "react";
import { Arrow } from "./Arrow";

const MEGA_SECTIONS: [string, string][] = [
  ["STRATEGY", "Brand Strategy|Marketing Strategy|Go-To-Market|Customer Research"],
  ["BUILD", "Branding|Creative Direction|Web Design|Web Development"],
  ["GROW", "Performance Marketing|Paid Advertising|SEO|Lead Generation"],
  ["ENGAGE", "Social Media|Influencer Marketing|Email Marketing|Content"],
  ["ANALYSE", "Analytics|Attribution|Reporting|Marketing Intelligence"],
];

export function Header() {
  const [menu, setMenu] = useState(false);

  return (
    <>
      <header className="nav">
        <a className="wordmark" href="#top">
          BRANDING<br />SHARKS<span>.</span>
        </a>
        <nav>
          <a href="#work">Work</a>
          <button onClick={() => setMenu(!menu)} aria-expanded={menu}>
            Services <small>10</small>
          </button>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="pill dark-pill" href="#contact">
          Let&apos;s talk <Arrow />
        </a>
        <button
          className="hamburger"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
        >
          {menu ? "×" : "☰"}
        </button>
      </header>

      <div className={`mega ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div className="mega-head">
          <span>Capabilities</span>
          <button onClick={() => setMenu(false)}>Close ×</button>
        </div>
        <div className="mega-grid">
          {MEGA_SECTIONS.map(([label, list]) => (
            <section key={label}>
              <p>{label}</p>
              {list.split("|").map((x) => (
                <a key={x} href="#services" onClick={() => setMenu(false)}>
                  {x}<Arrow />
                </a>
              ))}
            </section>
          ))}
          <aside>
            <div className="fin-shape" />
            <p>BUILT FOR<br />MOMENTUM</p>
            <span>Precision in every direction.</span>
          </aside>
        </div>
      </div>
    </>
  );
}
