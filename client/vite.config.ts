import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export const baseConfig = { plugins: [react()] };

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
});
