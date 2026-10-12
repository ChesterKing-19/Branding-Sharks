"use client";

import FlexCarousel from "../effects/FlexCarousel";
import { PROJECTS } from "../../data/content";

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
        {/*
          Cards with a `videoSrc` play inline on focus-zoom
          (see effects/FlexCarouselReel); others zoom as before.
        */}
        <FlexCarousel items={PROJECTS} preset="liquid" captions fit="portrait" cardHeight={0.8} />
      </div>
    </section>
  );
}
