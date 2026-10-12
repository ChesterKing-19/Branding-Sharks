"use client";

import { Arrow } from "../ui/Arrow";
import { BRAND_NAMES } from "../../data/content";

const marqueeLine = [...BRAND_NAMES, ...BRAND_NAMES.slice(0, 3)];

export function About() {
  return (
    <>
      <section className="intro section" id="about">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2>WE MAKE BRANDS <em>IMPOSSIBLE</em> TO IGNORE.</h2>
          <a className="text-link" href="#contact">About Branding Sharks <Arrow /></a>
        </div>
        <div className="intro-image">
          <div className="portrait" aria-hidden="true" />
          <span>THE<br />EDGE<br />IS<br />INTENT.</span>
          <p>We combine brand intelligence, creative firepower and performance rigour to make ambitious businesses hard to overlook.</p>
        </div>
      </section>

      <section className="brands" aria-label="Trusted by ambitious brands">
        <p className="eyebrow">Trusted by ambitious brands</p>
        <div className="brand-track" aria-hidden="true">
          {marqueeLine.map((name, i) =>
            i % 2 === 1 ? <b key={`${name}-${i}`}>{name} </b> : <span key={`${name}-${i}`}>{name} </span>
          )}
        </div>
      </section>

    </>
  );
}
