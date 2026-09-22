"use client";

import InfiniteMenu from "./InfiniteMenu";
import SplitFlapText from "./SplitFlapText";

const IMAGES = [
  "https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=600&fit=crop&sat=-100&auto=format",
  "https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=600&h=600&fit=crop&sat=-100&auto=format",
  "https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=600&h=600&fit=crop&sat=-100&auto=format",
  "https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=600&h=600&fit=crop&sat=-100&auto=format",
];

const SERVICES: [string, string, string][] = [
  ["Brand Strategy", "Position your brand to win before the first campaign goes live.", "Position the brand to win before launch."],
  ["Branding", "Identity systems with a sharper point of view and a longer shelf life.", "Identity systems with a sharper point of view."],
  ["Creative", "Ideas, art direction and production designed to earn attention.", "Ideas that earn and hold attention."],
  ["Performance Marketing", "Media, measurement and creative testing that turns demand into revenue.", "Media that turns demand into revenue."],
  ["Social Media", "Always-on social systems that give a brand its own momentum.", "Always-on social systems for brand momentum."],
  ["Content", "Stories and assets built for culture, channels and conversion.", "Stories built for culture and conversion."],
  ["SEO", "Search visibility engineered for how people discover now.", "Search visibility engineered for discovery."],
  ["Web Design & Development", "Digital flagships with clarity, pace and a reason to act.", "Digital flagships with clarity and pace."],
  ["Lead Generation", "Demand systems that turn interest into qualified conversations.", "Demand that becomes qualified conversations."],
  ["Email & CRM", "Lifecycle moments that make customers return, refer and remember.", "Lifecycle moments that keep customers returning."],
];

const ITEMS = SERVICES.map(([title, description, shortDescription], i) => ({
  image: IMAGES[i % IMAGES.length],
  link: "",
  title,
  description,
  shortDescription,
}));

export function Services() {
  return (
    <section className="services section" id="services">
      <div className="services-head">
        <h2>
          <SplitFlapText
            className="services-flap"
            words={[
              "WHAT WE DO.",
            ]}
            flipDuration={0.12}
            stagger={0.06}
            cycleDelay={2400}
            charset="alphanumeric"
            flipsPerChar={8}
            tileColor="#111827"
            textColor="#f8fafc"
            tileRadius={8}
            gap={6}
            fontSize="clamp(1.5rem, 5.2vw, 5rem)"
            loop
            padTo={12}
            startOnView
            highlight={{ phrase: "WHAT WE DO.", from: 8, to: 10 }}
            highlightColor="#a8c814"
          />
        </h2>
      </div>
      <div className="services-stage">
        <InfiniteMenu items={ITEMS} scale={0.8} backgroundColor="#fff" />
      </div>
    </section>
  );
}