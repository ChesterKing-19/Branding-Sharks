"use client";

import { Arrow } from "./Arrow";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-orb" />
      <div className="hero-copy">
        <p className="eyebrow reveal">Independent growth partners / est. 2026</p>
        <h1>
          <span>WE BUILD</span>
          <span>BRANDS THAT</span>
          <em>GET NOTICED.</em>
        </h1>
        <div className="hero-bottom">
          <p>Branding, creativity and performance marketing engineered to turn attention into growth.</p>
          <div>
            <a className="pill" href="#contact">Start a project <Arrow /></a>
            <a className="text-link" href="#work">Explore our work <Arrow /></a>
          </div>
        </div>
      </div>
      <div className="hero-art" aria-label="Abstract shark-inspired campaign artwork">
        <div className="art-card card-one">MAKE<br /><b>WAVES</b></div>
        <div className="art-ring" />
        <div className="art-fin" />
        <p>01 / Strategic<br />Creative Direction</p>
      </div>
      <a className="scroll-cue" href="#about">SCROLL TO DIVE <span>↓</span></a>
    </section>
  );
}
