"use client";

import { useMemo, useState } from "react";
import { PROJECTS, type ProjectItem } from "../../data/content";
import AccordionGallery from "../effects/AccordionGallery";
import { WorkReelOverlay } from "../effects/WorkReelOverlay";

/**
 * Mobile-only Work presentation: vertical accordion gallery.
 * Tapping the already-active card with `videoSrc` opens the fullscreen reel.
 */
export function WorkMobileAccordion() {
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
