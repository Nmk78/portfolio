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

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
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
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};


export const Header = () => {
  const [showImage, setShowImage] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
      className="max-w-7xl mx-auto mt-72 relative py-20 md:py-40 w-full left-0 top-0 transition-all duration-300"
    >
      <div className="space-y-4 mx-14">
        <div className="relative space-y-4 z-10">
          <h1 className="text-2xl md:text-7xl font-bold text-red-800 dark:text-white">
            Nay Myo Khant
          </h1>
          <h1 className="text-xl md:text-4xl font-bold text-red-800 dark:text-white">
            A Computerphile
          </h1>
        </div>
        <p className="max-w-2xl text-base font-semibold md:text-xl mt-8 dark:text-gray-700">
          Computer Studied student passionate about software engineering and
          academic research, eager to innovate and explore new technologies.
        </p>
      </div>

      {/* Conditional Image Display with Slide-Up Animation */}
      {showImage && (
        <Image
          src="/images/swam_upscaled.png"
          height="250"
          width="800"
          ref={imageRef}
          className={`w-full object-center absolute transform translate-x-1/2 -bottom-[80%] transition-all duration-700 ease-out  ${showImage ? "animate-slideInAndBounce" : "animate-slideOutFade"}`}
          alt="Mosquito"
          title="Bzzzt! Just a friendly mosquito reminding you to download my CV! Don't let me fly away! 🦟"
        />
      )}

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
        href={product.link}
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
