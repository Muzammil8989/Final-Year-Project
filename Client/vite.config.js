import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tsparticles/react": path.resolve(__dirname, "./node_modules/@tsparticles/react"),
      "@tsparticles/slim": path.resolve(__dirname, "./node_modules/@tsparticles/slim"),
    },
  },
});
