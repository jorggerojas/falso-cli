import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { z } from "zod";
import {
	GENERATE_TYPES,
	generateTypeValues,
	configActionValues,
	type GenerateType,
	type ConfigAction,
} from "./generate-types";

export const CONFIG_CATALOGS = Object.values(
	GENERATE_TYPES,
) as readonly GenerateType[];

export const ADD_CATALOG_VALUE_STATUS = {
	ADDED: "added",
	ALREADY_EXISTS: "already exists",
} as const;

export const configFieldSchema = z.enum(
	generateTypeValues as [GenerateType, ...GenerateType[]],
);

export const configActionSchema = z.enum(
	configActionValues as [ConfigAction, ...ConfigAction[]],
);

export const configCatalogSchema = z.enum(CONFIG_CATALOGS);

const emptyCatalogValues = Object.fromEntries(
	CONFIG_CATALOGS.map((catalog) => [catalog, []]),
) as unknown as Record<GenerateType, string[]>;

const catalogValuesSchema = z
	.object(
		CONFIG_CATALOGS.reduce(
			(acc, catalog) => {
				acc[catalog] = z.array(z.string().trim().min(1)).default([]);
				return acc;
			},
			{} as Record<GenerateType, z.ZodDefault<z.ZodArray<z.ZodString>>>,
		),
	)
	.strict();

export const DEFAULT_ENABLED_FIELDS = [...generateTypeValues].sort((a, b) =>
	a.localeCompare(b),
);

export const falsoConfigSchema = z
	.object({
		paragraphSize: z.number().int().min(1).default(3),
		enabledFields: z.array(configFieldSchema).default(DEFAULT_ENABLED_FIELDS),
		catalogValues: catalogValuesSchema.default(emptyCatalogValues),
		copyToClipboard: z.boolean().default(true),
	})
	.strict();

export type ConfigField = z.infer<typeof configFieldSchema>;
export type ConfigCatalog = z.infer<typeof configCatalogSchema>;
export type FalsoConfig = z.infer<typeof falsoConfigSchema>;
export type AddCatalogValueStatus =
	(typeof ADD_CATALOG_VALUE_STATUS)[keyof typeof ADD_CATALOG_VALUE_STATUS];

export interface AddCatalogValueResult {
	config: FalsoConfig;
	status: AddCatalogValueStatus;
}

const DEFAULT_CONFIG = falsoConfigSchema.parse({});

function resolveConfigPath(): string {
	const customPath = process.env.FALSO_CONFIG_PATH;

	if (customPath && customPath.trim().length > 0) {
		return customPath;
	}

	return join(homedir(), ".config", "falso", "config.json");
}

async function ensureConfigDirectory(filePath: string) {
	await mkdir(dirname(filePath), { recursive: true });
}

export async function readConfig(): Promise<FalsoConfig> {
	const filePath = resolveConfigPath();

	try {
		const rawConfig = await readFile(filePath, "utf8");
		return falsoConfigSchema.parse(JSON.parse(rawConfig));
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return DEFAULT_CONFIG;
		}

		throw error;
	}
}

export async function writeConfig(config: FalsoConfig): Promise<FalsoConfig> {
	const filePath = resolveConfigPath();
	const nextConfig = falsoConfigSchema.parse(config);

	await ensureConfigDirectory(filePath);
	await writeFile(filePath, `${JSON.stringify(nextConfig, null, 2)}\n`, "utf8");

	return nextConfig;
}

export async function updateParagraphSize(value: number): Promise<FalsoConfig> {
	const currentConfig = await readConfig();

	return writeConfig({
		...currentConfig,
		paragraphSize: value,
	});
}

export async function addEnabledField(
	field: ConfigField,
): Promise<FalsoConfig> {
	const currentConfig = await readConfig();
	const enabledFields = Array.from(
		new Set([...currentConfig.enabledFields, field]),
	).sort((a, b) => a.localeCompare(b));

	return writeConfig({
		...currentConfig,
		enabledFields,
	});
}

export async function removeEnabledField(
	field: ConfigField,
): Promise<FalsoConfig> {
	const currentConfig = await readConfig();

	return writeConfig({
		...currentConfig,
		enabledFields: currentConfig.enabledFields.filter(
			(enabledField) => enabledField !== field,
		),
	});
}

export async function addCatalogValue(
	catalog: ConfigCatalog,
	value: string,
): Promise<AddCatalogValueResult> {
	const currentConfig = await readConfig();
	const normalizedValue = value.trim();
	const currentValues = currentConfig.catalogValues[catalog];

	if (currentValues.includes(normalizedValue)) {
		return {
			config: currentConfig,
			status: ADD_CATALOG_VALUE_STATUS.ALREADY_EXISTS,
		};
	}

	const config = await writeConfig({
		...currentConfig,
		catalogValues: {
			...currentConfig.catalogValues,
			[catalog]: [...currentValues, normalizedValue].sort((a, b) =>
				a.localeCompare(b),
			),
		},
	});

	return {
		config,
		status: ADD_CATALOG_VALUE_STATUS.ADDED,
	};
}

export function formatConfig(config: FalsoConfig): string {
	return JSON.stringify(config, null, 2);
}

export async function enableActions(
	action: ConfigAction,
): Promise<FalsoConfig> {
	const currentConfig = await readConfig();

	return writeConfig({
		...currentConfig,
		[action]: true,
	});
}

export async function disableActions(
	action: ConfigAction,
): Promise<FalsoConfig> {
	const currentConfig = await readConfig();

	return writeConfig({
		...currentConfig,
		[action]: false,
	});
}

export { GENERATE_TYPES as CONFIG_FIELDS } from "./generate-types";
