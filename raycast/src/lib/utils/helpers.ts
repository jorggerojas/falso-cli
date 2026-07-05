import { Toast, showToast } from "@raycast/api";

import { formatConfig, type FalsoConfig, CONFIG_CATALOGS } from "../cli/config";
import { generateTypeValues, type GenerateType } from "../cli/generate-types";

export function renderConfigMarkdown(config: FalsoConfig | null): string {
	if (!config) {
		return "# Falso config\n\nLoading…";
	}

	return `# Falso config\n\n\`\`\`json\n${formatConfig(config)}\n\`\`\``;
}

export function parsePositiveInteger(value: string): number {
	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 1) {
		throw new Error("Paragraph size must be a positive integer.");
	}

	return parsed;
}

export function parseGenerateType(value: string): GenerateType {
	if (!generateTypeValues.includes(value as GenerateType)) {
		throw new Error(`Unknown field: ${value}`);
	}

	return value as GenerateType;
}

export function parseCatalog(value: string): (typeof CONFIG_CATALOGS)[number] {
	if (!CONFIG_CATALOGS.includes(value as (typeof CONFIG_CATALOGS)[number])) {
		throw new Error(`Unknown catalog: ${value}`);
	}

	return value as (typeof CONFIG_CATALOGS)[number];
}

export function renderLoadingMarkdown(title: string): string {
	return `# ${title}\n\nGenerating…`;
}

export function renderJsonMarkdown(title: string, content: string): string {
	return `# ${title}\n\n\`\`\`json\n${content}\n\`\`\``;
}

export function renderErrorMarkdown(title: string, message: string): string {
	return `# ${title}\n\n${message}`;
}

export async function showFailureToast(title: string, message: string) {
	await showToast({ style: Toast.Style.Failure, title, message });
}

export async function showSuccessToast(title: string, message: string) {
	await showToast({ style: Toast.Style.Success, title, message });
}

export async function saveConfigMutation(
	title: string,
	mutate: () => Promise<FalsoConfig>,
	onSaved: (config: FalsoConfig) => void,
) {
	const toast = await showToast({ style: Toast.Style.Animated, title });

	try {
		const config = await mutate();
		onSaved(config);
		toast.style = Toast.Style.Success;
		toast.title = title;
		toast.message = "Saved";
	} catch (error) {
		toast.style = Toast.Style.Failure;
		toast.title = `${title} failed`;
		toast.message = error instanceof Error ? error.message : String(error);
	}
}
