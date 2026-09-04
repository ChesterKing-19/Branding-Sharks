"use client";

import { useEffect, useRef } from "react";

const GALLERY_ITEMS = [
  "nova", "vanta", "aura", "north", "forge",
  "video", "kin", "orbit", "lumen",
  "drift", "pulse", "tide", "echo", "flux", "current",
];

export function Gallery() {
  const galleryPin = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = galleryPin.current;
    const node = stage.current;
    if (!el || !node) return;

    let raf = 0;
    const measureSlot = () => {
      const slot = node.querySelector<HTMLElement>(".se-video-slot");
      const w = slot ? slot.offsetWidth : 0;
      const h = slot ? slot.offsetHeight : 0;
      node.style.setProperty("--reel-final-w", w ? `${w}px` : "13.6vw");
      node.style.setProperty("--reel-final-h", h ? `${h}px` : "31vw");
    };
    const update = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const distance = el.offsetHeight - window.innerHeight;
      const base = Math.min(1, Math.max(0, -box.top / Math.max(distance, 1)));
      const p = 1 - Math.pow(1 - base, 1.8);
      node.style.setProperty("--gallery-progress", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measureSlot();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureSlot);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureSlot);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="see-work" ref={galleryPin} aria-label="Selected Branding Sharks work">
      <div className="see-work-stage" ref={stage}>
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
            src="/reel-test.mp4"
          />
        </div>

        <div className="gallery-scroll-label">SCROLL TO EXPLORE ↓</div>
      </div>
    </section>
  );
}
