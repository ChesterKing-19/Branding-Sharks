"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Arrow } from "../ui/Arrow";
import { SITE_LOGO } from "../../data/content";
import "./Header.css";

export function Header() {
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <>
      <header className="nav">
        <a className="wordmark" href="#top" aria-label="Branding Sharks">
          <Image src={SITE_LOGO.src} alt={SITE_LOGO.alt} width={SITE_LOGO.width} height={SITE_LOGO.height} priority />
        </a>
        <nav className="nav-links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="pill dark-pill" href="#contact">
          Let&apos;s talk <Arrow />
        </a>
        <button
          className="hamburger"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
          aria-expanded={menu}
          aria-controls="mobile-menu"
        >
          {menu ? "×" : "☰"}
        </button>
      </header>

      <nav
        id="mobile-menu"
        className={`mobile-menu ${menu ? "open" : ""}`}
        aria-hidden={!menu}
        inert={!menu}
      >
        <a href="#work" onClick={() => setMenu(false)}>Work</a>
        <a href="#services" onClick={() => setMenu(false)}>Services</a>
        <a href="#about" onClick={() => setMenu(false)}>About</a>
        <a href="#contact" onClick={() => setMenu(false)}>Contact</a>
      </nav>
    </>
  );
}
