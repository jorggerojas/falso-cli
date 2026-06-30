import { z } from "zod";
import {
	GENERATOR_IDS,
	createGeneratorResultSchema,
	personGeneratorRequestSchema,
} from "./contracts";
import {
	generateSeries,
	pickFromList,
	resolveDataset,
	resolveLocale,
} from "./helpers";
import { buildAddress, buildCity, buildState, buildZip } from "./location";
import {
	buildCompany,
	buildJobTitle,
	buildPhone,
	buildWebsite,
} from "./company";

const personaSchema = z
	.object({
		name: z.string().trim().min(1),
		email: z.string().trim().min(1),
		username: z.string().trim().min(1),
		website: z.string().trim().min(1),
		company: z.string().trim().min(1),
		jobTitle: z.string().trim().min(1),
		phone: z.string().trim().min(1),
		address: z.string().trim().min(1),
	})
	.strict();

const personaResultSchema = createGeneratorResultSchema(personaSchema);

const personaGeneratorRequestWithCatalogsSchema = personGeneratorRequestSchema
	.extend({
		customCompanyValues: z.array(z.string().trim().min(1)).default([]),
	})
	.strict();

function buildPersona(
	locale?: string,
	customCompanyValues: readonly string[] = [],
) {
	const dataset = resolveDataset(locale);
	const firstName = pickFromList(dataset.firstNames);
	const surname = pickFromList(dataset.surnames);
	const word = pickFromList(dataset.usernameWords);
	const name = `${firstName} ${surname}`;
	const username = `${firstName}.${surname}.${word}`.toLowerCase();
	const email = `${username}@${pickFromList(dataset.domains)}`;

	return personaSchema.parse({
		name,
		email,
		username,
		website: buildWebsite(locale),
		company: buildCompany(locale, customCompanyValues),
		jobTitle: buildJobTitle(),
		phone: buildPhone(),
		address: `${buildAddress()}, ${buildCity()}, ${buildState()} ${buildZip()}`,
	});
}

export function generatePersonas(input: unknown = {}) {
	const request = personaGeneratorRequestWithCatalogsSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return personaResultSchema.parse({
		id: GENERATOR_IDS.PERSONA,
		locale,
		count: request.count,
		values: generateSeries(request.count, () =>
			buildPersona(locale, request.customCompanyValues),
		),
	});
}
