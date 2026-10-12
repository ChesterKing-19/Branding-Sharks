import dynamic from "next/dynamic";
import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { Gallery } from "./components/sections/Gallery";
import { About } from "./components/sections/About";
import { Testimonial } from "./components/sections/Testimonial";
import { FinalCTA } from "./components/sections/FinalCTA";
import { Footer } from "./components/sections/Footer";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import { CustomCursor } from "./components/effects/CustomCursor";

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
      <section className="services section" id="services" aria-label="Services">
        <div className="services-head">
          <h2>WHAT WE DO.</h2>
        </div>
        <ul>
          <li>Brand Strategy</li>
          <li>Branding</li>
          <li>Creative</li>
          <li>Performance Marketing</li>
          <li>Social Media</li>
          <li>Content</li>
          <li>SEO</li>
          <li>Web Design &amp; Development</li>
          <li>Lead Generation</li>
          <li>Email &amp; CRM</li>
        </ul>
      </section>
    ),
  }
);

const Work = dynamic(
  () => import("./components/sections/Work").then((m) => m.Work),
  {
    loading: () => (
      <section className="work section" id="work" aria-label="Selected work">
        <div className="work-head">
          <p className="eyebrow">Selected work / 2023—26</p>
          <h2>
            WORK THAT
            <br />
            MOVES PEOPLE.
          </h2>
        </div>
        <ul>
          <li>VEDIKA — campaign showreel</li>
          <li>VANTA — performance marketing</li>
          <li>HARIAURA — branding and creative</li>
          <li>NORTH — social and content</li>
          <li>FORGE — digital and performance</li>
        </ul>
      </section>
    ),
  }
);

export default function Home() {
  return (
    <>
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
      <CustomCursor />
    </>
  );
}
