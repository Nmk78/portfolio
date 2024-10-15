"use client";
import { useState } from "react";

export default function Logo() {
  const [isHoveredN, setIsHoveredN] = useState(false);
  const [isHoveredM, setIsHoveredM] = useState(false);
  const [isHoveredK, setIsHoveredK] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <div className="relative text-xl md:text-3xl z-30 space-x-0 md:space-x-2 overflow-hidden">
        {/* Letter N */}
        <div
          className="relative inline-block"
          onMouseEnter={() => setIsHoveredN(true)}
          onMouseLeave={() => setIsHoveredN(false)}
        >
          <span className="relative z-20 text-red-700 hover:text-gray-100 transition-colors duration-300">N</span>
          <div
            className={`absolute inset-0 bg-red-600 z-10 transition-all duration-500`}
            style={{
              transitionDelay: "0ms",
              transform: isHoveredN ? "translateY(0)" : "translateY(100%)",
              opacity: isHoveredN ? 1 : 0,
            }}
          ></div>
        </div>

        {/* Letter m */}
        <div
          className="relative inline-block"
          onMouseEnter={() => setIsHoveredM(true)}
          onMouseLeave={() => setIsHoveredM(false)}
        >
          <span className="relative z-20 text-red-700 hover:text-gray-100 transition-colors duration-300">m</span>
          <div
            className={`absolute inset-0 bg-red-600 z-10 transition-all duration-700`}
            style={{
              transitionDelay: "100ms",
              transform: isHoveredM ? "translateY(0)" : "translateY(100%)",
              opacity: isHoveredM ? 1 : 0,
            }}
          ></div>
        </div>

        {/* Letter k */}
        <div
          className="relative inline-block"
          onMouseEnter={() => setIsHoveredK(true)}
          onMouseLeave={() => setIsHoveredK(false)}
        >
          <span className="relative z-20 text-red-700 hover:text-gray-100 transition-colors duration-300">k</span>
          <div
            className={`absolute inset-0 bg-red-600 z-10 transition-all duration-[2000ms]`}
            style={{
              transitionDelay: "200ms",
              transform: isHoveredK ? "translateY(0)" : "translateY(100%)",
              opacity: isHoveredK ? 1 : 0,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
