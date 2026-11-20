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
  /** Compact pill label for the services diagram (falls back to `title`). */
  short?: string;
}

export interface ProjectItem {
  title: string;
  alt: string;
  /** Thumbnail/poster card image. */
  src: string;
  /** Click-to-play reel. Absent = card keeps the zoom-focus interaction. */
  videoSrc?: string;
  /** Reel poster. Defaults to `src` when omitted. */
  poster?: string;
  /**
   * CSS `object-position` for the expanded card. Posters are 9:16 while a
   * mobile card is landscape-ish, so each project nominates the band that
   * keeps its logo and signage in frame.
   */
  focal?: string;
  /** Crop anchor for the collapsed accordion strip (falls back to `focal`). */
  focalStrip?: string;
}

export const CONTACT_EMAIL = "hello@brandingsharks.com" as const;

export const SITE_LOGO = {
  src: "/media/logo/logo-bs-480.webp",
  alt: "Branding Sharks",
  width: 182,
  height: 88,
} as const;

export const BRAND_REEL = {
  src: "/media/reel/sarovar-reel.mp4",
  label: "Branding Sharks campaign showreel",
} as const;

/**
 * One entry per tile subject. Copy and image are bound here — the old parallel
 * arrays were joined by a modulo, which silently recycled images across
 * services. Add a service by adding an object and dropping a matching
 * `public/media/services/<slug>.webp` (built by `npm run media:services`).
 */
export const SERVICES: ServiceItem[] = [
  {
    title: "Brand Strategy",
    short: "Strategy",
    description: "Find the position your brand can own — then build everything from it.",
    image: "/media/services/brand-strategy.webp",
  },
  {
    title: "Branding",
    short: "Branding",
    description: "Identity systems that stay sharp long after launch day.",
    image: "/media/services/branding.webp",
  },
  {
    title: "Creative",
    short: "Creative",
    description: "Ideas and art direction built to be noticed, not scrolled past.",
    image: "/media/services/creative.webp",
  },
  {
    title: "Performance Marketing",
    short: "Performance",
    description: "Media, measurement and creative testing that turn demand into revenue.",
    image: "/media/services/performance-marketing.webp",
  },
  {
    title: "Social Media",
    short: "Social",
    description: "Always-on social that gives your brand its own momentum.",
    image: "/media/services/social-media.webp",
  },
  {
    title: "Content",
    short: "Content",
    description: "Stories and assets made for the feed, the site and the sale.",
    image: "/media/services/content.webp",
  },
  {
    title: "SEO",
    short: "SEO",
    description: "Search visibility built for how people actually discover now.",
    image: "/media/services/seo.webp",
  },
  {
    title: "Web Design & Development",
    short: "Web Design",
    description: "Digital flagships that load fast, read clear and convert.",
    image: "/media/services/web-design-development.webp",
  },
  {
    title: "Lead Generation",
    short: "Lead Gen",
    description: "Demand systems that turn interest into qualified pipeline.",
    image: "/media/services/lead-generation.webp",
  },
  {
    title: "Email & CRM",
    short: "Email & CRM",
    description: "Lifecycle moments that bring customers back and keep them.",
    image: "/media/services/email-crm.webp",
  },
];

/**
 * What the services add up to. Rendered as the lime outcome pills on the
 * right-hand side of the services diagram.
 */
export const SERVICE_OUTCOMES = [
  "Positioning",
  "Demand",
  "Conversion",
  "Retention",
  "Growth",
] as const;

/**
 * Beat-for-beast content from the reference motion graphic. Coordinates are
 * in the reference frame's 1920 x 676 space (square pixels), used by the
 * clone layout. Kept alongside the site's own service data, not replacing it.
 */
export type ReferenceService = {
  label: string;
  color: string;
  ink: string;
  thumb?: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const REFERENCE_SERVICES: ReferenceService[] = [
  { label: "Ad Creative", color: "#c9e86b", ink: "#162008", thumb: "/media/reference/thumb-ad-creative.webp", x: 33, y: 100, w: 271, h: 67 },
  { label: "Social Assets", color: "#d8eafb", ink: "#1b2c3b", x: 318, y: 100, w: 192, h: 67 },
  { label: "Video Production", color: "#2c2430", ink: "#d9aadb", x: 520, y: 100, w: 248, h: 67 },
  { label: "Photography", color: "#eae9dd", ink: "#1d1d18", thumb: "/media/reference/thumb-photography.webp", x: 32, y: 176, w: 288, h: 64 },
  { label: "Motion Graphics", color: "#efe0cf", ink: "#22201c", thumb: "/media/reference/thumb-motion-graphics.webp", x: 330, y: 178, w: 326, h: 62 },
  { label: "Presentations", color: "#0e3324", ink: "#a9d66a", x: 660, y: 178, w: 212, h: 62 },
  { label: "Web & UI Design", color: "#cbe86e", ink: "#1d240c", x: 32, y: 252, w: 236, h: 64 },
  { label: "OOH & Fake OOH", color: "#123a32", ink: "#7fc8a0", x: 270, y: 252, w: 245, h: 64 },
  { label: "Illustration", color: "#d8eafb", ink: "#24374a", x: 520, y: 252, w: 180, h: 64 },
  { label: "Email Design", color: "#123a45", ink: "#cfe6ea", thumb: "/media/reference/thumb-email-design.webp", x: 31, y: 332, w: 286, h: 64 },
  { label: "Brand Strategy", color: "#eee6da", ink: "#2b251f", x: 325, y: 332, w: 221, h: 64 },
  { label: "3D Design", color: "#143a2c", ink: "#9ad9a5", thumb: "/media/reference/thumb-3d-design.webp", x: 548, y: 332, w: 270, h: 64 },
  { label: "Copywriting", color: "#f0e4de", ink: "#4a2f2a", x: 28, y: 410, w: 188, h: 65 },
  { label: "AI Consulting", color: "#2b2429", ink: "#f0a0a8", x: 224, y: 410, w: 201, h: 65 },
  { label: "Campaign Development", color: "#c9e86b", ink: "#25300f", x: 428, y: 410, w: 324, h: 65 },
  { label: "AI Enhanced Creative", color: "#d8eafb", ink: "#22374a", thumb: "/media/reference/thumb-ai-enhanced.webp", x: 26, y: 490, w: 379, h: 65 },
  { label: "...and more", color: "#e5e8d9", ink: "#3a4030", x: 414, y: 490, w: 184, h: 65 },
];

export type ReferenceOutcome = {
  label: string;
  color: string;
  ink: string;
  image: string;
  x: number;
  y: number;
  size: number;
};

export const REFERENCE_OUTCOMES: ReferenceOutcome[] = [
  { label: "Performance", color: "#e9e6d8", ink: "#22201c", image: "/media/reference/portrait-performance.webp", x: 1380, y: 137, size: 116 },
  { label: "Product mkt.", color: "#a9e86a", ink: "#14200a", image: "/media/reference/portrait-product-mkt.webp", x: 1610, y: 132, size: 100 },
  { label: "Content", color: "#2b2429", ink: "#f0c8d0", image: "/media/reference/portrait-content.webp", x: 1798, y: 92, size: 140 },
  { label: "Comms", color: "#3a2a4a", ink: "#e6c8f0", image: "/media/reference/portrait-comms.webp", x: 1320, y: 305, size: 95 },
  { label: "Social", color: "#f0a8d0", ink: "#2a1220", image: "/media/reference/portrait-social.webp", x: 1518, y: 310, size: 140 },
  { label: "Brand & Creative", color: "#d8eafb", ink: "#1b2b3a", image: "/media/reference/portrait-brand-creative.webp", x: 1758, y: 297, size: 152 },
  { label: "Demand gen", color: "#d8eafb", ink: "#1b2b3a", image: "/media/reference/portrait-demand-gen.webp", x: 1384, y: 472, size: 110 },
  { label: "Events", color: "#c9e86b", ink: "#1d270d", image: "/media/reference/portrait-events.webp", x: 1608, y: 520, size: 110 },
  { label: "Campaigns", color: "#17402c", ink: "#d9f0d0", image: "/media/reference/portrait-campaigns.webp", x: 1806, y: 540, size: 140 },
];

export const PROJECTS: ProjectItem[] = [
  {
    title: "ALBERTA",
    alt: "ALBERTA Home Furnishing brand campaign",
    src: "/media/work/alberta-thumbnail.webp",
    videoSrc: "/media/work/alberta-reel.mp4",
    poster: "/media/work/alberta-thumbnail.webp",
    focal: "50% 9%",
  },
  {
    title: "TEMPLE GYM",
    alt: "TEMPLE GYM brand identity and site signage",
    src: "/media/work/templegym-thumbnail.webp",
    videoSrc: "/media/work/templegym-reel.mp4",
    poster: "/media/work/templegym-thumbnail.webp",
    focal: "50% 8%",
    focalStrip: "50% 100%",
  },
  {
    title: "TRIUMPH",
    alt: "TRIUMPH motorcycle showroom campaign",
    src: "/media/work/triumph-thumbnail.webp",
    videoSrc: "/media/work/triumph-reel.mp4",
    poster: "/media/work/triumph-thumbnail.webp",
    focal: "50% 45%",
    focalStrip: "50% 52%",
  },
  {
    title: "A&S",
    alt: "A&S Furniture and Mattresses brand campaign",
    src: "/media/work/as-thumbnail.webp",
    videoSrc: "/media/work/as-reel.mp4",
    poster: "/media/work/as-thumbnail.webp",
    focal: "50% 33%",
    focalStrip: "50% 15%",
  },
  {
    title: "VEDIKA",
    alt: "VEDIKA campaign showreel",
    src: "/media/work/vedika-thumbnail.webp",
    videoSrc: "/media/work/vedika-reel.mp4",
    poster: "/media/work/vedika-thumbnail.webp",
    focal: "50% 20%",
    focalStrip: "50% 7%",
  },
  {
    title: "HARIAURA",
    alt: "HARIAURA gems and jewellery brand campaign",
    src: "/media/work/hariaura-thumbnail.webp",
    videoSrc: "/media/work/hariaura-reel.mp4",
    poster: "/media/work/hariaura-thumbnail.webp",
    focal: "50% 55%",
  },
];

/** A gallery tile backed by a short, silent, looping project reel. */
export interface GalleryItem {
  title: string;
  alt: string;
  /** Compressed loop built by `npm run media:gallery`. */
  videoSrc: string;
  /** Poster frame shown before playback (and with reduced motion). */
  poster: string;
  /** CSS `object-position` for the 4:5 tile crop. */
  focal?: string;
}

/**
 * Gallery-only projects. Kept separate from PROJECTS so the gallery can grow
 * independently of the Work carousel. Tiles autoplay muted on loop and are
 * non-interactive. The grid reserves its centre cell for the brand reel, so
 * these fill the other 14 cells of the 5×3 (8 of them on phones).
 */
export const GALLERY_PROJECTS: GalleryItem[] = [
  {
    title: "A&S",
    alt: "A&S furniture brand campaign",
    videoSrc: "/media/reel/loops/AS-loop.mp4",
    poster: "/media/reel/loops/AS-poster.webp",
    focal: "50% 45%",
  },
  {
    title: "CINNAMON BLISS",
    alt: "Cinnamon Bliss food brand reel",
    videoSrc: "/media/reel/loops/cinnamonbliss-loop.mp4",
    poster: "/media/reel/loops/cinnamonbliss-poster.webp",
  },
  {
    title: "IBRS",
    alt: "IBRS school campaign",
    videoSrc: "/media/reel/loops/ibrs-loop.mp4",
    poster: "/media/reel/loops/ibrs-poster.webp",
  },
  {
    title: "NORTH WOK",
    alt: "North Wok restaurant campaign",
    videoSrc: "/media/reel/loops/northwok-loop.mp4",
    poster: "/media/reel/loops/northwok-poster.webp",
  },
  {
    title: "PODCAST",
    alt: "Podcast studio brand reel",
    videoSrc: "/media/reel/loops/podcast-loop.mp4",
    poster: "/media/reel/loops/podcast-poster.webp",
    focal: "50% 45%",
  },
  {
    title: "60 SECONDS",
    alt: "60 Seconds podcast episode reel",
    videoSrc: "/media/reel/loops/podcast2-loop.mp4",
    poster: "/media/reel/loops/podcast2-poster.webp",
    focal: "50% 35%",
  },
  {
    title: "ROSHAN",
    alt: "Roshan jewellery campaign",
    videoSrc: "/media/reel/loops/roshan-loop.mp4",
    poster: "/media/reel/loops/roshan-poster.webp",
    focal: "50% 60%",
  },
  {
    title: "SUYUKTI",
    alt: "Suyukti Elevation brand film",
    videoSrc: "/media/reel/loops/suyukti-loop.mp4",
    poster: "/media/reel/loops/suyukti-poster.webp",
  },
  {
    title: "TAP2CASH",
    alt: "Tap2Cash fintech campaign",
    videoSrc: "/media/reel/loops/tap2cash-loop.mp4",
    poster: "/media/reel/loops/tap2cash-poster.webp",
    focal: "50% 45%",
  },
  {
    title: "ALBERTA",
    alt: "Alberta Home Furnishing brand campaign",
    videoSrc: "/media/reel/loops/alberta-loop.mp4",
    poster: "/media/reel/loops/alberta-poster.webp",
    focal: "50% 55%",
  },
  {
    title: "TEMPLE GYM",
    alt: "Temple Gym brand identity and site signage",
    videoSrc: "/media/reel/loops/templegym-loop.mp4",
    poster: "/media/reel/loops/templegym-poster.webp",
    focal: "50% 55%",
  },
  {
    title: "TRIUMPH",
    alt: "Triumph motorcycle showroom campaign",
    videoSrc: "/media/reel/loops/triumph-loop.mp4",
    poster: "/media/reel/loops/triumph-poster.webp",
    focal: "50% 45%",
  },
  {
    title: "VEDIKA",
    alt: "Vedika Baar Baar campaign",
    videoSrc: "/media/reel/loops/vedika-loop.mp4",
    poster: "/media/reel/loops/vedika-poster.webp",
  },
  {
    title: "HARIAURA",
    alt: "Hariaura Gems and Jewels Airport Road campaign",
    videoSrc: "/media/reel/loops/hariaura-loop.mp4",
    poster: "/media/reel/loops/hariaura-poster.webp",
  },
];

