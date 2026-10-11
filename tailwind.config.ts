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
          100: "#EAF4F0",
          200: "#C8D2CE",
          300: "#849B93",
          400: "#52B1A2",
          500: "#07877F", // User-specified primary teal
          600: "#07877F",
          700: "#066E68", // User-specified primary hover
          800: "#05524E",
          900: "#142923", // Deep forest
          950: "#0D1D19",
        },
        forest: {
          DEFAULT: "#142923",
          light: "#1C3830",
          dark: "#0D1D19",
        },
        // Editorial neutrals
        ink: {
          DEFAULT: "#182522", // Main text
          light: "#2B3C38",
          muted: "#5F6D68", // Secondary text
        },
        ivory: {
          DEFAULT: "#FAF9F6", // Main background
          soft: "#F5F3EC",
          dark: "#EFECE3",
        },
        sage: {
          DEFAULT: "#EAF4F0", // Subtle accent background
          light: "#F3F7F4",
          dark: "#D6E5D9",
        },
        slate: {
          muted: "#5F6D68", // Secondary text
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#FAF9F6",
          sage: "#EAF4F0",
          card: "#FFFFFF",
        },
        border: {
          DEFAULT: "#C8D2CE", // Idle input border
          subtle: "#E5E9E5", // Divider
          hover: "#849B93",
        },
        semantic: {
          success: "#087443",
          "success-light": "#EDF7F2",
          warning: "#B45309",
          "warning-light": "#FFFBEB",
          error: "#B42318",
          "error-light": "#FDF2F2",
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
