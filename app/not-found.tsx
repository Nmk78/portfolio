"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, RefreshCcw } from "lucide-react";
import { navItems } from "@/components/Nav";

export default function Custom404() {
  const [isSpinning, setIsSpinning] = useState(false);

  const spinAnimation = {
    rotate: isSpinning ? 360 : 0,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-4xl font-semibold text-gray-800 mb-8">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto">
          Oops! The page you're looking for seems to have vanished into the
          digital abyss.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {navItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center px-6 py-3 bg-red-100 text-red-700 font-semibold hover:bg-red-300 transition-colors"
          >
            <motion.div
              className="p-2"
              whileHover={{ scale: 2, rotate: 10, color: "#d33" }} // Slight rotation and scale on hover
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.icon}
            </motion.div>

            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              {item.name}
            </motion.span>
          </motion.a>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-gray-500 text-sm"
      >
        Lost? Try refreshing your perspective (and maybe your browser too).
      </motion.p>
    </div>
  );
}
