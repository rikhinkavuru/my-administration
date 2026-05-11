import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif, Kode_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import ThemeProvider from "@/components/ThemeProvider";
import MotionProvider from "@/components/MotionProvider";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const kodeMono = Kode_Mono({
  variable: "--font-kode-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sackett-kavuru-2028.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sackett / Kavuru 2028 — Renew the Republic",
    template: "%s — Sackett / Kavuru 2028",
  },
  description:
    "A serious agenda for a serious moment. Twelve plainly-written positions, fifteen confirmable cabinet nominees, two amendments, and an honest budget. Limited government, free markets, strong national defense, constitutional restoration.",
  applicationName: "Sackett / Kavuru 2028",
  authors: [{ name: "Sackett / Kavuru 2028" }],
  creator: "Sackett / Kavuru 2028",
  publisher: "Sackett / Kavuru 2028",
  keywords: [
    "Sackett Kavuru 2028",
    "Renew the Republic",
    "Republican 2028",
    "presidential campaign",
    "platform",
    "constitutional restoration",
    "limited government",
    "fiscal renewal",
  ],
  category: "politics",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Sackett / Kavuru 2028",
    title: "Sackett / Kavuru 2028 — Renew the Republic",
    description:
      "A serious agenda for a serious moment. Limited government, free markets, strong national defense, and constitutional restoration.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sackett / Kavuru 2028 — Renew the Republic",
    description:
      "A serious agenda for a serious moment. Twelve positions, fifteen cabinet nominees, two amendments, an honest budget.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sackett / Kavuru 2028",
  url: SITE_URL,
  logo: `${SITE_URL}/icon`,
  description:
    "A 2028 presidential campaign for the renewal of the American republic — limited government, free markets, strong national defense, constitutional restoration.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} ${kodeMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply the saved theme synchronously, before paint, so the page
            never flashes the wrong palette during hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('theme-light');}}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--fg)] focus:text-[var(--bg)] focus:font-mono focus:text-[12px]"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <MotionProvider>
            <ScrollToTop />
            <LenisProvider>
              <Nav />
              <PageTransition>
                <main id="main" className="flex-1">
                  {children}
                </main>
              </PageTransition>
              <Footer />
            </LenisProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
