import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { qrngServerPlugin } from "./vite-plugin-qrng";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");

  const githubPages = process.env.GITHUB_PAGES === "true";
  const pagesBase = process.env.GITHUB_PAGES_BASE ?? "/Quantum-Pendulum/";

  return {
    base: githubPages ? pagesBase : "/",
    plugins: [react(), tailwindcss(), qrngServerPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/framer-motion")) return "motion";
          },
        },
      },
    },
  };
});
