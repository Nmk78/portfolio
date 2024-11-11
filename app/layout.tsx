import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ClerkProvider } from "@clerk/nextjs";
import { DataProvider } from "@/context/DataContext";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ReactQueryProvider } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"

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
  openGraph: {
    title: "Nay Myo Khant",
    description: "Personal portfolio of a computerphile student.",
    url: baseUrl, // Replace with your actual URL
    siteName: "Nay Myo Khant",
    images: [
      {
        // TODO to change cover image cuz it has ugly download cv text
        url: `${baseUrl}/images/cover.webp`, // Replace with your image URL
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
    "Web Developer",
    "Computer Science Student",
    "Next.js",
    "Vercel",
    "Portfolio",
    "UCS Myeik",
    "ERP",
    "Technology Enthusiast"
  ].join(", "),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
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
