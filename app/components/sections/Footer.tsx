"use client";

export function Footer() {
  return (
    <footer>
      <div className="footer-word">
        BRANDING<br /><em>SHARKS.</em>
      </div>
      <div className="footer-cols">
        <div>
          <p>Explore</p>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
        </div>
        <div>
          <p>Capabilities</p>
          <a href="#services">Branding</a>
          <a href="#services">Strategy</a>
          <a href="#services">Creative</a>
          <a href="#services">Performance</a>
        </div>
        <div>
          <p>Get in touch</p>
          <a href="mailto:hello@brandingsharks.com">hello@brandingsharks.com</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="legal">
        <span>© 2026 Branding Sharks</span>
        <span>Privacy</span>
        <span>Terms</span>
      </div>
    </footer>
  );
}
