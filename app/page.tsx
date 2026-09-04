"use client";

import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Gallery } from "./components/Gallery";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Work } from "./components/Work";
import { Conversion } from "./components/Conversion";
import { BrandShowcase } from "./components/BrandShowcase";
import { Process } from "./components/Process";
import { Testimonial } from "./components/Testimonial";
import { Insights } from "./components/Insights";
import { Newsletter } from "./components/Newsletter";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function Home() {
  const [activeProject, setActiveProject] = useState(0);
  const handleActiveProjectChange = useCallback((i: number) => setActiveProject(i), []);

  return (
    <main>
      <Header />
      <Hero />
      <Gallery />

      <div className="ticker">
        <div>
          STRATEGY <i /> BRANDING <i /> CREATIVE <i /> PERFORMANCE <i />
          SOCIAL <i /> CONTENT <i /> DIGITAL <i /> GROWTH <i />
        </div>
      </div>

      <About />
      <Services />
      <Work activeProject={activeProject} onActiveProjectChange={handleActiveProjectChange} />
      <Conversion />
      <BrandShowcase />
      <Process />
      <Testimonial />
      <Insights />
      <Newsletter />
      <FinalCTA />
      <Footer />
    </main>
  );
}
