import { Command } from "commander";
import { readConfig } from "@/lib/cli/config";
import { FILL_MODE, formatFillPlan } from "@/lib/cli/fill";
import CopyToClipboard from "./copy-to-clipboard";

interface FillOptions {
	dryRun?: boolean;
}

export function createFillCommand() {
	return new Command("fill")
		.description("Generate a local fill payload from the current config")
		.option("--dry-run", "Preview what would be generated")
		.action(async (options: FillOptions) => {
			const config = await readConfig();
			const mode = options.dryRun ? FILL_MODE.DRY_RUN : FILL_MODE.PAYLOAD;

			const result = await formatFillPlan(config, mode);
			console.log(result);
			await new CopyToClipboard().copy(result);
		});
}
