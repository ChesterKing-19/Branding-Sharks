"use client";

import { Arrow } from "./Arrow";

const STEPS = [
  ["DISCOVER", "Get close to the business, audience and ambition."],
  ["DEFINE", "Find the sharpest strategy and the clearest position."],
  ["CREATE", "Build the identities, ideas and assets that carry it."],
  ["LAUNCH", "Put the work into the world with intent."],
  ["GROW", "Measure, optimise and build on what moves."],
];

export function Process() {
  return (
    <section className="process section">
      <div>
        <p className="eyebrow">The current</p>
        <h2>HOW WE <em>WORK.</em></h2>
        <p>Structured enough to be reliable. Open enough to find the unexpected.</p>
      </div>
      <ol>
        {STEPS.map(([t, c], i) => (
          <li key={t}>
            <span>0{i + 1}</span>
            <div>
              <h3>{t}</h3>
              <p>{c}</p>
            </div>
            <Arrow />
          </li>
        ))}
      </ol>
    </section>
  );
}
