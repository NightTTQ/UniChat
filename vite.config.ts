import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "public",
  plugins: [
    vue(),
    AutoImport({ resolvers: [NaiveUiResolver()] }),
    Components({ resolvers: [NaiveUiResolver()] }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: false,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ws": {
        target: "http://localhost:3001",
        changeOrigin: true,
        ws: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ws/, ""),
      },
    },
  },
  build: {
    target: "modules",
    outDir: "dist",
    assetsDir: "assets",
    assetsInlineLimit: 4096,
    minify: "esbuild",
    sourcemap: true,
  },
  appType: "spa",
});
