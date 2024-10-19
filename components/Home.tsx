"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import React from "react";
import Graph from "./Graph";
import Image from "next/image";
import Footer from "./Footer";
import { FloatingDock } from "./ui/floating-dock";

// // "use client";
// // import React from "react";
// // import { cn } from "@/lib/utils";
// // import { Boxes } from "@/components/ui/background-boxes";

// // export default function BackgroundBoxesDemo() {
// //   return (
// //     <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
// //       <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

// //       <Boxes />
// //       <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
// //         Tailwind is Awesome
// //       </h1>
// //       <p className="text-center mt-2 text-neutral-300 relative z-20">
// //         Framer motion is the best animation library ngl
// //       </p>
// //     </div>
// //   );
// // }


export const products = [
  {
    title: "Library Managment System",
    link: "lbms",
    route: "lbms",
    thumbnail: "/images/lbms/adminPanel.png",
  },
  {
    title: "Enterprise Resource Managment Systems",
    link: "https://erp-nmk.vercel.app/",
    route: "erp",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "mooZ",
    link: "https://mooz-nmk.vercel.app/",
    route: "mooz",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },

  {
    title: "Online English Guide - Personal Blog",
    link: "https://wyt-blog.vercel.app/",
    route: "wyt",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    route: "lbms",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editrix.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    route: "lbms",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
  },

  {
    title: "Algochurn",
    link: "https://algochurn.com",
    route: "lbms",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    route: "lbms",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    route: "lbms",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    route: "lbms",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
  },

  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];
export default function Home() {
  
  return (
    <>
      <HeroParallax products={products} />
      
        <Graph />
      <Footer />
    </>
  );
}

