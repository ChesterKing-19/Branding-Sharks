"use client";

import InfiniteMenu from "../effects/InfiniteMenu";
import SplitFlapText from "../effects/SplitFlapText";
import { SERVICES } from "../../data/content";

const ITEMS = SERVICES.map(({ title, description, image }) => ({
  image,
  link: "",
  title,
  description,
}));

export function Services() {
  return (
    <section className="services section" id="services">
      <div className="services-head">
        <h2>
          <SplitFlapText
            className="services-flap"
            words={[
              "WHAT WE DO.",
            ]}
            flipDuration={0.12}
            stagger={0.06}
            cycleDelay={2400}
            charset="alphanumeric"
            flipsPerChar={8}
            tileColor="#111827"
            textColor="#f8fafc"
            tileRadius={8}
            gap={6}
            fontSize="clamp(1.5rem, 5.2vw, 5rem)"
            loop
            padTo={12}
            startOnView
            highlight={{ phrase: "WHAT WE DO.", from: 8, to: 10 }}
            highlightColor="#a8c814"
          />
        </h2>
      </div>
      {/*
        The WebGL sphere only mounts the active service's title/description in
        the DOM. This hidden list keeps the full service set crawlable and
        readable to assistive tech without changing the visual design.
      */}
      <div className="sr-only">
        <h3>Services</h3>
        <ul>
          {SERVICES.map(({ title, description }) => (
            <li key={title}>
              {title}: {description}
            </li>
          ))}
        </ul>
      </div>
      <div className="services-stage">
        <InfiniteMenu
          items={ITEMS}
          roundness={1}
          backgroundColor="#000"
          theme="dark"
          accentColor="#a8c814"
        />
      </div>
    </section>
  );
}