import { resolve } from "node:path";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import manifest from "./manifest.config";

export default defineConfig({
	resolve: {
		alias: { "@": resolve(__dirname, "src") },
	},
	plugins: [react(), crx({ manifest })],
	server: {
		port: 5173,
		strictPort: true,
		hmr: { port: 5174 },
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: true,
	},
});
