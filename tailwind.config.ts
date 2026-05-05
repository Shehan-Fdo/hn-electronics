import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0D0D0D",
        accent: "#0066FF",
        line: "#E8E8E8",
        muted: "#6F6F6F",
        whatsapp: "#25D366"
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "8px"
      }
    }
  },
  plugins: []
};

export default config;
