"use client";

import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { LiquidHeader } from "./components/navigationBar/LiquidHeader";
import { Hero } from "./components/Hero";
import { Gallery } from "./components/Gallery";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Work } from "./components/Work";
import { Testimonial } from "./components/Testimonial";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function Home() {
  const [activeProject, setActiveProject] = useState(0);
  const handleActiveProjectChange = useCallback((i: number) => setActiveProject(i), []);

  return (
    <main>
      <LiquidHeader />
      <Header />
      <Hero />
      <Gallery />

      <About />
      <Services />
      <Work activeProject={activeProject} onActiveProjectChange={handleActiveProjectChange} />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </main>
  );
}
