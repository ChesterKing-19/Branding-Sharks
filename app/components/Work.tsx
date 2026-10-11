"use client";

import FlexCarousel from "./FlexCarousel";
import type { FlexCarouselItem } from "./FlexCarousel";

const PROJECTS: FlexCarouselItem[] = [
  {
    title: "NOVA",
    alt: "NOVA brand strategy and campaign, +184% qualified leads",
    src: "/assets/services/service-1.webp",
  },
  {
    title: "VANTA",
    alt: "VANTA performance marketing, 3.9x ROAS",
    src: "/assets/services/service-2.webp",
  },
  {
    title: "AURA",
    alt: "AURA branding and creative, +62% brand engagement",
    src: "/assets/services/service-3.webp",
  },
  {
    title: "NORTH",
    alt: "NORTH social and content, 28M organic impressions",
    src: "/assets/services/service-4.webp",
  },
  {
    title: "FORGE",
    alt: "FORGE digital and performance, +117% conversion rate",
    src: "/assets/services/service-1.webp",
  },
];

export function Work() {
  return (
    <section className="work section" id="work">
      <div className="work-head">
        <p className="eyebrow">Selected work / 2023—26</p>
        <h2>
          WORK THAT
          <br />
          MOVES <em>PEOPLE.</em>
        </h2>
        <p>Slide through the currents. Each story was built to make an impact.</p>
      </div>

      <div className="work-carousel">
        <FlexCarousel items={PROJECTS} preset="liquid" captions fit="portrait" cardHeight={0.8} />
      </div>
    </section>
  );
}