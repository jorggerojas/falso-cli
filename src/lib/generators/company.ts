import { z } from "zod";
import {
	GENERATOR_IDS,
	createGeneratorResultSchema,
	generatedTextSchema,
	personGeneratorRequestSchema,
} from "./contracts";
import {
	generateSeries,
	pickFromList,
	resolveDataset,
	resolveLocale,
} from "./helpers";

const textResultSchema = createGeneratorResultSchema(generatedTextSchema);

const companyGeneratorRequestSchema = personGeneratorRequestSchema
	.extend({
		customValues: z.array(generatedTextSchema).default([]),
	})
	.strict();

const companyWords = [
	"Labs",
	"Works",
	"Studio",
	"Collective",
	"Systems",
	"Supply",
	"Group",
	"Cloud",
	"Inc",
	"Corp",
	"Corporation",
	"Company",
	"Tech",
	"Solutions",
	"Services",
	"Consulting",
	"Development",
	"Design",
	"Marketing",
	"Sales",
	"Support",
	"Entertainment",
	"Media",
	"Information",
	"Technology",
	"Innovation",
	"Research",
	"Education",
	"Healthcare",
	"Finance",
	"Insurance",
	"Real Estate",
	"Construction",
	"Transportation",
	"Logistics",
	"Manufacturing",
	"Retail",
	"Wholesale",
	"Distribution",
	"Goosebusters",
	"Vibes",
	"Chaos Factory",
	"Unicorn Wranglers",
	"Bug Hotels",
	"Refactor Therapy",
	"Slack Overflow",
	"Hotfix Heroes",
	"Tab Emergencies",
	"Monday Avoiders",
	"Deploy Anyway Co",
	"Works on My Machine",
	"Rubber Duck Dispatch",
	"Merge Conflict Spa",
	"Pizza-Driven Development",
	"Standup Survivors",
	"Keyboard Cowboys",
	"Null Pointer Society",
] as const;

const jobTitlePrefixes = [
	"Senior",
	"Lead",
	"Principal",
	"Staff",
	"Associate",
	"Product",
	"Growth",
	"Customer",
	"Director",
	"Junior",
	"VP",
	"CTO",
	"CFO",
	"CEO",
	"Founder",
	"Co-Founder",
	"Co-creator",
	"Director",
	"Manager",
	"Lic.",
	"Ing.",
	"Dr.",
	"Ph.D.",
	"M.D.",
	"B.A.",
	"B.S.",
	"B.Sc.",
	"B.Eng.",
	"B.Tech.",
	"B.Com.",
	"B.A.Sc.",
	"B.A.Ed.",
	"B.A.Ed.Sc.",
	"Chief",
	"Head",
	"Part-time",
	"Accidental",
	"Interim",
	"Rogue",
	"Senior Junior",
	"Coffee-powered",
	"Self-appointed",
	"Unofficial",
] as const;

const jobTitleRoles = [
	"Engineer",
	"Designer",
	"Manager",
	"Analyst",
	"Strategist",
	"Specialist",
	"Architect",
	"Coordinator",
	"Developer",
	"Advisor",
	"Consultant",
	"Expert",
	"Magician",
	"Wizard",
	"Guru",
	"Master",
	"Professor",
	"Doctor",
	"Mechanic",
	"Artist",
	"Writer",
	"Editor",
	"Publisher",
	"Reporter",
	"Photographer",
	"Videographer",
	"Director",
	"Producer",
	"Composer",
	"Arranger",
	"Conductor",
	"Dancer",
	"Actor",
	"Actress",
	"Songwriter",
	"Composer",
	"Non-agentic AI Human",
	"Agentic AI Human",
	"Non-robot engineer",
	"Almost-CEO",
	"Spreadsheet Surgeon",
	"Meeting Survivor",
	"Tab Hoarder",
	"Bug Whisperer",
	"Demo God",
	"Keyboard Cowboy",
	"Slack Archaeologist",
	"Merge Conflict Therapist",
	"Rubber Duck Consultant",
	"Standup Comedian",
	"Commit Message Poet",
	"Production Firefighter",
	"Scope Creep Wrangler",
	"Jira Ticket Tamer",
	"Lint Rule Enforcer",
	"Console.log Detective",
] as const;

function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

export function buildCompany(
	locale?: string,
	customValues: readonly string[] = [],
): string {
	if (customValues.length > 0 && Math.random() < 0.5) {
		return pickFromList(customValues);
	}

	const dataset = resolveDataset(locale);
	const surname = pickFromList(dataset.surnames);
	const suffix = pickFromList(companyWords);

	return `${surname} ${suffix}`;
}

export function buildJobTitle(): string {
	return `${pickFromList(jobTitlePrefixes)} ${pickFromList(jobTitleRoles)}`;
}

export function buildPhone(): string {
	return `(${200 + randomInt(700)}) ${100 + randomInt(900)}-${1000 + randomInt(9000)}`;
}

export function buildWebsite(locale?: string): string {
	const dataset = resolveDataset(locale);

	return `https://${pickFromList(dataset.domains)}`;
}

export function generateCompanies(input: unknown = {}) {
	const request = companyGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.COMPANY,
		locale,
		count: request.count,
		values: generateSeries(request.count, () =>
			buildCompany(locale, request.customValues),
		),
	});
}

export function generateJobTitles(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.JOB_TITLE,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildJobTitle()),
	});
}

export function generatePhones(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.PHONE,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildPhone()),
	});
}

export function generateWebsites(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.WEBSITE,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildWebsite(locale)),
	});
}
