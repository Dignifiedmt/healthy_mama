import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Use @tailwindcss/vite

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // Tailwind v4.1 via Vite plugin
    ],
});
