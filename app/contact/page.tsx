"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PhoneCallIcon, MailIcon } from "lucide-react";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";

const phrases = ["Wanna know more?", "Interested?", "Let's talk."];

const baseUrl = process.env.url || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Nay Myo Khant",
  description: "Passionate computer studied student",
  openGraph: {
    title: "Nay Myo Khant",
    description: "Personal portfolio of a computerphile student.",
    url: baseUrl, // Replace with your actual URL
    siteName: "Nay Myo Khant",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: `${baseUrl}/images/cover.webp`, // Replace with your image URL
        width: 800,
        height: 600,
        alt: "Nay Myo Khant - Web Developer",
      },
    ],
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
    "PU Myeik",
    "Polytechnic University Myeik",
    "ERP",
    "Technology Enthusiast"
  ].join(", "),
  alternates: {
    canonical: `${baseUrl}`, // dynamic if needed
  },
};

export default function Component() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-red-600 mb-4"
        >
          Get in Touch
        </motion.h1>
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentPhraseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-4xl font-bold text-red-500 mb-8"
          >
            {phrases[currentPhraseIndex]}
          </motion.h2>
        </AnimatePresence>
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <motion.a
            href="mailto:naymyokhant78@gmail.com"
            className="px-6 py-3 text-base md:text-lg font-medium text-red-500 hover:text-red-600 transition-colors duration-300"
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.95 }}
          >
            <MailIcon className="w-14 h-14 mr-2" />
            </motion.a>
          <motion.a
            href="tel:+959459133418"
            className="px-6 py-3 text-base md:text-lg font-medium text-red-500 hover:text-red-600 transition-colors duration-300"
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.95 }}
          >
            <PhoneCallIcon className="w-14 h-14 mr-2" />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
