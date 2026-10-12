/**
 * Single source of truth for site media + section content.
 *
 * All photos/videos are stored locally under `public/media/` and shared
 * across Gallery, FlexCarousel (Work) and InfiniteMenu (Services).
 * Sections must import from here instead of hardcoding `/assets/...` paths.
 */

export interface ServiceItem {
  title: string;
  description: string;
  image: string;
}

export interface ProjectItem {
  title: string;
  alt: string;
  src: string;
}

export const CONTACT_EMAIL = "hello@brandingsharks.com" as const;

export const SITE_LOGO = {
  src: "/media/logo/logo-bs.png",
  alt: "Branding Sharks",
  width: 182,
  height: 88,
} as const;

export const BRAND_REEL = {
  src: "/media/reel/brand-reel.mp4",
  label: "Branding Sharks campaign showreel",
} as const;

export const SERVICE_IMAGES = [
  "/media/services/service-01.webp",
  "/media/services/service-02.webp",
  "/media/services/service-03.webp",
  "/media/services/service-04.webp",
] as const;

const SERVICE_COPY: [string, string][] = [
  ["Brand Strategy", "Position your brand to win before the first campaign goes live."],
  ["Branding", "Identity systems with a sharper point of view and a longer shelf life."],
  ["Creative", "Ideas, art direction and production designed to earn attention."],
  ["Performance Marketing", "Media, measurement and creative testing that turns demand into revenue."],
  ["Social Media", "Always-on social systems that give a brand its own momentum."],
  ["Content", "Stories and assets built for culture, channels and conversion."],
  ["SEO", "Search visibility engineered for how people discover now."],
  ["Web Design & Development", "Digital flagships with clarity, pace and a reason to act."],
  ["Lead Generation", "Demand systems that turn interest into qualified conversations."],
  ["Email & CRM", "Lifecycle moments that make customers return, refer and remember."],
];

export const SERVICES: ServiceItem[] = SERVICE_COPY.map(([title, description], i) => ({
  title,
  description,
  image: SERVICE_IMAGES[i % SERVICE_IMAGES.length],
}));

export const PROJECTS: ProjectItem[] = [
  {
    title: "NOVA",
    alt: "NOVA brand strategy and campaign, +184% qualified leads",
    src: "/media/work/nova.webp",
  },
  {
    title: "VANTA",
    alt: "VANTA performance marketing, 3.9x ROAS",
    src: "/media/work/vanta.webp",
  },
  {
    title: "AURA",
    alt: "AURA branding and creative, +62% brand engagement",
    src: "/media/work/aura.webp",
  },
  {
    title: "NORTH",
    alt: "NORTH social and content, 28M organic impressions",
    src: "/media/work/north.webp",
  },
  {
    title: "FORGE",
    alt: "FORGE digital and performance, +117% conversion rate",
    src: "/media/work/forge.webp",
  },
];

/** Gallery grid tiles. The "video" entry reserves the center slot for the reel overlay. */
export const GALLERY_TILES = [
  "nova",
  "vanta",
  "aura",
  "north",
  "forge",
  "video",
  "kin",
  "orbit",
  "lumen",
  "drift",
  "pulse",
  "tide",
  "echo",
  "flux",
  "current",
] as const;

export const BRAND_NAMES = [
  "NOVA",
  "VERTEX",
  "ORBIT",
  "LUMEN",
  "AURA",
  "MONUMENT",
  "NORTH",
  "KIN",
  "FORGE",
  "VANTA",
] as const;
