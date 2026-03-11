import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#E8845A",
        soft: "#F5EFE6",
        muted: "#7A6E64",
        brand: {
          50: "#FDF6F0",
          100: "#FAE8D8",
          200: "#F5D0B0",
          300: "#EFB488",
          400: "#E8845A",
          500: "#D4623A",
          600: "#B8481F",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      }
    },
  },
  plugins: [],
};
export default config;
