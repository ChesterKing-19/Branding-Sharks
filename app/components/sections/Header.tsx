"use client";

import { useState } from "react";
import { Arrow } from "./Arrow";

export function Header() {
  const [menu, setMenu] = useState(false);

  return (
    <>
      <header className="nav">
        <a className="wordmark" href="#top" aria-label="Branding Sharks">
          <img src="/assets/logo/logoBS.png" alt="Branding Sharks" />
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
        >
          {menu ? "×" : "☰"}
        </button>
      </header>

      <nav className={`mobile-menu ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <a href="#work" onClick={() => setMenu(false)}>Work</a>
        <a href="#services" onClick={() => setMenu(false)}>Services</a>
        <a href="#about" onClick={() => setMenu(false)}>About</a>
        <a href="#contact" onClick={() => setMenu(false)}>Contact</a>
      </nav>
    </>
  );
}
