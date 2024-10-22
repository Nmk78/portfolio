"use client";
import React from "react";
import {
  IconHome,
  IconMessage,
  IconUser,
  IconSettings2,
  IconCode,
} from "@tabler/icons-react";
import FloatingNav from "./ui/floating-navbar";
export function Nav() {
  const navItems = [
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



  return (
    <nav className="relative flex w-full z-50">
      <FloatingNav navItems={navItems} />
    </nav>
  );
}
