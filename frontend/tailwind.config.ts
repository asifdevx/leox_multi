import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/Layout/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // Blue button default
          dark: "#2563EB",    // Blue hover/dark
        },
        secondary: {
          DEFAULT: "#6B7280", // Gray text/subtext
          light: "#9CA3AF",   // Lighter gray
          dark: "#374151",    // Darker gray (backgrounds)
        },
        danger: {
          DEFAULT: "#EF4444", // Red button
          dark: "#DC2626",    // Red hover
        },
        modal: {
          bg: "#1F1F1F",     // Modal background
          border: "#4B5563", // Modal border
          overlay: "rgba(0,0,0,0.6)", // Overlay
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
        blueGradientStart: "#3B82F6",
        blueGradientEnd: "#2563EB",
        blue: "#1fb6ff",
        purple: "#7e5bef",
        orange: "#ff7849",
        yellow: "#ffc82c",
        "gray-dark": "#273444",
        gray: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#0a0a0b"
        },
        darkbg: "#090F15",

        darktext: "#667D94",
        loadbg: "#9d9d9d",
        darkbox: "#0C1621",
        black: "#000000",
      },
      screens: {
        small: "500px",
        lg: "1000px",
        "2xl": "1400px",
      
      },
      blur: {
        3: "30px",
      },
      boxShadow: {
        header: "0 0px 5px rgba(0,0,0,.2)",
        modal: "0 10px 25px rgba(0,0,0,0.4)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      animation: {
        widthIncrease: "widthIncrease 0.3s ease-in-out", 
          'spin-slow': 'spin 1.5s linear infinite',
        
      },
      keyframes: {
        widthIncrease: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      aspectRatio: {
        "4/2": "4 / 2",
      },

      backgroundImage: {
        connectButton:
          "linear-gradient(0deg, rgba(159,149,231,1) 37%, rgba(59,181,226,1) 100%)",
        mobileBg:
          "linear-gradient(0deg, rgba(255,254,254,0.6015424164524421) 33%, rgba(255,255,255,0.7069408740359897) 37%)",
      },
    },
    fontFamily: {
      ponomar: ["Ponomar", "system-ui"],
    },
  },
  plugins: [],
};
export default config;
