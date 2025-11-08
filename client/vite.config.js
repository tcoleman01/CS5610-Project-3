// client/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // keep cookies consistent (localhost everywhere)
    port: 5174,
    proxy: {
<<<<<<< HEAD
  "/auth": { target: "http://localhost:4000", changeOrigin: false },
  "/users": { target: "http://localhost:4000", changeOrigin: false },
  "/api":  { target: "http://localhost:3000", changeOrigin: false },
},
=======
      "/auth": { target: "http://localhost:4000", changeOrigin: false },
      "/users": { target: "http://localhost:4000", changeOrigin: false },
      "/api": { target: "http://localhost:3000", changeOrigin: false },
    },
>>>>>>> 77a30f2a455c0776417505b51a79ea9337c99f2f
  },
});
