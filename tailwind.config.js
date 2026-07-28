/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1180px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: "#05070d",
          900: "#080c18",
          800: "#0a1024",
          700: "#0f172a",
        },
        neon: {
          cyan: "#00f0ff",
          cyanSoft: "#22d3ee",
          purple: "#a855f7",
        },
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(0,240,255,0.35), 0 8px 30px rgba(0,240,255,0.35), 0 0 60px rgba(0,240,255,0.25)",
        neonLg: "0 0 0 1px rgba(0,240,255,0.45), 0 20px 60px rgba(0,240,255,0.45), 0 0 120px rgba(0,240,255,0.25)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 40px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        heroGradient:
          "linear-gradient(180deg, #05070d 0%, #060a18 40%, #0a1024 100%)",
        gridNoise:
          "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-18px,0)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: 0.8 },
          "50%": { opacity: 1 },
        },
        scrollHint: {
          "0%": { transform: "translateY(-4px)", opacity: 0 },
          "50%": { opacity: 1 },
          "100%": { transform: "translateY(14px)", opacity: 0 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translate3d(0,20px,0)" },
          "100%": { opacity: 1, transform: "translate3d(0,0,0)" },
        },
      },
      animation: {
        floaty: "floaty 9s ease-in-out infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
        scrollHint: "scrollHint 2.2s ease-in-out infinite",
        fadeUp: "fadeUp 0.9s cubic-bezier(.22,.61,.36,1) both",
      },
    },
  },
  plugins: [],
};
