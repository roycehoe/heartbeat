import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["public/assets/logo-circle-heartbeat.png"],
      manifest: {
        name: "Heartbeat",
        short_name: "Heartbeat",
        start_url: "https://heartbeat.fancybinary.sg/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [],
      },
    }),
  ],
});
