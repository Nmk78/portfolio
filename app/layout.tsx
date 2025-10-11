import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ClerkProvider } from "@clerk/nextjs";
import { DataProvider } from "@/context/DataContext";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ReactQueryProvider } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const baseUrl = process.env.url || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Nay Myo Khant",
  description: "Passionate computer studied student",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "any" },
    ],
    apple: "/images/apple-icon.png",
  },
  manifest: "/manifest.json",
  generator: "Next.js",
  applicationName: "Nay Myo Khant",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://naymyokhant.online"),
  category: "portfolio",
  authors: [{ name: "Nay Myo Khant" }],
    creator: "Nay Myo Khant",
  publisher: "Nay Myo Khant",
  openGraph: {
    title: "Nay Myo Khant",
    description: "Personal portfolio of a computerphile student.",
    url: baseUrl,
    siteName: "Nay Myo Khant",
    images: [
      {
        url: `${baseUrl}/images/cover.webp`,
        width: 800,
        height: 600,
        alt: "Nay Myo Khant - Web Developer",
      },
    ],

    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nay Myo Khant - Computer Studied Student & Web Developer",
    description: "Personal portfolio of a computerphile student.",
    images: [
      {
        url: `${baseUrl}/images/cover.webp`, // Replace with your image URL
        alt: "Nay Myo Khant - Web Developer",
      },
    ],
  },
   keywords: [
    "Nay Myo Khant",
    "Nay Myo Thura Kyaw",
    "Nay Myo Khant portfolio",
    "Nay Myo Khant CV",
  ].join(", "),
  alternates: {
    canonical: `${baseUrl}`, // dynamic if needed
  },
  appleWebApp: {
    title: "NMK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
      <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Nay Myo Khant",
                url: "https://www.naymyokhant.online",
                sameAs: [
                  "https://github.com/Nmk78",
                  "https://www.linkedin.com/in/naymyokhant/",
                ],
                jobTitle: "Web Developer",
                description:
                  "Portfolio of Nay Myo Khant, a computer science student and web developer.",
              }),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* <DataProvider> */}
          {/* <SignedOut>
            <SignInButton />
          </SignedOut> */}
          <EdgeStoreProvider>
            <ReactQueryProvider>
              <DataProvider>
                <Nav />
                {children}
                <Toaster />
                <Analytics />
              </DataProvider>
            </ReactQueryProvider>
          </EdgeStoreProvider>
          {/* </DataProvider> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
