import { Command } from "commander";
import { createConfigCommand } from "./config";
import { createFillCommand } from "./fill";
import { createGenerateCommand } from "./generate";
import packageJson from "../../package.json";

export function createProgram() {
	return new Command()
		.name("falso")
		.description(`${packageJson.description} v${packageJson.version}`)
		.showHelpAfterError()
		.addCommand(createGenerateCommand(), {
			isDefault: true,
		})
		.alias("falsogen")
		.addCommand(createConfigCommand())
		.alias("falsoconfig")
		.addCommand(createFillCommand())
		.alias("falsofill");
}
