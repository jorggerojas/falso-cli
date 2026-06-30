import type { FalsoConfig } from "./config";
import { GENERATE_TYPES, type GenerateType } from "./generate-types";
import {
	generateAddresses,
	generateBinaryValues,
	generateCities,
	generateCompanies,
	generateCountries,
	generateDecimalValues,
	generateEmails,
	generateFirstNames,
	generateFullNames,
	generateHexValues,
	generateIps,
	generateIpv6s,
	generateJobTitles,
	generateMacs,
	generateOctalValues,
	generateParagraphs,
	generatePasswords,
	generatePersonas,
	generatePhones,
	generateStates,
	generateUrls,
	generateUuids,
	generateUsernames,
	generateWebsites,
	generateZips,
	generateSentences,
} from "@/lib/generators";

export interface GenerateOptions {
	count?: number;
	domain?: string;
	locale?: string;
	path?: string;
	slug?: string;
}

function renderValues(values: readonly unknown[]): string {
	return values
		.map((value) =>
			typeof value === "string" ? value : JSON.stringify(value, null, 2),
		)
		.join("\n");
}

export function runGenerate(
	type: GenerateType,
	options: GenerateOptions,
	config?: FalsoConfig,
): string {
	switch (type) {
		case GENERATE_TYPES.ADDRESS:
			return renderValues(generateAddresses({ count: options.count }).values);
		case GENERATE_TYPES.BINARY:
			return renderValues(
				generateBinaryValues({ count: options.count }).values,
			);
		case GENERATE_TYPES.CITY:
			return renderValues(generateCities({ count: options.count }).values);
		case GENERATE_TYPES.COMPANY:
			return renderValues(
				generateCompanies({
					count: options.count,
					customValues: config?.catalogValues.company,
				}).values,
			);
		case GENERATE_TYPES.COUNTRY:
			return renderValues(generateCountries({ count: options.count }).values);
		case GENERATE_TYPES.DECIMAL:
			return renderValues(
				generateDecimalValues({ count: options.count }).values,
			);
		case GENERATE_TYPES.EMAIL:
			return renderValues(
				generateEmails({
					count: options.count,
					domain: options.domain,
					locale: options.locale,
				}).values,
			);
		case GENERATE_TYPES.FULL_NAME:
			return renderValues(
				generateFullNames({
					count: options.count,
					locale: options.locale,
				}).values,
			);
		case GENERATE_TYPES.HEX:
			return renderValues(generateHexValues({ count: options.count }).values);
		case GENERATE_TYPES.IP:
			return renderValues(generateIps({ count: options.count }).values);
		case GENERATE_TYPES.IPV6:
			return renderValues(generateIpv6s({ count: options.count }).values);
		case GENERATE_TYPES.JOB_TITLE:
			return renderValues(generateJobTitles({ count: options.count }).values);
		case GENERATE_TYPES.MAC:
			return renderValues(generateMacs({ count: options.count }).values);
		case GENERATE_TYPES.NAME:
			return renderValues(
				generateFirstNames({
					count: options.count,
					locale: options.locale,
				}).values,
			);
		case GENERATE_TYPES.OCTAL:
			return renderValues(generateOctalValues({ count: options.count }).values);
		case GENERATE_TYPES.PARAGRAPH:
			return renderValues(
				generateParagraphs({
					count: options.count,
					locale: options.locale,
					paragraphSize: config?.paragraphSize,
				}).values,
			);
		case GENERATE_TYPES.PASSWORD:
			return renderValues(generatePasswords({ count: options.count }).values);
		case GENERATE_TYPES.PERSONA:
			return renderValues(
				generatePersonas({
					count: options.count,
					locale: options.locale,
					customCompanyValues: config?.catalogValues.company,
				}).values,
			);
		case GENERATE_TYPES.PHONE:
			return renderValues(generatePhones({ count: options.count }).values);
		case GENERATE_TYPES.STATE:
			return renderValues(generateStates({ count: options.count }).values);
		case GENERATE_TYPES.URL:
			return renderValues(
				generateUrls({
					count: options.count,
					customValues: config?.catalogValues.url,
					domain: options.domain,
					locale: options.locale,
					path: options.path,
					slug: options.slug,
				}).values,
			);
		case GENERATE_TYPES.USERNAME:
			return renderValues(
				generateUsernames({
					count: options.count,
					domain: options.domain,
					locale: options.locale,
				}).values,
			);
		case GENERATE_TYPES.UUID:
			return renderValues(generateUuids({ count: options.count }).values);
		case GENERATE_TYPES.WEBSITE:
			return renderValues(generateWebsites({ count: options.count }).values);
		case GENERATE_TYPES.ZIP:
			return renderValues(generateZips({ count: options.count }).values);
		case GENERATE_TYPES.SENTENCE:
			return renderValues(generateSentences({ count: options.count }).values);
	}
}
