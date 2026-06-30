import {
	GENERATOR_IDS,
	createGeneratorResultSchema,
	generatedTextSchema,
	personGeneratorRequestSchema,
} from "./contracts";
import { generateSeries, resolveLocale } from "./helpers";

const textResultSchema = createGeneratorResultSchema(generatedTextSchema);

const passwordAlphabetOptions =
	"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_";

function buildPassword(length = 16): string {
	return Array.from(
		{ length },
		() =>
			passwordAlphabetOptions[
				Math.floor(Math.random() * passwordAlphabetOptions.length)
			],
	).join("");
}

export function generatePasswords(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.PASSWORD,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildPassword()),
	});
}
