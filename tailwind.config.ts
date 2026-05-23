import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07060f",
        paper: "#f8f6ff",
        neon: "#00f5d4",
        punch: "#ff2d6a",
        sun: "#ffe600",
        grape: "#7c3aed",
        smoke: "#1a1628",
      },
      fontFamily: {
        display: ['"Segoe UI"', "system-ui", "sans-serif"],
        sans: ['"Segoe UI"', "system-ui", "sans-serif"],
        mono: ["ui-monospace", "Consolas", "monospace"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 6s ease-in-out 2s infinite",
        marquee: "marquee 55s linear infinite",
        "marquee-gpu": "marquee 70s linear infinite",
        "marquee-slow": "marquee 90s linear infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
      boxShadow: {
        neon: "0 0 40px rgba(0, 245, 212, 0.35)",
        punch: "0 0 40px rgba(255, 45, 106, 0.35)",
        card: "0 20px 60px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
