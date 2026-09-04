"use client";

import { Arrow } from "./Arrow";

const ARTICLES = [
  ["Branding", "Why most brands look the same"],
  ["Creative", "Creative that converts"],
  ["Performance", "The future of performance marketing"],
];

export function Insights() {
  return (
    <section className="insights section" id="insights">
      <p className="eyebrow">The signal</p>
      <h2>THOUGHTS, TRENDS<br />&amp; <em>TACTICS.</em></h2>
      <div className="article-grid">
        {ARTICLES.map(([tag, title], i) => (
          <a href="#insights" className={`article a-${i}`} key={title}>
            <div>
              <span>{tag}</span>
              <Arrow />
            </div>
            <h3>{title}</h3>
            <p>07.03.26 · 6 min read</p>
          </a>
        ))}
      </div>
    </section>
  );
}
