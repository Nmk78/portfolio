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
import { PersonalInfo, Project, Skill } from "@/lib/types";
import { useData } from "@/context/DataContext";

export const HeroParallax = () => {
  const { projects = [], skills, personalInfo } = useData();

  const splitProducts = (projects: Project[] = []) => {
    const firstRow: Project[] = [];
    const secondRow: Project[] = [];
    const thirdRow: Project[] = [];

    if (!Array.isArray(projects) || projects.length === 0) {
      return { firstRow, secondRow, thirdRow };
    }

    const rowSize =
      projects.length > 9
        ? Math.ceil(projects.length / 3)
        : Math.ceil(projects.length / 2);

    if (projects.length > 9) {
      firstRow.push(...projects.slice(0, rowSize));
      secondRow.push(...projects.slice(rowSize, rowSize * 2));
      thirdRow.push(...projects.slice(rowSize * 2));
    } else {
      firstRow.push(...projects.slice(0, rowSize));
      secondRow.push(...projects.slice(rowSize));
    }

    return { firstRow, secondRow, thirdRow };
  };

  const { firstRow, secondRow, thirdRow } = splitProducts(projects);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  // First row: Translate to the right for 30%, then to the left for 70%
  const firstRowTranslateX = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 1], [0, 500, -500]),
    springConfig
  );

  // Second row: Translate to the left for 30%, then to the right for 70%
  const secondRowTranslateX = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 1], [0, -500, 500]),
    springConfig
  );

  // Third row can have any effect you'd like, or no effect
  const thirdRowTranslateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
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
          {firstRow.map((product: Project) => (
            <ProjectCard
              project={product}
              translate={firstRowTranslateX}
              key={product.title}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product: Project) => (
            <ProjectCard
              project={product}
              translate={secondRowTranslateX}
              key={product.title}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow &&
            thirdRow?.map((product: Project) => (
              <ProjectCard
                project={product}
                translate={thirdRowTranslateX}
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
  personalInfo?: PersonalInfo; // Make optional
  skills?: Skill[]; // Make optional
}

export const Header: React.FC<HeaderProps> = ({ personalInfo, skills }) => {
  // types.ts

  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={headerRef}
      className="max-w-7xl mx-auto mt-60 md:mt-32 relative py-16 md:py-40 w-full left-0 top-0 transition-all duration-300"
    >
      <div className="flex flex-col justify-center space-y-5 mx-7 md:mx-14">
        <h1 className="text-3xl md:text-7xl font-bold text-red-800 dark:text-white">
          {personalInfo ? (
            personalInfo.name
          ) : (
            <div className="w-4/5 md:w-1/3 h-16 bg-gray-300 animate-pulse rounded-r-full"></div>
          )}
        </h1>
        <h2 className="text-xl md:text-4xl md:font-bold text-red-800 dark:text-white">
          {personalInfo ? (
            personalInfo.bio
          ) : (
            <div className="w-2/3 md:w-1/2 h-10 bg-gray-300 animate-pulse rounded-r-full"></div>
          )}
        </h2>
        <div className="max-w-2xl text-base font-semibold md:text-xl mt-8 dark:text-gray-700">
          {personalInfo ? (
            personalInfo.description
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="w-full h-5 bg-gray-300 animate-pulse rounded-r-full"></div>
              <div className="w-full h-5 bg-gray-300 animate-pulse rounded-r-full"></div>
              <div className="w-4/5 h-5 bg-gray-300 animate-pulse rounded-r-full"></div>
            </div>
          )}
        </div>
        {skills && <FloatingDock items={skills} />}
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
interface ProjectCardProps {
  project: Project; // Updated to use the Project interface
  translate: MotionValue<number>;
}
export const ProjectCard = ({ project, translate }: ProjectCardProps) => {
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
      key={project.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={`project/${project.id}`}
        className="block group-hover/product:shadow-2xl"
      >
        <div className="relative h-96 w-full">
          <Image
            src={project.images[0]} // Use the first image from the images array as thumbnail
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive image sizes
            priority // Helps with LCP
            alt={project.title}
            className="absolute inset-0"
          />
        </div>
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {project.title}
      </h2>
      <p className="absolute bottom-16 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {project.shortDesc} {/* Displaying the short description */}
      </p>
    </motion.div>
  );
};
