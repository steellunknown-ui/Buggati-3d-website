import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets:  ["latin"],
  variable: "--font-archivo",
  weight:   ["300", "400", "600", "700", "800", "900"],
  display:  "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets:  ["latin"],
  variable: "--font-ibm-plex-mono",
  weight:   ["300", "400", "500"],
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "Bugatti Bolide EB.01 — Engineered Beyond Limits",
  description: "An interactive 3D exploded-view scroll experience of the Bugatti Bolide EB.01 hypercar — 1,600 HP, 500 km/h, 40 units.",
  keywords:    ["Bugatti", "Bolide", "hypercar", "EB.01", "W16", "scroll animation", "3D"],
  authors:     [{ name: "steellunknown-ui" }],
  robots:      "index, follow",
  openGraph: {
    title:       "Bugatti Bolide EB.01",
    description: "Engineered Beyond Limits. 1,600 HP. 500 km/h.",
    type:        "website",
  },
};

export const viewport: Viewport = {
  width:            "device-width",
  initialScale:     1,
  themeColor:       "#07070A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${ibmMono.variable}`}>
      <body className={archivo.className}>{children}</body>
    </html>
  );
}

