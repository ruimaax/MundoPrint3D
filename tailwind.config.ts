import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        toy: {
          paper: "var(--paper)",
          cream: "var(--cream)",
          ink: "var(--ink)",
          red: "var(--red)",
          blue: "var(--blue)",
          yellow: "var(--yellow)",
          green: "var(--green)",
          pink: "var(--pink)",
        },
      },
      maxWidth: {
        shell: "78rem",
      },
    },
  },
  plugins: [],
};

export default config;
