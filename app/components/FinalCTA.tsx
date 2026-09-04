"use client";

import { Arrow } from "./Arrow";

export function FinalCTA() {
  return (
    <section className="final-cta" id="contact">
      <div>
        <p className="eyebrow">Your next move</p>
        <h2>READY TO<br />MAKE SOME<br /><em>NOISE?</em></h2>
        <a href="mailto:hello@brandingsharks.com" className="cta-circle">
          START A<br />PROJECT <Arrow />
        </a>
      </div>
      <span className="giant-arrow">↗</span>
    </section>
  );
}
