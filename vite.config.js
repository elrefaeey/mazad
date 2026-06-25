import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        allowedHosts: [
            "all", // يسمح لكل hosts
            "localhost",
            "127.0.0.1",
            "donte-tromometrical-gratefully.ngrok-free.dev", // دومين ngrok الحالي
        ],
    },
});
