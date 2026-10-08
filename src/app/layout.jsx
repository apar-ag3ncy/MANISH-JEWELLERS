import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { brand } from "@/data/content";
import { SITE_URL } from "@/lib/constants";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PreloaderGate } from "@/components/layout/PreloaderGate";
import { ScrollLine } from "@/components/layout/ScrollLine";
import { Navbar } from "@/components/layout/Navbar";
import { HouseFinaleGate } from "@/components/layout/HouseFinaleGate";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${brand.name} — ${brand.motto}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <PreloaderGate />
          <ScrollLine />
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <HouseFinaleGate />
        </SmoothScroll>
      </body>
    </html>
  );
}
