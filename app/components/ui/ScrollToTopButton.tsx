"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import SlingButton from "./SlingButton/SlingButton";

export interface ScrollToTopButtonProps {
  size?: number;
  padColor?: string;
  iconColor?: string;
  accentColor?: string;
  wellColor?: string;
  bandColor?: string;
  strokeWidth?: number;
  armAt?: number;
  maxPull?: number;
  launchSpeed?: number;
  recoil?: number;
  flight?: number;
  particles?: number;
  spread?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollToTopButton({
  size = 56,
  padColor = "var(--lime)",
  iconColor = "var(--ink)",
  accentColor = "var(--lime)",
  wellColor = "var(--ink)",
  bandColor = "var(--green-deep)",
  strokeWidth = 3,
  armAt = 48,
  maxPull = 160,
  launchSpeed = 2600,
  recoil = 0.2,
  flight = 120,
  particles = 14,
  spread = 60,
  threshold = 80,
  className = "",
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      setVisible(scrollY > threshold);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div
      className={`scroll-to-top${visible ? " visible" : ""}${className ? " " + className : ""}`}
      aria-hidden={!visible}
    >
      <SlingButton
        onSend={scrollToTop}
        padColor={padColor}
        iconColor={iconColor}
        accentColor={accentColor}
        wellColor={wellColor}
        bandColor={bandColor}
        size={size}
        strokeWidth={strokeWidth}
        armAt={armAt}
        maxPull={maxPull}
        launchSpeed={launchSpeed}
        recoil={recoil}
        flight={flight}
        particles={particles}
        spread={spread}
        axis="any"
        tapSends
        ariaLabel="Scroll to top"
        srHint="Press Enter to scroll to top, or drag away and release."
      />
    </div>
  );
}
