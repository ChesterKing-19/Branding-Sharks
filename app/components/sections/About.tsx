"use client";

import { Arrow } from "./Arrow";

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
          <div className="portrait" />
          <span>THE<br />EDGE<br />IS<br />INTENT.</span>
          <p>We combine brand intelligence, creative firepower and performance rigour to make ambitious businesses hard to overlook.</p>
        </div>
      </section>

      <section className="brands">
        <p className="eyebrow">Trusted by ambitious brands</p>
        <div className="brand-track">
          NOVA <b>VERTEX</b> ORBIT <b>LUMEN</b> AURA <b>MONUMENT</b> NORTH <b>KIN</b> FORGE <b>VANTA</b> NOVA <b>VERTEX</b> ORBIT
        </div>
      </section>

    </>
  );
}
