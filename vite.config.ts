import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { qrngServerPlugin } from "./vite-plugin-qrng";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");

  const githubPages = process.env.GITHUB_PAGES === "true";

  return {
    base: githubPages ? "/Quantum-Tarot/" : "/",
    plugins: [react(), tailwindcss(), qrngServerPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("readingDepth/majors")) return "readings-depth-majors";
            if (id.includes("readingDepth/wands")) return "readings-depth-wands";
            if (id.includes("readingDepth/cups")) return "readings-depth-cups";
            if (id.includes("readingDepth/swords")) return "readings-depth-swords";
            if (id.includes("readingDepth/pentacles"))
              return "readings-depth-pentacles";
            if (id.includes("readingPersonal/majors"))
              return "readings-personal-majors";
            if (id.includes("readingPersonal/wands"))
              return "readings-personal-wands";
            if (id.includes("readingPersonal/cups"))
              return "readings-personal-cups";
            if (id.includes("readingPersonal/swords"))
              return "readings-personal-swords";
            if (id.includes("readingPersonal/pentacles"))
              return "readings-personal-pentacles";
            if (id.includes("/data/readings/")) return "readings-core";
            if (id.includes("/lib/cardArt/")) return "card-art";
            if (id.includes("node_modules/framer-motion")) return "motion";
          },
        },
      },
    },
  };
});
