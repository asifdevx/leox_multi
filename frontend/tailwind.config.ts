import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "class"],
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
          DEFAULT: "hsl(var(--primary))",
          dark: "#2563EB",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          light: "#9CA3AF",
          dark: "#374151",
          foreground: "hsl(var(--secondary-foreground))",
        },
        danger: {
          DEFAULT: "#EF4444",
          dark: "#DC2626",
        },
        modal: {
          bg: "#1F1F1F",
          border: "#4B5563",
          overlay: "rgba(0,0,0,0.6)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
        blueGradientStart: "#3B82F6",
        blueGradientEnd: "#2563EB",   
        orange: "#ff7849",
        yellow: "#ffc82c",
        "gray-dark": "#273444",
        purple: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // default purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        gray: {
          "50": "#fafafa",
          "100": "#f4f4f5",
          "200": "#e4e4e7",
          "300": "#d4d4d8",
          "400": "#a1a1aa",
          "500": "#71717a",
          "600": "#52525b",
          "700": "#3f3f46",
          "800": "#27272a",
          "900": "#18181b",
          "950": "#0a0a0b",
        },
        darkbg: "#090F15",
        darktext: "#667D94",
        loadbg: "#9d9d9d",
        darkbox: "#0C1621",
        black: "#000000",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sidebarBg: "#0a1625",
        sidebarText: "#cfd8e1",
        sidebarActive: "#1f4b6f",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      screens: {
        xs:"300px",
        small: "500px",
        lg: "1000px",
        "2xl": "1400px",
      },
      blur: {
        "3": "30px",
      },
      boxShadow: {
        header: "0 0px 5px rgba(0,0,0,.2)",
        modal: "0 10px 25px rgba(0,0,0,0.4)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        widthIncrease: "widthIncrease 0.3s ease-in-out",
        "spin-slow": "spin 1.5s linear infinite",
        fadeIn: "fadeIn 0.4s ease-in-out",
        trail: "trail var(--duration) linear infinite",
      },
      keyframes: {
        widthIncrease: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
        trail: {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      aspectRatio: {
        "4/2": "4 / 2",
      },
      backgroundImage: {
        "bank-gradient": "linear-gradient(90deg, #0179FE 0%, #4893FF 100%)",
        "nft-dark-gradient":
          "linear-gradient(135deg, #0b1a2a, #102b44, #15405c)",
        sidebarActiveGradient: "linear-gradient(90deg, #102b44, #15405c)",
        connectButton:
          "linear-gradient(0deg, rgba(159,149,231,1) 37%, rgba(59,181,226,1) 100%)",
        mobileBg:
          "linear-gradient(0deg, rgba(255,254,254,0.6015424164524421) 33%, rgba(255,255,255,0.7069408740359897) 37%)",
        moving_button_bg: "linear-gradient(145deg, #e2e8ec, #ffffff)",
        hover_moving_button_bg:
          "linear-gradient(317deg, #13fdfd 0%, rgba(19, 215, 253, 1) 50%, rgba(19, 191, 253, 1) 62.96%, #139bfd 100%)",
        //items/owned
        "profile_bg":"linear-gradient(135deg, #0b1a2a, #102b44, #15405c)",
     
        },
    },
    fontFamily: {
      ponomar: ["Ponomar", "system-ui"],
    },
  },
  plugins: [require("tailwindcss-animate"),

],
};
export default config;
