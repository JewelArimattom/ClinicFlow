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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Primary deep teal identity
        brand: {
          50: "#F2F9F7",
          100: "#E2F2EE",
          200: "#C4E5DE",
          300: "#92CEC3",
          400: "#52B1A2",
          500: "#14958C",
          600: "#087F78", // Requested primary deep teal
          700: "#066761",
          800: "#05524E",
          900: "#044340",
          950: "#022725",
        },
        // Editorial neutrals
        ink: {
          DEFAULT: "#182522", // Requested deep ink dark text
          light: "#2B3C38",
          muted: "#66736F", // Requested muted slate
        },
        ivory: {
          DEFAULT: "#FAF9F5", // Requested warm ivory background
          soft: "#F5F3EC",
          dark: "#EFECE3",
        },
        sage: {
          DEFAULT: "#E9F1EB", // Requested pale sage secondary surface
          light: "#F3F7F4",
          dark: "#D6E5D9",
        },
        slate: {
          muted: "#66736F", // Requested muted slate
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#FAF9F5",
          sage: "#E9F1EB",
          card: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E5E5DF", // Requested subtle warm grey
          subtle: "#ECECE6",
        },
        semantic: {
          success: "#15803D",
          "success-light": "#F0FDF4",
          warning: "#B45309",
          "warning-light": "#FFFBEB",
          error: "#B91C1C",
          "error-light": "#FEF2F2",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Manrope",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "hero-lg": ["clamp(2.25rem, 5vw, 3.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "hero-md": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        "section": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "120": "30rem",
        "header": "var(--header-height)",
        "bottom-nav": "var(--bottom-nav-height)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
      borderRadius: {
        "sm": "8px",
        "md": "12px",
        "lg": "16px",
        "xl": "20px",
        "2xl": "24px",
      },
      boxShadow: {
        "xs": "var(--shadow-xs)",
        "card": "var(--shadow-sm)",
        "card-hover": "var(--shadow-lg)",
        "elevated": "var(--shadow-md)",
        "hero": "var(--shadow-xl)",
        "primary": "var(--shadow-primary)",
      },
      transitionTimingFunction: {
        "out-expo": "var(--ease-out)",
        "spring": "var(--ease-spring)",
      },
      transitionDuration: {
        "fast": "var(--duration-fast)",
        "normal": "var(--duration-normal)",
        "slow": "var(--duration-slow)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
