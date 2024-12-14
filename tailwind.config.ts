import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const randomBoxShadow = () => {
  const particles = 50;
  const width = 500;
  const height = 500;
  let shadows = [];
  for (let i = 0; i < particles; i++) {
    const x = Math.random() * width - width / 2;
    const y = Math.random() * height - height / 1.2;
    shadows.push(`${x}px ${y}px hsl(${Math.random() * 360}, 100%, 50%)`);
  }
  return shadows.join(", ");
};

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        bang: {
          "100%": { boxShadow: randomBoxShadow() },
        },
        gravity: {
          "100%": {
            transform: "translateY(200px)",
            opacity: "0",
          },
        },
        position: {
          "0%, 19.9%": { marginTop: "10%", marginLeft: "40%" },
          "20%, 39.9%": { marginTop: "40%", marginLeft: "30%" },
          "40%, 59.9%": { marginTop: "20%", marginLeft: "70%" },
          "60%, 79.9%": { marginTop: "30%", marginLeft: "20%" },
          "80%, 99.9%": { marginTop: "30%", marginLeft: "80%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        bang: "bang 1s ease-out infinite backwards",
        gravity: "gravity 1s ease-in infinite backwards",
        position: "position 5s linear infinite backwards",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
  ],
} satisfies Config;

export default config;
