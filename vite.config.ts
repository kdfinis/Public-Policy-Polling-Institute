import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use repo name for GitHub Pages, "/" for local dev
  // GITHUB_REPOSITORY is automatically set by GitHub Actions (format: owner/repo-name)
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/",
  server: {
    host: "localhost",
    // 8080 is occupied by the API; run frontend on 5173 and proxy API
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 5173,
      overlay: false, // Disable error overlay to prevent connection issues
    },
    watch: {
      usePolling: false, // Disable polling to reduce CPU usage
      interval: 1000, // Check for changes every second
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/ready": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  define: {
    __VITE_IS_DEV__: JSON.stringify(true),
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
