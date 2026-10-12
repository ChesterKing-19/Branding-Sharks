"use client";

import InfiniteMenu from "./InfiniteMenu";
import SplitFlapText from "./SplitFlapText";

const IMAGES = [
  "/assets/services/service-1.webp",
  "/assets/services/service-2.webp",
  "/assets/services/service-3.webp",
  "/assets/services/service-4.webp",
];

const SERVICES: [string, string][] = [
  ["Brand Strategy", "Position your brand to win before the first campaign goes live."],
  ["Branding", "Identity systems with a sharper point of view and a longer shelf life."],
  ["Creative", "Ideas, art direction and production designed to earn attention."],
  ["Performance Marketing", "Media, measurement and creative testing that turns demand into revenue."],
  ["Social Media", "Always-on social systems that give a brand its own momentum."],
  ["Content", "Stories and assets built for culture, channels and conversion."],
  ["SEO", "Search visibility engineered for how people discover now."],
  ["Web Design & Development", "Digital flagships with clarity, pace and a reason to act."],
  ["Lead Generation", "Demand systems that turn interest into qualified conversations."],
  ["Email & CRM", "Lifecycle moments that make customers return, refer and remember."],
];

const ITEMS = SERVICES.map(([title, description], i) => ({
  image: IMAGES[i % IMAGES.length],
  link: "",
  title,
  description,
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
        <InfiniteMenu
          items={ITEMS}
          roundness={1}
          backgroundColor="#000"
          theme="dark"
          accentColor="#a8c814"
        />
      </div>
    </section>
  );
}