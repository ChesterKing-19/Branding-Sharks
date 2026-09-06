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
      <span className="giant-arrow" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path d="M7 17 17 7" />
          <path d="M17 7H8" />
          <path d="M17 7v9" />
        </svg>
      </span>
    </section>
  );
}
