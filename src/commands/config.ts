import { Command, InvalidArgumentError } from "commander";
import {
	ADD_CATALOG_VALUE_STATUS,
	addCatalogValue,
	configActionSchema,
	configCatalogSchema,
	configFieldSchema,
	disableActions,
	enableActions,
	formatConfig,
	addEnabledField,
	readConfig,
	removeEnabledField,
	updateParagraphSize,
	type ConfigCatalog,
} from "@/lib/cli/config";

interface CatalogValueInput {
	catalog: ConfigCatalog;
	value: string;
}

function parseParagraphSize(value: string): number {
	const parsedValue = Number(value);

	if (!Number.isInteger(parsedValue) || parsedValue < 1) {
		throw new InvalidArgumentError(
			"Paragraph size must be a positive integer.",
		);
	}

	return parsedValue;
}

function parseConfigField(value: string) {
	return configFieldSchema.parse(value);
}

function parseConfigAction(value: string) {
	return configActionSchema.parse(value);
}

function parseCatalogValue(value: string): CatalogValueInput {
	const separatorIndex = value.indexOf("=");

	if (separatorIndex === -1) {
		throw new InvalidArgumentError(
			'Catalog values must use the format catalog="value".',
		);
	}

	const catalog = configCatalogSchema.parse(value.slice(0, separatorIndex));
	const rawValue = value.slice(separatorIndex + 1).trim();
	const normalizedValue = rawValue.replace(/^(["'])(.*)\1$/, "$2").trim();

	if (normalizedValue.length === 0) {
		throw new InvalidArgumentError("Catalog value cannot be empty.");
	}

	return {
		catalog,
		value: normalizedValue,
	};
}

export function createConfigCommand() {
	const command = new Command("config").description(
		"Manage local CLI configuration",
	);

	command
		.command("paragraph-size")
		.description("Set the default paragraph size")
		.argument("<value>", "Paragraph size", parseParagraphSize)
		.action(async (value: number) => {
			const config = await updateParagraphSize(value);
			console.log(formatConfig(config));
		});

	command
		.command("add")
		.description("Add one value to a local catalog")
		.argument(
			"<entry>",
			'Catalog value assignment, for example company="acme"',
			parseCatalogValue,
		)
		.action(async (entry: CatalogValueInput) => {
			const result = await addCatalogValue(entry.catalog, entry.value);

			if (result.status === ADD_CATALOG_VALUE_STATUS.ALREADY_EXISTS) {
				console.log(result.status);
				return;
			}

			console.log(formatConfig(result.config));
		});

	const fieldCommand = command
		.command("field")
		.description("Manage fields used by future fill defaults");

	fieldCommand
		.command("add")
		.description("Add field for future fill defaults")
		.argument("<field>", "Field to add to defaults", parseConfigField)
		.action(async (field: string) => {
			const config = await addEnabledField(parseConfigField(field));
			console.log(formatConfig(config));
		});

	fieldCommand
		.command("remove")
		.description("Remove a field from future fill defaults")
		.argument("<field>", "Field to remove from defaults", parseConfigField)
		.action(async (field: string) => {
			const config = await removeEnabledField(parseConfigField(field));
			console.log(formatConfig(config));
		});

	command
		.command("list")
		.description("Print the current local configuration")
		.action(async () => {
			console.log(formatConfig(await readConfig()));
		});

	command
		.command("enable")
		.description("Enable actions to complement generate/fill commands")
		.argument("<action>", "Action to enable", parseConfigAction)
		.action(async (action: string) => {
			const config = await enableActions(parseConfigAction(action));
			console.log(formatConfig(config));
		});

	command
		.command("disable")
		.description("Disable actions to complement generate/fill commands")
		.argument("<action>", "Action to disable", parseConfigAction)
		.action(async (action: string) => {
			const config = await disableActions(parseConfigAction(action));
			console.log(formatConfig(config));
		});
	return command;
}
