import { randomUUID } from "node:crypto";
import {
	GENERATOR_IDS,
	createGeneratorResultSchema,
	generatedTextSchema,
	personGeneratorRequestSchema,
} from "./contracts";
import { generateSeries, resolveLocale } from "./helpers";

const textResultSchema = createGeneratorResultSchema(generatedTextSchema);

function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

function buildIp(): string {
	return Array.from({ length: 4 }, () => `${randomInt(256)}`).join(".");
}

function buildIpv6(): string {
	return Array.from({ length: 8 }, () =>
		randomInt(16 ** 4)
			.toString(16)
			.padStart(4, "0"),
	).join(":");
}

function buildMac(): string {
	return Array.from({ length: 6 }, () =>
		randomInt(256).toString(16).padStart(2, "0"),
	).join(":");
}

function buildBinary(): string {
	return `${randomInt(2 ** 8)
		.toString(2)
		.padStart(8, "0")}`;
}

function buildHex(): string {
	return `${randomInt(16 ** 6)
		.toString(16)
		.padStart(6, "0")}`;
}

function buildOctal(): string {
	return `${randomInt(8 ** 6).toString(8)}`;
}

function buildDecimal(): string {
	return `${100000 + randomInt(900000)}`;
}

function buildUuid(): string {
	return randomUUID();
}

export function generateIps(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.IP,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildIp()),
	});
}

export function generateIpv6s(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.IPV6,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildIpv6()),
	});
}

export function generateMacs(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.MAC,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildMac()),
	});
}

export function generateBinaryValues(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.BINARY,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildBinary()),
	});
}

export function generateHexValues(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.HEX,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildHex()),
	});
}

export function generateOctalValues(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.OCTAL,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildOctal()),
	});
}

export function generateDecimalValues(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.DECIMAL,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildDecimal()),
	});
}

export function generateUuids(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.UUID,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildUuid()),
	});
}
