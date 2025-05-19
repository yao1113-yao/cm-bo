import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 监听所有 IP 地址
    port: 3001, // 你可以选择一个合适的端口
  },
});
