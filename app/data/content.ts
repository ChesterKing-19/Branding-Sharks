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
    description: "Find the position your brand can own — then build everything from it.",
    image: "/media/services/brand-strategy.webp",
  },
  {
    title: "Branding",
    description: "Identity systems that stay sharp long after launch day.",
    image: "/media/services/branding.webp",
  },
  {
    title: "Creative",
    description: "Ideas and art direction built to be noticed, not scrolled past.",
    image: "/media/services/creative.webp",
  },
  {
    title: "Performance Marketing",
    description: "Media, measurement and creative testing that turn demand into revenue.",
    image: "/media/services/performance-marketing.webp",
  },
  {
    title: "Social Media",
    description: "Always-on social that gives your brand its own momentum.",
    image: "/media/services/social-media.webp",
  },
  {
    title: "Content",
    description: "Stories and assets made for the feed, the site and the sale.",
    image: "/media/services/content.webp",
  },
  {
    title: "SEO",
    description: "Search visibility built for how people actually discover now.",
    image: "/media/services/seo.webp",
  },
  {
    title: "Web Design & Development",
    description: "Digital flagships that load fast, read clear and convert.",
    image: "/media/services/web-design-development.webp",
  },
  {
    title: "Lead Generation",
    description: "Demand systems that turn interest into qualified pipeline.",
    image: "/media/services/lead-generation.webp",
  },
  {
    title: "Email & CRM",
    description: "Lifecycle moments that bring customers back and keep them.",
    image: "/media/services/email-crm.webp",
  },
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
