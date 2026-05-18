#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
if (!existsSync(dist)) {
	console.error("dist/ not found — run `pnpm build` first.");
	process.exit(1);
}

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const outDir = resolve(root, "zips");
mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, `${pkg.name}-${pkg.version}.zip`);

execSync(`zip -r -FS "${out}" .`, { cwd: dist, stdio: "inherit" });
console.log(`packed: ${out}`);
