import { z } from "zod";
import type { FalsoConfig } from "./config";
import { runGenerate } from "./run-generate";

const FILL_MODE = {
	DRY_RUN: "dry-run",
	PAYLOAD: "payload",
} as const;

const fillFieldValueSchema = z
	.object({
		field: z.string().trim().min(1),
		value: z.string().trim().min(1),
	})
	.strict();

const fillPlanSchema = z
	.object({
		mode: z.enum([FILL_MODE.DRY_RUN, FILL_MODE.PAYLOAD]),
		values: z.array(fillFieldValueSchema),
	})
	.strict();

type FillMode = (typeof FILL_MODE)[keyof typeof FILL_MODE];
type FillFieldValue = z.infer<typeof fillFieldValueSchema>;
type FillPayload = Record<string, string>;

async function buildFillValues(config: FalsoConfig): Promise<FillFieldValue[]> {
	const values: FillFieldValue[] = [];

	for (const field of config.enabledFields) {
		const value = runGenerate(field, { count: 1 }, config).trim();

		if (value.length > 0) {
			values.push({ field, value });
		}
	}

	return values;
}

export async function buildFillPlan(config: FalsoConfig) {
	return fillPlanSchema.parse({
		mode: FILL_MODE.DRY_RUN,
		values: await buildFillValues(config),
	});
}

export async function buildFillPayload(
	config: FalsoConfig,
): Promise<FillPayload> {
	const payload: FillPayload = {};

	for (const { field, value } of await buildFillValues(config)) {
		payload[field] = value;
	}

	return payload;
}

export async function formatFillPlan(
	config: FalsoConfig,
	mode: FillMode,
): Promise<string> {
	const output =
		mode === FILL_MODE.DRY_RUN
			? await buildFillPlan(config)
			: await buildFillPayload(config);

	return JSON.stringify(output, null, 2);
}

export { FILL_MODE };
