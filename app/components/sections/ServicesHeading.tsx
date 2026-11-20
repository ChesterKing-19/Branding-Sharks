"use client";

import { useEffect, useState } from "react";

import SplitFlapText from "../effects/SplitFlapText";

/**
 * Keeps the split-flap heading in step with the services diagram loop.
 * The diagram emits `services:loop` at every GSAP repeat — the instant the
 * logo is back at full zoom — and remounting the flap replays its flip-in.
 */
export function ServicesHeading() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const replay = () => setCycle((value) => value + 1);
    window.addEventListener("services:loop", replay);
    return () => window.removeEventListener("services:loop", replay);
  }, []);

  return (
    <h2 className="services-title" id="services-title">
      <SplitFlapText
        key={cycle}
        className="services-flap"
        text="WHAT WE DO."
        charset="alpha"
        padTo={11}
        tileColor="#10130a"
        textColor="#f2f5e8"
        highlightColor="#a8c814"
        highlight={{ phrase: "WHAT WE DO.", from: 8, to: 10 }}
        fontSize="clamp(2rem, 4vw, 3.5rem)"
        flipDuration={0.1}
        stagger={0.05}
        flipsPerChar={7}
        loop={false}
        startOnView
      />
    </h2>
  );
}
