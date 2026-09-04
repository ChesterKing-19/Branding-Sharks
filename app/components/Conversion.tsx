"use client";

import { Arrow } from "./Arrow";

export function Conversion() {
  return (
    <section className="conversion section">
      <div>
        <p className="eyebrow">Performance marketing</p>
        <h2>ATTENTION IS GREAT.<br /><em>CONVERSION IS BETTER.</em></h2>
        <p>We turn signals into strategy, media into momentum and creative into demand. No vanity metrics. No black boxes.</p>
        <a className="pill" href="#contact">Grow with intent <Arrow /></a>
      </div>
      <div className="dashboard">
        <div className="dash-top">
          <span>CAMPAIGN PULSE</span>
          <b>+ 184.2%</b>
        </div>
        <div className="chart">
          <i /><i /><i /><i /><i /><i />
          <svg viewBox="0 0 560 160" preserveAspectRatio="none">
            <path d="M0,142 C45,132 70,65 110,98 S160,124 192,74 S245,92 278,45 S322,80 360,62 S423,18 465,42 S520,35 560,4" />
          </svg>
        </div>
        <div className="dash-bottom">
          <span>CREATIVE TESTING</span>
          <span>PAID SOCIAL</span>
          <span>SEARCH</span>
        </div>
      </div>
    </section>
  );
}
