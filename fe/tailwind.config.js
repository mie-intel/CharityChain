// tailwind.config.js
const { bgBatik, tiltSpin, borderDashed } = require("./src/utils/helpers/tailwindAnimation/index");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        red: "#ff0000",
        green: "#00ff00",
        voss: "#222222",
      },
      fontFamily: {
        "eudoxus-bold": ["var(--font-eudoxus-bold)"],
        "eudoxus-extrabold": ["var(--font-eudoxus-extrabold)"],
        "eudoxus-light": ["var(--font-eudoxus-light)"],
        "eudoxus-regular": ["var(--font-eudoxus-regular)"],
        "eudoxus-medium": ["var(--font-eudoxus-medium)"],
      },
    },
  },
  plugins: [plugin(tiltSpin)],
};
