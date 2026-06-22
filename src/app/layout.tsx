import type { Metadata, Viewport } from "next";
import { Marcellus, Playfair_Display, Poppins, Smooch_Sans } from "next/font/google";
import "./globals.css";
import "./globals.scss";
import Preloader from "@/components/common/Preloader/Preloader";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer";
import PWASyncProvider from "@/components/pwa/PWASyncProvider";
import MobileBottomNav from "@/components/pwa/MobileBottomNav";

const marcellus = Marcellus({
  weight: "400",
  variable: "--font-marcellus",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const smoochSans = Smooch_Sans({
  variable: "--font-smooch",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Designs Of Dreams | Premium Indian Handlooms",
  description: "Designs of Dreams (DOD Shop) offers premium heritage Indian fashion and artisanal hand-woven clothing, sarees, kurtis, and designer blouses directly from local weavers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DOD Shop",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Designs of Dreams | Premium Indian Handlooms",
    description: "Shop artisanal heritage clothing direct from Indian weavers. Premium Sarees, Kurtis, and Blouses.",
    url: "https://designs-of-dreams.vercel.app",
    siteName: "Designs of Dreams",
    images: [
      {
        url: "/screenshots/screenshot-desktop.png",
        width: 1920,
        height: 1080,
        alt: "Designs of Dreams Saree Catalog",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Designs of Dreams | Premium Indian Handlooms",
    description: "Premium heritage clothing direct from Indian weavers.",
    images: ["/screenshots/screenshot-desktop.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6F8F7A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${playfair.variable} ${poppins.variable} ${smoochSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        <PWASyncProvider>
          <Preloader />
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer />
          <MobileBottomNav />
        </PWASyncProvider>
      </body>
    </html>
  );
}