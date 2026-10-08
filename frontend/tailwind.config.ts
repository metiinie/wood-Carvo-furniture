import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          dark: "#3A2921",    // Primary Dark Wood
          walnut: "#6B4B38",  // Warm Walnut
          warm: "#D9B77A",    // Warm Wood Accent / Gold
          cream: "#F6F1E7",   // Warm Cream Background / Surface
          text: "#211814",    // Dark Deep Text
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        ethiopic: ["var(--font-ethiopic)", "Noto Sans Ethiopic", "sans-serif"],
      },
      minHeight: {
        tap: "44px",
      },
      minWidth: {
        tap: "44px",
      },
    },
  },
  plugins: [],
};

export default config;
