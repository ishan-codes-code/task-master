import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // ✅ Only React plugin
  server: {
    allowedHosts: [
      "1b57e44a-991a-4eb9-9662-666a3ba399d6-00-370g4lciek7gs.sisko.replit.dev",
    ],
  },
});
