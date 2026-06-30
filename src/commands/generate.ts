import { Command, InvalidArgumentError } from "commander";
import { readConfig } from "@/lib/cli/config";
import {
	GENERATE_TYPES,
	generateTypeValues,
	type GenerateType,
} from "@/lib/cli/generate-types";
import { runGenerate, type GenerateOptions } from "@/lib/cli/run-generate";
import CopyToClipboard from "./copy-to-clipboard";

function parsePositiveInteger(value: string): number {
	const parsedValue = Number(value);

	if (!Number.isInteger(parsedValue) || parsedValue < 1) {
		throw new InvalidArgumentError("Count must be a positive integer.");
	}

	return parsedValue;
}

export function createGenerateCommand() {
	return new Command("generate")
		.description("Generate fake data for a single type")
		.argument(
			"[type]",
			`Type to generate (${generateTypeValues.join(", ")})`,
			GENERATE_TYPES.PERSONA,
		)
		.option(
			"-c, --count <number>",
			"Number of values to generate",
			parsePositiveInteger,
		)
		.option("-l, --locale <locale>", "Locale to use")
		.option("--domain <domain>", "Custom domain for email or url")
		.option("--path <path>", "Custom URL path")
		.option("--slug <slug>", "Custom URL slug")
		.action(async (type: string, options: GenerateOptions) => {
			const parsedType = type as GenerateType;

			if (!generateTypeValues.includes(parsedType)) {
				throw new InvalidArgumentError(
					`Unknown generator type "${type}". Available: ${generateTypeValues.join(", ")}`,
				);
			}

			const config = await readConfig();
			const result = runGenerate(parsedType, options, config);
			console.log(result);
			await new CopyToClipboard().copy(result);
		});
}

export { GENERATE_TYPES, runGenerate };
