import { theme } from "./src/styles/theme";
import { plugins } from "./src/styles/plugins";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme,
  plugins,
};
