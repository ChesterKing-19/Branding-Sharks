"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BRAND_REEL, GALLERY_TILES } from "../../data/content";

const GALLERY_ITEMS: readonly string[] = GALLERY_TILES;

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
      video.removeAttribute("autoplay");
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
    <section className="see-work" ref={galleryPin} aria-labelledby="gallery-heading">
      <div className="see-work-stage" ref={stage}>
        <h2 id="gallery-heading" className="sr-only">Selected work</h2>

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
                <>
                  <span>{String(i + 1).padStart(2, "0")} / {item.toUpperCase()}</span>
                  <b>{item.toUpperCase()}</b>
                </>
              </article>
            )
          )}
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
              autoPlay={!reduceMotion}
              muted
              loop={!reduceMotion}
              playsInline
              preload={reduceMotion ? "none" : "metadata"}
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
