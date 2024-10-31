import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ClerkProvider, SignedOut, SignInButton } from "@clerk/nextjs";
import { DataProvider } from "@/context/DataContext";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ReactQueryProvider } from "./providers";

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

export const metadata: Metadata = {
  title: "Nay Myo Khant",
  description: "Passionate computer studied student",
  openGraph: {
    title: "Nay Myo Khant",
    description: "Personal portfolio of a computerphile student.",
    url: "http://localhost:3000/", // Replace with your actual URL
    siteName: "Nay Myo Khant",
    images: [
      {
        //TODO to change url
        // TODO to change cover image cuz it has ugly download cv text
        url: "http://localhost:3000/images/cover.jpg", // Replace with your image URL
        width: 800,
        height: 600,
        alt: "Nay Myo Khant - Web Developer",
      },
    ],
    locale: "en_US",
    type: "website",
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
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <DataProvider>
            <Nav />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <EdgeStoreProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>

            </EdgeStoreProvider>
          </DataProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
