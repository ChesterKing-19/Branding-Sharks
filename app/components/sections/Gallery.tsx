"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  BRAND_REEL,
  GALLERY_PROJECTS,
} from "../../data/content";

// Loop files are named `<slug>-loop.mp4`; the slug gives CSS a stable hook for
// the per-breakpoint ordering without touching the curated desktop order.
const slugOf = (src: string) =>
  (src.split("/").pop() ?? "").replace("-loop.mp4", "").toLowerCase();

/**
 * Project reels fill every cell of the 5×3 grid except the centre, which is
 * reserved for the brand reel. The reel expands on scroll, settles into that
 * cell, and stays there.
 */
const TILES = GALLERY_PROJECTS;

export function Gallery() {
  const galleryPin = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const reel = stage.current?.querySelector<HTMLElement>(".reel-focus");
    const video = videoRef.current;
    if (!reel || !video || !("IntersectionObserver" in window)) return;
    // Respect reduced-motion: never autoplay the showreel.
    if (reduceMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(reel);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // Tile loops: muted, non-interactive, and only playing while the gallery
  // stage is on screen. Tiles hidden by the responsive cap are never loaded.
  useEffect(() => {
    const stageEl = stage.current;
    if (!stageEl) return;

    // Only tiles the layout actually renders (the mobile grid hides 6 of
    // them) are ever loaded or decoded. `display` is available before the
    // first layout pass, unlike measured widths.
    const collect = () =>
      Array.from(
        stageEl.querySelectorAll<HTMLVideoElement>(".see-project-video")
      ).filter((video) => {
        const tile = video.closest<HTMLElement>(".see-project");
        return !tile || getComputedStyle(tile).display !== "none";
      });

    let videos = collect();

    if (reduceMotion) {
      videos.forEach((video) => video.pause());
      return;
    }

    let inView = false;
    const playAll = () => {
      if (document.hidden) return;
      // Layout may not be measured on the first frame, so re-collect here.
      videos = collect();
      videos.forEach((video) => video.play().catch(() => {}));
    };
    const pauseAll = () => {
      videos.forEach((video) => video.pause());
    };

    if (!("IntersectionObserver" in window)) {
      playAll();
      return pauseAll;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        inView = !!entries[0]?.isIntersecting;
        if (inView) playAll();
        else pauseAll();
      },
      { threshold: 0.05 }
    );

    const onVisibility = () => {
      if (document.hidden) pauseAll();
      else if (inView) playAll();
    };

    // Crossing the 800px breakpoint shows/hides tiles, so rebuild the pool.
    const onResize = () => {
      pauseAll();
      videos = collect();
      if (inView) playAll();
    };

    observer.observe(stageEl);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      pauseAll();
    };
    // Re-scan if the rendered tile set changes (breakpoint or data edits).
  }, [reduceMotion, GALLERY_PROJECTS.length]);

  useEffect(() => {
    const el = galleryPin.current;
    const node = stage.current;
    if (!el || !node) return;

    let raf = 0;
    const measureReel = () => {
      // The reel lands on the reserved centre cell, so measure that.
      const slot = node.querySelector<HTMLElement>(".gallery-reel-slot");
      if (!slot) return;
      node.style.setProperty("--reel-final-w", `${slot.offsetWidth}px`);
      node.style.setProperty("--reel-final-h", `${slot.offsetHeight}px`);
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

    measureReel();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureReel);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureReel);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="see-work" ref={galleryPin} aria-labelledby="gallery-heading">
      <div className="see-work-stage" ref={stage}>
        <h2 id="gallery-heading" className="sr-only">Selected work</h2>

        <div className="see-work-gallery">
          {TILES.map((tile, i) => (
            <article
              className="see-project se-video-tile"
              key={tile.videoSrc}
              data-slug={slugOf(tile.videoSrc)}
              aria-label={tile.title}
              style={
                {
                  "--tile": i,
                  "--tile-focal": tile.focal ?? "50% 50%",
                } as React.CSSProperties
              }
            >
              <video
                className="see-project-video"
                src={tile.videoSrc}
                poster={tile.poster}
                muted
                loop
                playsInline
                preload="none"
                tabIndex={-1}
                aria-hidden="true"
                disablePictureInPicture
              />
              <div className="see-project-scrim" aria-hidden="true" />
            </article>
          ))}

          {/* Reserved centre cell; the reel overlay lands exactly here. */}
          <div className="gallery-reel-slot" aria-hidden="true" />
        </div>

        <div className="reel-focus" role="img" aria-label="Brand film">
          {videoError ? (
            <div className="reel-video reel-video--fallback">
              <span>REEL UNAVAILABLE</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="reel-video"
              muted
              loop
              playsInline
              preload="metadata"
              src={BRAND_REEL.src}
              onError={() => setVideoError(true)}
              aria-label={BRAND_REEL.label}
            />
          )}
        </div>

        <div className="gallery-scroll-label">SCROLL TO EXPLORE ↓</div>
      </div>
    </section>
  );
}
