import dynamic from "next/dynamic";
import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { Gallery } from "./components/sections/Gallery";
import { About } from "./components/sections/About";
import { Testimonial } from "./components/sections/Testimonial";
import { FinalCTA } from "./components/sections/FinalCTA";
import { Footer } from "./components/sections/Footer";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import ClickSpark from "./components/effects/ClickSpark";

// Below-the-fold WebGL is split into separate chunks so the hero stays eager.
// dynamic() without ssr:false keeps SSR output (content visible + indexable)
// while still code-splitting the heavy renderers out of the initial bundle.
const LiquidHeader = dynamic(
  () => import("./components/effects/LiquidHeader").then((m) => m.LiquidHeader)
);

const Services = dynamic(
  () => import("./components/sections/Services").then((m) => m.Services),
  {
    loading: () => (
      <section
        className="services section"
        id="services"
        aria-label="Services"
        aria-busy="true"
      >
        <div className="services-head">
          <h2>WHAT WE DO.</h2>
        </div>
        <div className="services-stage" aria-hidden="true" />
      </section>
    ),
  }
);

const Work = dynamic(
  () => import("./components/sections/Work").then((m) => m.Work),
  {
    loading: () => (
      <section
        className="work"
        id="work"
        aria-label="Selected work"
        aria-busy="true"
      >
        <div className="work-head">
          <p className="eyebrow">Selected work / 2023—26</p>
          <h2>
            WORK THAT
            <br />
            MOVES PEOPLE.
          </h2>
        </div>
        <div className="work-carousel" aria-hidden="true" />
      </section>
    ),
  }
);

export default function Home() {
  return (
    <ClickSpark
      sparkColor="#A8C814"
      sparkSize={16}
      sparkRadius={50}
      sparkCount={12}
      sparkWidth={2}
      duration={650}
      easing="ease-out"
      shape="streak"
      randomness={0.2}
      gravity={0}
      spread={360}
      direction={0}
      glow={0.5}
      ring={false}
      layer="front"
    >
      <LiquidHeader />
      <Header />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Services />
        <Work />
        <Testimonial />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTopButton />
    </ClickSpark>
  );
}
