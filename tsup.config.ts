import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	// update-notifier and semver use CJS patterns that break when bundled as ESM
	external: ["update-notifier", "semver"],
});
