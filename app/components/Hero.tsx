"use client";

import { useEffect, useRef, useState } from "react";
import DecryptedText from "./DecryptedText";
import Ferrofluid from "./Ferrofluid";

const headlineLines = [
  { text: "WE BUILD", className: "hero-line hero-line-one" },
  { text: "BRANDS THAT", className: "hero-line hero-line-two" },
  { text: "GET NOTICED.", className: "hero-line hero-line-three" },
];

const HERO_COLORS = ["#618A15", "#618A15", "#9DC83A"];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [heroInView, setHeroInView] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => setHeroInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduceMotion) return;

    let visible = true;
    let frame = 0;
    let lastDepth = -1;

    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!visible) return;
        const progress = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));
        if (Math.abs(progress - lastDepth) > 0.001) {
          lastDepth = progress;
          hero.style.setProperty("--scroll-depth", progress.toFixed(3));
        }
      });
    };

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? false;
          if (visible) updateScroll();
        },
        { threshold: 0.05 }
      );
      observer.observe(hero);
    }

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", updateScroll);
    };
  }, [reduceMotion]);

  return (
    <section id="top" ref={heroRef} className="ocean-hero" aria-labelledby="hero-title">
      <Ferrofluid
        className="hero-ferrofluid"
        colors={HERO_COLORS}
        speed={0.2}
        scale={1.4}
        turbulence={0.6}
        fluidity={0.12}
        rimWidth={0.22}
        sharpness={2.5}
        shimmer={1.0}
        glow={3.0}
        flowDirection="down"
        opacity={1}
        mouseInteraction
        mouseStrength={0.5}
        mouseRadius={0.2}
        paused={!heroInView}
      />

      <div className="hero-content">
        <p className="hero-eyebrow">
          <span /> BRANDING FOR THE BOLD
        </p>
        <h1 id="hero-title" className="hero-title">
          {headlineLines.map((line, index) => (
            <span key={line.text} className={line.className}>
              {reduceMotion ? (
                line.text
              ) : (
                <DecryptedText
                  text={line.text}
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={90}
                  delay={index * 400}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
                  encryptedClassName="hero-line__enc"
                />
              )}
            </span>
          ))}
        </h1>
        <div className="hero-bottom">
          <p className="hero-description">
            We turn attention into growth
            <br />
            with brands built to move people.
          </p>
          <div className="hero-actions">
            <a className="hero-button hero-button--primary" href="#contact">
              START A PROJECT <span aria-hidden="true">↗</span>
            </a>
            <a className="hero-button hero-button--quiet" href="#work">
              EXPLORE OUR WORK <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span /> SCROLL TO DISCOVER
      </div>
      <div className="hero-coordinate" aria-hidden="true">36° 50′ N / 76° 17′ W</div>
    </section>
  );
}