import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#022B3A",
          dark: "#06131A",
          darker: "#030A0E",
          surface: "#091D27",
          teal: "#1F7A8C",
          cyan: "#0EA5E9",
          ice: "#BFDBF7",
          light: "#E1E5F2",
          border: "#133E50",
        },
        primary: {
          DEFAULT: "#022B3A",
          50: "#E6F0F3",
          100: "#CCE1E7",
          200: "#99C3CF",
          300: "#66A5B7",
          400: "#33879F",
          500: "#022B3A",
          600: "#02222E",
          700: "#011A23",
          800: "#011117",
          900: "#00090C",
        },
        secondary: {
          DEFAULT: "#1F7A8C",
          50: "#E8F5F7",
          100: "#D1EBEF",
          200: "#A3D7DF",
          300: "#75C3CF",
          400: "#47AFBF",
          500: "#1F7A8C",
          600: "#196270",
          700: "#134954",
          800: "#0C3138",
          900: "#06181C",
        },
        accent: {
          DEFAULT: "#0EA5E9",
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(31, 122, 140, 0.35)",
        "glow-cyan": "0 0 30px -5px rgba(14, 165, 233, 0.35)",
        "glow-primary": "0 0 30px -5px rgba(2, 43, 58, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
