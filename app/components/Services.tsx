"use client";

import InfiniteMenu from "./InfiniteMenu";

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
      <div className="section-top">
        <p className="eyebrow">Our capability set</p>
        <h2>WHAT WE <em>DO.</em></h2>
        <p>From positioning to performance, we build the systems that make brands grow.</p>
      </div>
      <div className="services-stage">
        <InfiniteMenu items={ITEMS} scale={0.8} backgroundColor="#fff" />
      </div>
    </section>
  );
}