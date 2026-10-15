"use client";

import dynamic from "next/dynamic";
import FlexCarousel from "../effects/FlexCarousel";
import { PROJECTS } from "../../data/content";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const WorkMobileSpiral = dynamic(
  () => import("./WorkMobileSpiral").then((m) => m.WorkMobileSpiral),
  {
    ssr: false,
    // Mobile branch code arrives after mount; hold layout with a calm
    // skeleton so the section never flashes empty or jumps in height.
    loading: () => (
      <div className="work-carousel work-carousel--loading" aria-hidden="true" />
    ),
  }
);

export function Work() {
  // Mobile (<801px) gets the auto-spinning helix; desktop keeps WebGL.
  // SSR defaults to desktop to avoid hydration mismatch; the mobile
  // branch mounts client-only via dynamic(ssr:false).
  const isMobile = useMediaQuery("(max-width: 800px)");
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

      {isMobile ? (
        <WorkMobileSpiral />
      ) : (
        <div className="work-carousel">
          {/*
            Cards with a `videoSrc` play inline on focus-zoom
            (see effects/FlexCarouselReel); others zoom as before.
          */}
          <FlexCarousel items={PROJECTS} preset="liquid" captions fit="portrait" cardHeight={0.8} />
        </div>
      )}
    </section>
  );
}
