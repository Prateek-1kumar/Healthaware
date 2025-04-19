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
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
        },
      },
      borderRadius: {
        neu: "16px",
      },
      boxShadow: {
        "neu-flat":
          "5px 5px 10px rgba(0, 0, 0, 0.05), -5px -5px 10px rgba(255, 255, 255, 0.8)",
        "neu-pressed":
          "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
        "neu-flat-dark":
          "5px 5px 10px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.05)",
        "neu-pressed-dark":
          "inset 2px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.05)",
        glass: "0 4px 20px rgba(0, 0, 0, 0.1)",
        "skeu-btn":
          "0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        "skeu-inset": "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        ripple: {
          "0%": { opacity: "0.1", transform: "scale(0)" },
          "100%": { opacity: "0", transform: "scale(4)" },
        },
      },
      animation: {
        ripple: "ripple 600ms linear",
      },
    },
  },
  plugins: [],
};
export default config;
