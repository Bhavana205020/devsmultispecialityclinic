// Standalone Vite config for Netlify / Hostinger / Cloudflare Pages static SPA builds.
// Does NOT replace the Lovable in-editor config (vite.config.ts) — that one keeps the
// TanStack Start + Cloudflare Worker pipeline used by the Lovable preview.
//
// Build locally / on Netlify with:
//   vite build --config vite.netlify.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
      // Exclude server-only routes from the static SPA build.
      // /api/chat lives on the Lovable backend and is reached via the
      // Netlify proxy redirect in netlify.toml.
      routeFileIgnorePattern: "(^|/)api/",
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Shim Node's async_hooks so TanStack Router's Scripts/HeadContent
      // (which transitively imports start-storage-context) can build for the browser.
      "node:async_hooks": path.resolve(__dirname, "src/shims/async-hooks.ts"),
    },
  },
  define: {
    // Tells src/routes/__root.tsx to skip shellComponent + <Scripts/>.
    // Without this, RouterProvider renders <html>/<body> inside <div id="root">,
    // which causes a re-render loop on every input keystroke (Page Unresponsive).
    __SPA_ONLY__: "true",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
});
