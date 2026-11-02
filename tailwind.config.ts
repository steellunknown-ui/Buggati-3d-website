import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void:    "#07070A",
        surface: "#0D0D12",
        ink:     "#F5F5F0",
        dim:     "#6E6E7A",
        faint:   "#2A2A34",
        line:    "#1E1E26",
        blue:    "#C9F0FF",
        warm:    "#E8E4D9",
        gold:    "#B8A882",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      letterSpacing: {
        "ultra": "0.25em",
        "wide-xl": "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
