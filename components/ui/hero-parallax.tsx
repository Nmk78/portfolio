"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FloatingDock } from "./floating-dock";
import { IconArrowRight } from "@tabler/icons-react";
import { fetchData } from "@/lib/fetcher";
import { useData } from "@/context/DataContext";
import { PersonalInfo, Skill } from "@/lib/types";

const items = [
  {
    title: "JavaScript",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"></path>
        <path
          fill="#323330"
          d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"
        ></path>
      </svg>
    ),
    href: "#F0DB4F",
  },
  {
    title: "React",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <g fill="#61DAFB">
          <circle cx="64" cy="64" r="11.4"></circle>
          <path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"></path>
        </g>
      </svg>
    ),
    href: "#61DAFB",
  },
  {
    title: "Next.js",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"></path>
      </svg>
    ),
    href: "#000000",
  },
  {
    title: "TypeScript",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path
          fill="#007acc"
          d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1A23 23 0 0180 109.19c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73l4.6-2.64 3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 01.14-5.16c.06-.08 10-.12 22-.1h21.81z"
        ></path>
      </svg>
    ),
    href: "#007ACC",
  },
  {
    title: "Node.js",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path
          fill="#83CD29"
          d="M112.771 30.334L68.674  4.729c-2.781-1.584-6.402-1.584-9.205 0L14.901 30.334C12.031 31.985 10 35.088 10 38.407v51.142c0 3.319 2.084 6.423 4.954 8.083l11.775 6.688c5.628 2.772 7.617 2.772 10.178 2.772 8.333 0 13.093-5.039 13.093-13.828v-50.49c0-.713-.371-1.774-1.071-1.774h-5.623C42.594 41 41 42.061 41 42.773v50.49c0 3.896-3.524 7.773-10.11 4.48L18.723 90.73c-.424-.23-.723-.693-.723-1.181V38.407c0-.482.555-.966.982-1.213l44.424-25.561c.415-.235 1.025-.235 1.439 0l43.882 25.555c.42.253.272.722.272 1.219v51.142c0 .488.183.963-.232 1.198l-44.086 25.576c-.378.227-.847.227-1.261 0l-11.307-6.749c-.341-.198-.746-.269-1.073-.086-3.146 1.783-3.726 2.02-6.677 3.043-.726.253-1.797.692.41 1.929l14.798 8.754a9.294 9.294 0 004.647 1.246c1.642 0 3.25-.426 4.667-1.246l43.885-25.582c2.87-1.672 4.23-4.764 4.23-8.083V38.407c0-3.319-1.36-6.414-4.229-8.073zM77.91 81.445c-11.726 0-14.309-3.235-15.17-9.066-.1-.628-.633-1.379-1.272-1.379h-5.731c-.709 0-1.279.86-1.279 1.566 0 7.466 4.059 16.512 23.453 16.512 14.039 0 22.088-5.455 22.088-15.109 0-9.572-6.467-12.084-20.082-13.886-13.762-1.819-15.16-2.738-15.16-5.962 0-2.658 1.184-6.203 11.374-6.203 9.105 0 12.461 1.954 13.842 8.091.118.577.645.991 1.24.991h5.754c.354 0 .692-.143.94-.396.24-.272.367-.613.335-.979-.891-10.568-7.912-15.493-22.112-15.493-12.631 0-20.166 5.334-20.166 14.275 0 9.698 7.497 12.378 19.622 13.577 14.505 1.422 15.633 3.542 15.633 6.395 0 4.955-3.978 7.066-13.309 7.066z"
        ></path>
      </svg>
    ),
    href: "#83CD29",
  },
  {
    title: "Tailwind CSS",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path
          d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64zm0 0"
          fill="#38bdf8"
        ></path>
      </svg>
    ),
    href: "#38BDF8",
  },
  {
    title: "Git",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path
          fill="#F34F29"
          d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"
        ></path>
      </svg>
    ),
    href: "#F34F29",
  },
];

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    route: string;
    thumbnail: string;
  }[];
}) => {

  const { projects, skills, personalInfo, loading, error } = useData();

  useEffect(() => {
    console.log("🚀 ~ State Updated in Management Panel: ", {
      projects,
      skills,
      personalInfo,
      loading,
      error,
    });
  }, [projects, skills, personalInfo, loading, error]);


  const splitProducts = (products: any) => {
    let firstRow = [];
    let secondRow = [];
    let thirdRow = [];

    if (products.length > 9) {
      // Slice into 3 rows if there are more than 9 products
      const rowSize = Math.ceil(products.length / 3);
      firstRow = products.slice(0, rowSize);
      secondRow = products.slice(rowSize, rowSize * 2);
      thirdRow = products.slice(rowSize * 2);
    } else {
      // Slice into 2 rows if there are 9 or fewer products
      const rowSize = Math.ceil(products.length / 2);
      firstRow = products.slice(0, rowSize);
      secondRow = products.slice(rowSize);
    }

    return { firstRow, secondRow, thirdRow };
  };

  // Usage
  const { firstRow, secondRow, thirdRow } = splitProducts(products);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 50]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-auto pb-28 py-20 mt-16 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header personalInfo={personalInfo} skills={skills} />

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product: any) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product: any) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow &&
            thirdRow?.map((product: any) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
              />
            ))}
        </motion.div>
      </motion.div>
      <Link
        className="absolute flex w-36 mb-0 md:mb-3 md:w-44 h-10 group items-center justify-start bottom-0 right-0 md:right-10 text-lg font-bold underline text-red-500"
        href="/projects"
      >
        <span> All Projects</span>

        <IconArrowRight className="h-6 w-6 transition-all duration-300 group-hover:ml-3 text-red-500 dark:text-white" />
      </Link>
    </div>
  );
};




interface HeaderProps {
  personalInfo: PersonalInfo;
  skills: Skill[];
}

export const Header:React.FC<HeaderProps> = ({personalInfo, skills}) => {
  // types.ts


  const [showImage, setShowImage] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [info, setInfo] = useState<PersonalInfo | null>(null);

  useEffect(() => {
    setInfo(personalInfo)
  }, [personalInfo])
  

  // useEffect(() => {
  //   const fetchDataIfNeeded = async () => {
  //     if (!info) {
  //       const { data } = await fetchData(
  //         "http://localhost:3000/api/info",
  //         setInfo
  //       );
  //     }
  //   };

  //   fetchDataIfNeeded();
  // }, [info]); // Re-run when info changes

  console.log("🚀 ~ Header ~ info:", info);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && imageRef) {
        const headerRect = headerRef.current.getBoundingClientRect();
        // const imageRect = imageRef.current?.getClientRects();
        const viewportHeight = window.innerHeight;

        // Show the image when the header enters the top 50% of the viewport
        if (headerRect.top <= viewportHeight * 0.5) {
          setShowImage(true);
        }

        // Hide the image when it scrolls more than 90% out of the viewport
        if (headerRect.bottom >= viewportHeight * 1) {
          setShowImage(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={headerRef}
      className="max-w-7xl mx-auto mt-60 relative py-16 md:py-40 w-full left-0 top-0 transition-all duration-300"
    >
      <div className="flex flex-col justify-center space-y-5 mx-7 md:mx-14">
        <h1 className="text-3xl md:text-7xl font-bold text-red-800 dark:text-white">
          {info ? (
            info.name
          ) : (
            <div className="w-4/5 md:w-1/3 h-16 bg-gray-300 animate-pulse rounded-r-full"></div>
          )}
        </h1>
        <h2 className="text-xl md:text-4xl md:font-bold text-red-800 dark:text-white">
          {info ? (
            info.bio
          ) : (
            <div className="w-2/3 md:w-1/2 h-10 bg-gray-300 animate-pulse rounded-r-full"></div>
          )}
        </h2>
        <div className="max-w-2xl text-base font-semibold md:text-xl mt-8 dark:text-gray-700">
          {info ? (
            info.description
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="w-full h-5 bg-gray-300 animate-pulse rounded-r-full"></div>
              <div className="w-full h-5 bg-gray-300 animate-pulse rounded-r-full"></div>
              <div className="w-4/5 h-5 bg-gray-300 animate-pulse rounded-r-full"></div>
            </div>
          )}
        </div>
        <FloatingDock items={skills} />
      </div>

      {/* Conditional Image Display with Slide-Up Animation */}
      {/* {showImage && (
        <Image
          src="/images/swam_upscaled.png"
          height="250"
          width="800"
          ref={imageRef}
          className={`w-full object-center absolute transform translate-x-1/2 -bottom-[80%] transition-all duration-700 ease-out  ${
            showImage ? "animate-slideInAndBounce" : "animate-slideOutFade"
          }`}
          alt="Mosquito"
          title="Bzzzt! Just a friendly mosquito reminding you to download my CV! Don't let me fly away! 🦟"
        />
      )} */}

      <div className="absolute inset-0 transition-all duration-300 blur pointer-events-none" />
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    route: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  const [hoverY, setHoverY] = useState(-40); // Default to desktop value

  useEffect(() => {
    // Detect screen size and adjust hoverY value for mobile
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768; // 768px as mobile breakpoint
      setHoverY(isMobile ? 10 : -40);
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: hoverY,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={`project/${product.route}`}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
