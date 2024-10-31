"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const phrases = ["Wanna know more?", "Interested?", "Let's talk."];

const page = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex: number) => (prevIndex + 1) % phrases.length
      );
    }, 3000); // Change phrase every 3 seconds

    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="mt-20 w-full h-screen flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentPhraseIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-gray-600 mb-4"
        >
          {phrases[currentPhraseIndex]}
        </motion.h2>
      </AnimatePresence>
      <a
        href="mailto:naymyokhant78@gmail.com"
        className="text-lg text-primary hover:underline"
      >
        naymyokhant78@gmail.com
      </a>
      <a
        href="tel:+959459133418"
        className="text-lg text-primary hover:underline"
      >
        09459133418
      </a>
    </div>
  );
};

export default page;
