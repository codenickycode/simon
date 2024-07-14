import plugin from "tailwindcss/plugin";
import { theme } from "./src/styles/theme";
import { customVarPadColors, pad3d } from "./src/styles/plugins";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme,
  plugins: [plugin(customVarPadColors), plugin(pad3d)],
};
