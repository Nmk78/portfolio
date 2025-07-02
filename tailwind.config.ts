


/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** @type {import('tailwindcss').Config} */
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
];

export const darkMode = "class";

export const theme = {
  extend: {
    keyframes: {
      slideUp: {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      slideDown: {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(100%)' },
      },
      spotlight: {
        "0%": {
          opacity: 0,
          transform: "translate(-72%, -62%) scale(0.5)",
        },
        "100%": {
          opacity: 1,
          transform: "translate(-50%,-40%) scale(1)",
        },
      },
    },
    animation: {
      slideUp: 'slideUp 1s ease forwards',
      slideDown: 'slideDown 1s ease forwards',
      spotlight: "spotlight 2s ease .75s 1 forwards",
    },

  },
};


function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export const plugins = [
  addVariablesForColors,
  require("@tailwindcss/typography"),
  require("@tailwindcss/forms"),
];

