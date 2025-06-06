"use client";
import React from "react";
import {
  IconHome,
  IconMessage,
  IconCode,
} from "@tabler/icons-react";
import FloatingNav from "./ui/floating-navbar";

export const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Projects",
    link: "/project",
    icon: <IconCode className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: (
      <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },
];

export function Nav() {

  return (
    <nav className="relative flex container w-full z-50">
      <FloatingNav navItems={navItems} />
    </nav>
  );
}
