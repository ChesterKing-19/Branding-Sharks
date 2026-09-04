"use client";

import { useEffect, useRef, useState } from "react";

const GALLERY_ITEMS = [
  "nova", "vanta", "aura", "north", "forge",
  "video", "kin", "reel", "orbit", "lumen",
  "drift", "pulse", "tide", "echo", "flux", "current",
];

export function Gallery() {
  const galleryPin = useRef<HTMLElement>(null);
  const [galleryProgress, setGalleryProgress] = useState(0);

  useEffect(() => {
    const el = galleryPin.current;
    if (!el) return;

    const update = () => {
      const box = el.getBoundingClientRect();
      const distance = el.offsetHeight - window.innerHeight;
      setGalleryProgress(
        Math.min(1, Math.max(0, -box.top / Math.max(distance, 1)))
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="see-work" ref={galleryPin} aria-label="Selected Branding Sharks work">
      <div className="see-work-stage" style={{ "--gallery-progress": galleryProgress } as React.CSSProperties}>
        <p className="sr-only">Selected work</p>

        <div className="see-work-gallery">
          {GALLERY_ITEMS.map((item, i) =>
            item === "video" ? (
              <article
                className="see-project se-video-slot"
                key={item}
                style={{ "--tile": i } as React.CSSProperties}
                aria-hidden="true"
              />
            ) : (
              <article
                className={`see-project se-${item}`}
                key={item}
                style={{ "--tile": i } as React.CSSProperties}
              >
                {item === "reel" ? (
                  <div className="video-placeholder">
                    <i>▶</i>
                    <span>CAMPAIGN FILM<br />VIDEO PLACEHOLDER</span>
                    <small>Replace with video</small>
                  </div>
                ) : (
                  <>
                    <span>0{i + 1} / {item.toUpperCase()}</span>
                    <b>{item.toUpperCase()}</b>
                  </>
                )}
              </article>
            )
          )}
        </div>

        <div className="reel-focus" aria-label="Brand film">
          <video
            className="reel-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          />
        </div>

        <div className="gallery-scroll-label">SCROLL TO EXPLORE ↓</div>
      </div>
    </section>
  );
}
