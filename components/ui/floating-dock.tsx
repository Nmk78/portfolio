/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import DynamicIcons from "../DynamicIcon";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { id: string; name: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { id: string; name: string }[];
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the component is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative block md:hidden", className)} ref={ref}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            layoutId="nav"
            className=" mb-2 inset-x-0 flex flex-row flex-wrap gap-2"
          >
            {items?.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -30 }}
                animate={{
                  opacity: 1,
                  y: 0, // Change this to 0 for upward movement
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <div className="h-10 w-10 rounded-full flex items-center">
                  <DynamicIcons icon={item.name} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { id: string; name: string }[];
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // let mouseX = useMotionValue(Infinity);
  const mouseX = useMotionValue(Infinity);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the component is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "w-full mx-auto hidden md:flex h-16 gap-4 items-end z-40 rounded-2xl px-0 pb-3",
        className
      )}
    >
      {isVisible &&
        items?.map((item, idx) => (
          <IconContainer mouseX={mouseX} key={idx} {...item} />
        ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  name,
}: {
  mouseX: MotionValue;
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [60, 100, 60]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [60, 100, 60]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [30, 50, 30]);
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [30, 50, 30]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <div>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square z-40 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              // Reduce padding here
              className="px-1 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {name}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          <DynamicIcons icon={name} />
        </motion.div>
      </motion.div>
    </div>
  );
}
