// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // ← Node.js built-in

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    host: '0.0.0.0',        // ← Wichtig: Von außen erreichbar
    port: 5173,              // ← Port auf 5173 setzen
    watch: {
      usePolling: true,      // ← CRITICAL für Docker/Windows!
      interval: 1000,        // ← Polling-Intervall
    },
    hmr: {
      clientPort: 5173,      // ← HMR Port
    },
  },
});
