import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

const isFirefox = process.env.BROWSER === "firefox";

export default defineManifest({
	manifest_version: 3,
	name: "MV3 Vite React Starter",
	description: pkg.description,
	version: pkg.version,
	icons: {
		16: "icons/icon-16.png",
		32: "icons/icon-32.png",
		48: "icons/icon-48.png",
		128: "icons/icon-128.png",
	},
	action: {
		default_popup: "src/popup/index.html",
		default_icon: "icons/icon-32.png",
	},
	options_page: "src/options/index.html",
	background: isFirefox
		? { scripts: ["src/background/index.ts"], type: "module" }
		: { service_worker: "src/background/index.ts", type: "module" },
	content_scripts: [
		{
			matches: ["https://*/*"],
			js: ["src/content/index.tsx"],
			run_at: "document_idle",
		},
	],
	permissions: ["storage", "alarms", "activeTab"],
	host_permissions: [],
	web_accessible_resources: [
		{
			resources: ["icons/*", "src/**/*"],
			matches: ["<all_urls>"],
		},
	],
});
