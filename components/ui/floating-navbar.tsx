// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable prefer-const */
// "use client";
// import React, { useState } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useMotionValueEvent,
// } from "framer-motion";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import Image from "next/image";
// import Logo from "../Logo";

// export const FloatingNav = ({
//   navItems,
//   className,
// }: {
//   navItems: {
//     name: string;
//     link: string;
//     icon?: JSX.Element;
//   }[];


//   className?: string;
// }) => {
//   const { scrollYProgress } = useScroll();

//   const [visible, setVisible] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useMotionValueEvent(scrollYProgress, "change", (current) => {
//     if (typeof current === "number") {
//       // Use optional chaining and provide a default value for getPrevious()
//       const previous = scrollYProgress.getPrevious() ?? 0; // Fallback to 0 if undefined
//       let direction = current - previous; // Now 'previous' is guaranteed to be a number

//       if (scrollYProgress.get() === 0) {
//         setVisible(true);
//       } else if (scrollYProgress.get() < 0.05) {
//         setVisible(false);
//       } else {
//         if (direction < 0) {
//           setVisible(true);
//         } else {
//           setVisible(false);
//         }
//       }
//     }
//   });

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         initial={{
//           opacity: 1,
//           y: -100,
//         }}
//         animate={{
//           y: visible ? 0 : -100,
//           opacity: visible ? 1 : 0,
//         }}
//         transition={{
//           duration: 0.2,
//         }}
//         className={cn(
//           "w-full flex justify-between py-4 fixed top-0 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 items-center ",
//           className
//         )}
//       >
//         <Logo />
//         {/* <div className="flex space-x-4">
//           {navItems.map((navItem: any, idx: number) => (
//             <Link
//               key={`link=${idx}`}
//               href={navItem.link}
//               className={cn(
//                 "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
//               )}
//             >
//               <span className="block sm:hidden">{navItem.icon}</span>
//               <span className="hidden sm:block text-sm">{navItem.name}</span>
//             </Link>
//           ))}
//         </div> */}

//         <div className={cn("relative", className)}>
//           {/* Burger Button */}


//           {/* Menu Items */}
//           <div
//             className={`flex-col space-y-2 absolute top-full left-0 bg-white dark:bg-black border border-gray-200 shadow-lg ${
//               isMenuOpen ? "block" : "hidden"
//             } sm:hidden`}
//           >
//             {navItems.map((navItem, idx) => (
//               <Link
//                 key={`link=${idx}`}
//                 href={navItem.link}
//                 className={cn(
//                   "block px-4 py-2 text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300"
//                 )}
//                 onClick={() => setIsMenuOpen(false)} // Close the menu on link click
//               >
//                 <span className="block">{navItem.icon}</span>
//                 <span className="block text-sm">{navItem.name}</span>
//               </Link>
//             ))}
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden sm:flex space-x-4">
//             {navItems.map((navItem, idx) => (
//               <Link
//                 key={`link=${idx}`}
//                 href={navItem.link}
//                 className={cn(
//                   "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
//                 )}
//               >
//                 <span className="block sm:hidden">{navItem.icon}</span>
//                 <span className="hidden sm:block text-sm">{navItem.name}</span>
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div className="hidden md:block">
//           <button
//             className="object-contain absolute top-10 md:-top-5 right-10 animate-shake hover:animate-none"
//             onClick={() => {
//               alert("Mosquito button clicked!");
//             }}
//           >
//             <Image
//               src="/images/mosquito.jpg"
//               height="250"
//               width="250"
//               className="w-16 md:w-auto"
//               alt="Mosquito"
//               title="Bzzzt! Just a friendly mosquito reminding you to download my CV! Don't let me fly away! 🦟"
//             />
//             <span className="absolute text-xs right-9 bottom-0 md:bottom-10 md:right-40 hover:font-semibold  text-red-700 rounded px-2 py-1 ">
//               Download CV
//             </span>
//           </button>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// // Add the following CSS to your global CSS file or module styles


/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";
import React, { useState } from "react";
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

  const [visible, setVisible] = useState(true); // Start as visible
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious() ?? 0; // Fallback to 0 if undefined
      const direction = current - previous;

      // Show nav if at the top or if scrolling up
      if (scrollYProgress.get() === 0) {
        setVisible(true);
      } else if (direction < 0) {
        setVisible(true); // Scrolling up
      } else {
        setVisible(false); // Scrolling down
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "w-full flex justify-between py-4 fixed top-0 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 items-center ",
          className
        )}
      >
        <Logo />

        <div className={cn("relative", className)}>
          {/* Burger Button */}
          {/* Menu Items */}
          <div
            className={`flex-col space-y-2 absolute top-full left-0 bg-white dark:bg-black border border-gray-200 shadow-lg ${
              isMenuOpen ? "block" : "hidden"
            } sm:hidden`}
          >
            {navItems.map((navItem, idx) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "block px-4 py-2 text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300"
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

        <div className="hidden md:block">
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
            <span className="absolute text-xs right-9 bottom-0 md:bottom-10 md:right-40 hover:font-semibold text-red-700 rounded px-2 py-1">
              Download CV
            </span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
