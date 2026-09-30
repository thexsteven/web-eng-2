import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
// Statt "vite-plugin-eslint" (seit 2022 ungepflegt, blockiert React Fast Refresh)
import eslint from "@nabla/vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),
    // lintet standardmäßig alle Dateien unter src/ (js, jsx, ts, tsx)
    eslint({
      eslintOptions: { fix: true },
    }),
    legacy({
      targets: ["defaults", "IE 11"],
    }),
  ],
  // relative Pfade, damit dist/ auch ohne Server-Root funktioniert
  base: "./",
  build: {
    outDir: "dist",
    // Vite 8 minifiziert standardmäßig mit Oxc, das auch im Legacy-Bundle
    // Template-Strings erzeugt -> Syntaxfehler in IE 11. Terser hält sich an das Target.
    minify: "terser",
  },
});
