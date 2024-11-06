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
import { IconFileCv, IconMenu3, IconSettings2 } from "@tabler/icons-react";
import { SignedIn, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useData } from "@/context/DataContext";

interface NavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
}

export default function FloatingNav({ navItems, className }: FloatingNavProps) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  let previousScroll = 0;

  const { cv } = useData();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious() ?? 0;
      const direction = current - previous;
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

  const management: NavItem = {
    name: "Management",
    link: "/management",
    icon: (
      <IconSettings2 className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - (scrollYProgress.getPrevious() ?? 0);
      setVisible(
        scrollYProgress.get() === 0 ||
          scrollYProgress.get() >= 1 ||
          direction < 0
      );
    }
  });

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename; // Set the desired filename here
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl); // Clean up
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const isManagementRoute = pathname?.startsWith("/management");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive =
      pathname === item.link || pathname.startsWith(`${item.link}/`);

    return (
      <Link
        href={item.link}
        className={cn(
          "flex items-center space-x-2 px-2 py-2 text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300",
          isActive && "font-semibold text-red-600 dark:text-red-500"
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        <span className="block sm:hidden">{item.icon}</span>
        <span className="block text-sm">{item.name}</span>
      </Link>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: -100 }}
        // animate={{ opacity: 1, y: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed inset-x-0 top-0 z-[5000] w-full border border-transparent bg-gray-50 py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:border-white/[0.2] dark:bg-black",
          className
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-1">
          {/* Column 1: Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Column 2: Navigation Links */}
          <div className="hidden flex-grow justify-center space-x-2 sm:flex">
            {navItems.map((item, idx) => (
              <NavLink key={`desktop-${idx}`} item={item} />
            ))}
            {isSignedIn && <NavLink item={management} />}
          </div>

          {/* Column 3: CV Download or Sign Out */}
          <div className="w-44 h-10 flex items-center justify-end">
            {isManagementRoute ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : (
              //         <Link
              //           href={!isLoading && cv?.url ? cv.url : "#"} // Provide a default value or disable if no URL
              //           className={`hidden items-center space-x-2 rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-600
              // ${
              //   !cv?.url
              //     ? "opacity-50 cursor-not-allowed"
              //     : "hover:bg-gray-50 hover:text-neutral-500"
              // }
              // dark:text-neutral-50 dark:hover:bg-gray-800 dark:hover:text-neutral-300 sm:flex`}
              //           aria-disabled={!cv?.url} // Set aria-disabled for accessibility when no URL
              //         >
              //           <IconFileCv className="h-4 w-4 text-neutral-500 dark:text-white" />
              //           <span>Download CV</span>
              //         </Link>
              <button
                onClick={() => {
                  if (cv?.url) {
                    downloadFile(cv.url.toString(), cv.name); // Trigger download with desired filename
                  }
                }}
                className={`hidden items-center space-x-2 rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-600 
    ${
      !cv?.url
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-50 hover:text-neutral-500"
    }
    dark:text-neutral-50 dark:hover:bg-gray-800 dark:hover:text-neutral-300 sm:flex`}
                aria-disabled={!cv?.url} // Set aria-disabled for accessibility when no URL
              >
                <IconFileCv className="h-4 w-4 text-neutral-500 dark:text-white" />
                <span>Download CV</span>
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-4 flex items-center p-2 text-gray-600 hover:text-gray-900 dark:text-white sm:hidden"
              aria-label="Toggle Menu"
            >
              <IconMenu3 className="h-6 w-6 text-neutral-500 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-max right-10 mt-2 flex-col space-y-2 bg-gray-50 px-4 py-2 shadow-sm dark:bg-black sm:hidden"
            >
              {navItems.map((item, idx) => (
                <motion.div
                  key={`mobile-${idx}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                  <NavLink item={item} />
                </motion.div>
              ))}
              {isSignedIn && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: navItems.length * 0.05 }}
                >
                  <NavLink item={management} />
                </motion.div>
              )}
              {isManagementRoute && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: (navItems.length + 1) * 0.05,
                  }}
                >
                  <SignOutButton>
                    <Button className="w-full justify-end text-red-700">
                      Sign Out
                    </Button>
                  </SignOutButton>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
