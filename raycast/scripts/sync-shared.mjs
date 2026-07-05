import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raycastRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(raycastRoot, "..");

const targets = [
	{ from: join(repoRoot, "src/lib/cli"), to: join(raycastRoot, "src/lib/cli") },
	{
		from: join(repoRoot, "src/lib/generators"),
		to: join(raycastRoot, "src/lib/generators"),
	},
];

for (const { from, to } of targets) {
	rmSync(to, { recursive: true, force: true });
	cpSync(from, to, { recursive: true });
}

const runGeneratePath = join(raycastRoot, "src/lib/cli/run-generate.ts");
const runGenerateSource = readFileSync(runGeneratePath, "utf8");
const importFrom = 'from "@/lib/generators"';
const importTo = 'from "../generators"';
const rewrittenSource = runGenerateSource.replace(importFrom, importTo);

if (!rewrittenSource.includes(importTo)) {
	throw new Error(
		`Expected import ${importFrom} not found in ${runGeneratePath}`,
	);
}

if (rewrittenSource === runGenerateSource) {
	throw new Error(
		`Import rewrite did not change ${runGeneratePath}; expected ${importFrom}`,
	);
}

writeFileSync(runGeneratePath, rewrittenSource, "utf8");

console.log("Synced shared lib from src/lib into raycast/src/lib");
