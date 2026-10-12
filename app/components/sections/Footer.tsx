"use client";

import { CONTACT_EMAIL } from "../../data/content";
import "./Footer.css";

const EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export function Footer() {
  return (
    <footer>
      <div className="footer-word">
        BRANDING<br /><em>SHARKS.</em>
      </div>
      <div className="footer-cols">
        <div>
          <h2>Explore</h2>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
        </div>
        <div>
          <h2>Capabilities</h2>
          <a href="#services">Branding</a>
          <a href="#services">Strategy</a>
          <a href="#services">Creative</a>
          <a href="#services">Performance</a>
        </div>
        <div>
          <h2>Get in touch</h2>
          <a href={EMAIL_HREF}>{CONTACT_EMAIL}</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="legal">
        <span>© 2026 Branding Sharks</span>
        <a href="#top">Privacy</a>
        <a href="#top">Terms</a>
      </div>
    </footer>
  );
}
