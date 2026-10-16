"use client";

import { useMemo, useState } from "react";
import { PROJECTS, type ProjectItem } from "../../data/content";
// SPIRAL_DISABLED (2026-10-16): Infinity Spiral commented out in favour of
// the mobile Accordion Gallery. Restore by uncommenting the import + JSX
// block below and removing the AccordionGallery block.
// import InfiniteSpiral from "../effects/InfiniteSpiral";
import AccordionGallery from "../effects/AccordionGallery";
import { WorkReelOverlay } from "../effects/WorkReelOverlay";

/**
 * Mobile-only Work presentation: vertical accordion gallery.
 * Previously an auto-spinning infinite helix (see SPIRAL_DISABLED block).
 * Tapping the already-active card with `videoSrc` opens the fullscreen reel
 * — the same rule the spiral used (`if (project?.videoSrc) setReel`).
 */
export function WorkMobileSpiral() {
  const [reel, setReel] = useState<ProjectItem | null>(null);

  const accordionItems = useMemo(
    () =>
      PROJECTS.map((p) => ({
        image: p.src,
        label: p.title,
        alt: p.alt,
        videoSrc: p.videoSrc,
      })),
    []
  );

  const handleActiveSelect = (index: number) => {
    const project = PROJECTS[index % PROJECTS.length];
    if (project?.videoSrc) setReel(project);
  };

  return (
    <>
      {/*
        SPIRAL_DISABLED — previous mobile presentation (kept for restore):
        <div className="work-carousel work-carousel--spiral">
          <InfiniteSpiral
            items={images}
            animationMode="auto"
            speed={0.5}
            direction="up"
            cardWidth={110}
            cardHeight={180}
            cardTilt={10}
            radius={110}
            verticalSpacing={70}
            cardsPerTurn={7}
            perspective={1000}
            centerScale={1.2}
            edgeFade={0.35}
            edgeBlur={4}
            cardRadius={12}
            pauseOnHover
            imageFit="cover"
            grayscale={0}
            onSelect={handleSelect}
          />
        </div>
        Restore: uncomment the InfiniteSpiral import above, delete the
        AccordionGallery block below, and bring back the `loop`/`images` memos
        + `handleSelect` (see git history for this file).
      */}
      <div className="work-carousel work-carousel--accordion">
        <AccordionGallery
          items={accordionItems}
          orientation="vertical"
          trigger="click"
          defaultIndex={0}
          height={420}
          gap={10}
          radius={16}
          expandRatio={0.6}
          accentColor="#a8c814"
          overlayColor="#060010"
          textColor="#ffffff"
          parallax={0.5}
          tilt={0}
          duration={0.6}
          grayscale
          showLabels
          onActiveSelect={handleActiveSelect}
        />
      </div>
      {reel?.videoSrc && (
        <WorkReelOverlay
          item={{
            title: reel.title,
            alt: reel.alt,
            src: reel.src,
            videoSrc: reel.videoSrc,
            poster: reel.poster ?? reel.src,
          }}
          onClose={() => setReel(null)}
        />
      )}
    </>
  );
}
