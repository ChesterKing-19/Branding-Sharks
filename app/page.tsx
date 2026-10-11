"use client";

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
import ScrollToTopButton from "./components/ScrollToTopButton";

export default function Home() {
  return (
    <main>
      <LiquidHeader />
      <Header />
      <Hero />
      <Gallery />

      <About />
      <Services />
      <Work />
      <Testimonial />
      <FinalCTA />
      <Footer />
      <ScrollToTopButton />
    </main>
  );
}
