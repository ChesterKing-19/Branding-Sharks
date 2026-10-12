"use client";

import { Arrow } from "../ui/Arrow";
import { CONTACT_EMAIL } from "../../data/content";

export function FinalCTA() {
  return (
    <section className="final-cta" id="contact">
      <div>
        <p className="eyebrow">Your next move</p>
        <h2>READY TO<br />MAKE SOME<br /><em>NOISE?</em></h2>
        <a href={`mailto:${CONTACT_EMAIL}`} className="cta-circle">
          START A<br />PROJECT <Arrow />
        </a>
      </div>
      <span className="giant-arrow" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path d="M7 20 20 7" />
          <path d="M12 7h8v8" />
        </svg>
      </span>
    </section>
  );
}
