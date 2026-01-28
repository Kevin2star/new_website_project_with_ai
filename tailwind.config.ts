import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const enterTiming = "cubic-bezier(0.16, 1, 0.3, 1)";
const exitTiming = "cubic-bezier(0.7, 0, 0.84, 0)";

const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        "fade-in-0": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out-0": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "zoom-in-95": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out-95": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-in-from-left-1/2": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-left-1/2": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "slide-in-from-top-48": {
          from: { transform: "translateY(-48%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-top-48": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-48%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in-0": `fade-in-0 200ms ${enterTiming} both`,
        "fade-out-0": `fade-out-0 150ms ${exitTiming} both`,
        "zoom-in-95": `zoom-in-95 200ms ${enterTiming} both`,
        "zoom-out-95": `zoom-out-95 150ms ${exitTiming} both`,
        "slide-in-from-left-1/2": `slide-in-from-left-1/2 200ms ${enterTiming} both`,
        "slide-out-to-left-1/2": `slide-out-to-left-1/2 150ms ${exitTiming} both`,
        "slide-in-from-top-48": `slide-in-from-top-48 200ms ${enterTiming} both`,
        "slide-out-to-top-48": `slide-out-to-top-48 150ms ${exitTiming} both`,
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".animate-in": {
          animationDuration: "200ms",
          animationTimingFunction: enterTiming,
          animationFillMode: "both",
        },
        ".animate-out": {
          animationDuration: "150ms",
          animationTimingFunction: exitTiming,
          animationFillMode: "both",
        },
        ".fade-in-0": { animationName: "fade-in-0" },
        ".fade-out-0": { animationName: "fade-out-0" },
        ".zoom-in-95": { animationName: "zoom-in-95" },
        ".zoom-out-95": { animationName: "zoom-out-95" },
        ".slide-in-from-left-1\\/2": {
          animationName: "slide-in-from-left-1/2",
        },
        ".slide-out-to-left-1\\/2": {
          animationName: "slide-out-to-left-1/2",
        },
        ".slide-in-from-top-\\[48\\%\\]": {
          animationName: "slide-in-from-top-48",
        },
        ".slide-out-to-top-\\[48\\%\\]": {
          animationName: "slide-out-to-top-48",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
