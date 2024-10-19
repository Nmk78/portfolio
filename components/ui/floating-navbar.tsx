/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Logo from "../Logo";
import {
  IconBurger,
  IconManualGearbox,
  IconMenu,
  IconMenu2,
  IconMenu3,
} from "@tabler/icons-react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let previousScroll = 0;

  useEffect(() => {
    console.log("Nav visibility:", visible);
  }, [visible]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious() ?? 0;
      const direction = current - previous;
      console.log("🚀 ~  ~ scrollYProgress.get():", scrollYProgress.get());

      // Show nav if at the top or at the bottom
      if (scrollYProgress.get() === 0 || scrollYProgress.get() >= 1) {
        setVisible(true);
      } else if (direction < 0) {
        setVisible(true); // Scrolling up
      } else {
        setVisible(false); // Scrolling down
      }
    }
  });

  // Effect to handle initial visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      console.log("🚀 ~ handleScroll ~ currentScroll:", currentScroll);
      console.log("🚀 ~ handleScroll ~ previousScroll:", previousScroll);

      if (currentScroll === 0) {
        setVisible(true);
      } else if (currentScroll < previousScroll) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      previousScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "w-full flex justify-between py-4 fixed top-0 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 items-center",
          className
        )}
      >
        <Logo />

        <div className={cn("relative", className)}>
          {/* Burger Button */}
          {/* Burger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden flex items-center p-2 text-gray-600 dark:text-white hover:text-gray-900"
            aria-label="Toggle Menu"
          >
            <IconMenu3 className="h-4 w-4 text-neutral-500 dark:text-white" />
          </button>
          {/* Menu Items */}
          <div
            // className={`flex-col space-y-2 absolute right-0 top-full bg-white dark:bg-black border border-gray-200 shadow-lg ${
            //   isMenuOpen ? "block" : "hidden"
            // } sm:hidden`}
            className={`flex-col space-y-2 absolute right-0 top-full bg-white dark:bg-black border border-gray-200 shadow-lg transition-all duration-300 transform ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            } sm:hidden`}
          >
            {navItems.map((navItem, idx) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300"
                )}
                onClick={() => setIsMenuOpen(false)} // Close the menu on link click
              >
                <span className="block">{navItem.icon}</span>
                <span className="block text-sm">{navItem.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-4">
            {navItems.map((navItem, idx) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block text-sm">{navItem.name}</span>
              </Link>
            ))}
          </div>

        </div>

        <div className={`absolute md:static -skew-y-6 md:-skew-y-12 top-3 md:top-10 right-0  md:right-10 w-44 transition-all duration-300 ease-in-out ${isMenuOpen ? " right-28" : ""}`}>
          <button
            className="object-contain absolute top-10 md:-top-5 right-10 animate-shake hover:animate-none"
            onClick={() => {
              alert("Mosquito button clicked!");
            }}
          >
            <Image
              src="/images/mosquito.jpg"
              height="250"
              width="250"
              className="w-16 md:w-auto"
              alt="Mosquito"
              title="Bzzzt! Just a friendly mosquito reminding you to download my CV! Don't let me fly away! 🦟"
            />
            <span className="absolute text-xs md:text-lg right-7 bottom-0 md:bottom-4 md:right-28 hover:font-semibold text-red-700 rounded px-2 py-1">
              Download CV
            </span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
