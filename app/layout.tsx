import type { Metadata, Viewport } from "next";
import {
  Manrope,
  DM_Mono,
  DM_Serif_Display,
  Bodoni_Moda,
  Allura,
} from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  preload: false,
});

const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Branding Sharks — Marketing & Advertising Agency",
  description:
    "Branding Sharks is a full-service marketing and advertising agency helping ambitious brands build attention, create demand and drive measurable growth.",
  robots: { index: true, follow: true },
  icons: { icon: "/media/logo/logo-bs-480.webp" },
};

export const viewport: Viewport = {
  themeColor: "#222426",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmMono.variable} ${dmSerif.variable} ${bodoniModa.variable} ${allura.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
