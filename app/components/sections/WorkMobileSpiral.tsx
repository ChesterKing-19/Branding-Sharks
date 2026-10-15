"use client";

import { useMemo, useState } from "react";
import { PROJECTS, type ProjectItem } from "../../data/content";
import InfiniteSpiral from "../effects/InfiniteSpiral";
import { WorkReelOverlay } from "../effects/WorkReelOverlay";

/**
 * Mobile-only Work presentation: auto-spinning infinite helix.
 * Locked specs: auto-spin only (no drag/scroll hijack), 100x164 cards,
 * 10deg tilt. Tapping a card with `videoSrc` opens the fullscreen reel.
 */
export function WorkMobileSpiral() {
  const [reel, setReel] = useState<ProjectItem | null>(null);

  // Duplicate the 5 projects so the helix (cardsPerTurn=4) stays dense.
  const loop = useMemo(() => [...PROJECTS, ...PROJECTS], []);
  const images = useMemo(() => loop.map((p) => ({ src: p.src, alt: p.alt })), [loop]);

  const handleSelect = (index: number) => {
    const project = loop[index % loop.length];
    if (project?.videoSrc) setReel(project);
  };

  return (
    <>
      <div className="work-carousel work-carousel--spiral">
        <InfiniteSpiral
          items={images}
          animationMode="auto"
          speed={0.5}
          direction="up"
          cardWidth={100}
          cardHeight={164}
          cardTilt={10}
          radius={110}
          verticalSpacing={52}
          cardsPerTurn={4}
          perspective={900}
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
