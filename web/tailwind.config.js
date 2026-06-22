/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5B4B8A",
          50: "#E8E4F0",
          100: "#D4CCE1",
          200: "#AF9FC3",
          300: "#8A72A5",
          400: "#655587",
          500: "#5B4B8A",
          600: "#4A3C6E",
          700: "#392D52",
          800: "#281E36",
          900: "#170F1A",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FDF8E7",
          100: "#FBF1CF",
          200: "#F7E39F",
          300: "#F3D56F",
          400: "#EFC73F",
          500: "#D4AF37",
          600: "#AA8C2C",
          700: "#7F6921",
          800: "#554616",
          900: "#2A230B",
        },
        cream: {
          DEFAULT: "#F5E6CC",
          50: "#FFFFFF",
          100: "#FDFBF7",
          200: "#FBF7EF",
          300: "#F7EFDF",
          400: "#F3E7CF",
          500: "#F5E6CC",
          600: "#E5D4A3",
          700: "#D5C27A",
          800: "#C5B051",
          900: "#B59E28",
        },
        dark: {
          DEFAULT: "#1A1A2E",
          100: "#16213E",
          200: "#0F3460",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #F5E6CC 100%)",
        "gradient-primary": "linear-gradient(135deg, #5B4B8A 0%, #8A72A5 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "typewriter": "typewriter 0.1s steps(1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(212, 175, 55, 0.4)",
        "glow-lg": "0 0 40px rgba(212, 175, 55, 0.6)",
        "inner-glow": "inset 0 0 20px rgba(212, 175, 55, 0.2)",
      },
    },
  },
  plugins: [],
};