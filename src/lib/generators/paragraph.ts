import { z } from "zod";
import {
	GENERATOR_IDS,
	createGeneratorResultSchema,
	generatedTextSchema,
	personGeneratorRequestSchema,
} from "./contracts";
import { generateSeries, pickFromList, resolveLocale } from "./helpers";

const textResultSchema = createGeneratorResultSchema(generatedTextSchema);

const paragraphSubjects = [
	"The team",
	"This draft",
	"A product builder",
	"The demo flow",
	"Each fixture",
	"That dashboard",
	"The mock dataset",
	"Every release",
	"The platform",
	"The application",
	"The service",
	"The API layer",
	"The frontend",
	"The backend",
	"The design system",
	"The QA pipeline",
	"The staging environment",
	"The production stack",
	"The data model",
	"The content layer",
	"The analytics pipeline",
	"The onboarding flow",
	"The checkout experience",
	"The admin panel",
	"The mobile client",
	"The web client",
	"The integration layer",
	"The deployment pipeline",
	"The monitoring stack",
	"The documentation site",
	"The rubber duck",
	"A meeting that could have been an email",
	"The last standing browser tab",
	"Friday's deploy",
	"The haunted legacy codebase",
	"A suspiciously green CI badge",
	"The intern's first PR",
	"That TODO from 2019",
	"The production incident channel",
	"A keyboard shortcut nobody remembers",
	"The demo that almost worked",
	"A pull request named final-final-v2",
	"The snack-driven architecture team",
	"A linter with opinions",
] as const;

const paragraphVerbs = [
	"keeps",
	"improves",
	"simplifies",
	"supports",
	"drives",
	"clarifies",
	"speeds up",
	"organizes",
	"creates",
	"builds",
	"designs",
	"develops",
	"implements",
	"maintains",
	"optimizes",
	"debugs",
	"tests",
	"validates",
	"deploys",
	"monitors",
	"troubleshoots",
	"resolves",
	"fixes",
	"enhances",
	"upgrades",
	"rolls back",
	"restores",
	"documents",
	"refactors",
	"automates",
	"integrates",
	"secures",
	"scales",
	"streamlines",
	"standardizes",
	"coordinates",
	"aligns",
	"measures",
	"tracks",
	"reviews",
	"prioritizes",
	"heroically hotfixes",
	"accidentally ships",
	"bravely reverts",
	"nervously merges",
	"lovingly documents",
	"politely ignores",
	"mysteriously fixes",
	"aggressively refactors",
	"quietly panics",
	"boldly renames",
	"carefully uncomments",
	"accidentally deletes",
	"finally understands",
	"pretends to understand",
] as const;

const paragraphObjects = [
	"QA reviews",
	"design handoffs",
	"test fixtures",
	"content previews",
	"form demos",
	"developer workflows",
	"local prototyping",
	"release validation",
	"user onboarding",
	"user support",
	"user feedback",
	"user engagement",
	"user retention",
	"user satisfaction",
	"user experience",
	"user flow",
	"user journey",
	"user interaction",
	"user behavior",
	"user preferences",
	"user settings",
	"user data",
	"user profile",
	"user account",
	"user authentication",
	"API contracts",
	"staging environments",
	"CI pipelines",
	"accessibility audits",
	"performance benchmarks",
	"error monitoring",
	"feature flags",
	"documentation updates",
	"sprint planning",
	"backlog grooming",
	"code reviews",
	"deployment checks",
	"security scans",
	"load testing",
	"schema migrations",
	"cache invalidation",
	"search indexing",
	"payment flows",
	"notification delivery",
	"audit trails",
	"compliance checks",
	"data retention policies",
	"service level targets",
	"incident response",
	"rollback plans",
	"observability dashboards",
	"integration tests",
	"smoke tests",
	"regression suites",
	"release notes",
	"changelog entries",
	"rubber duck consultations",
	"merge conflict therapy",
	"pizza-driven development",
	"standup overrun prevention",
	"infinite TODO comments",
	"haunted legacy modules",
	"production-on-Friday rituals",
	"keyboard shortcuts nobody remembers",
	"the deploy button nobody should press",
	"scope creep appetizers",
	"Jira ticket avalanches",
	"demo gods",
	"console.log archaeology",
	"tab hoarding policies",
	"meeting that should have been a Slack message",
	"final-final-v2 filenames",
	"it works on my machine certificates",
	"chaos-driven roadmaps",
	"demon slayer training",
	"chicken debugging sessions",
	"tree-hugging standups",
	"human humanization workshops",
] as const;

const paragraphAdverbs = [
	"consistently",
	"gradually",
	"carefully",
	"effectively",
	"reliably",
	"efficiently",
	"routinely",
	"strategically",
	"suspiciously",
	"heroically",
	"accidentally",
	"theoretically",
	"optimistically",
	"desperately",
	"magically",
	"unironically",
	"quietly",
	"boldly",
	"inevitably",
	"miraculously",
] as const;

const paragraphContextPhrases = [
	"during early prototyping",
	"across design reviews",
	"throughout the release cycle",
	"in local development environments",
	"before each deployment",
	"across multiple product teams",
	"during QA sessions",
	"throughout user onboarding",
	"right before lunch",
	"five minutes before the demo",
	"after the third cup of coffee",
	"during a surprise exec review",
	"on a Friday afternoon",
	"while production is on fire",
	"after someone said it was a small change",
	"during the standup that ran long",
	"minutes before the sprint demo",
	"after the linter started judging everyone",
	"while someone shares their screen",
] as const;

const paragraphReasons = [
	"teams need reliable fixtures",
	"demos must feel realistic",
	"releases depend on stable workflows",
	"stakeholders expect clearer previews",
	"developers iterate quickly on mock data",
	"test coverage grows across the product",
	"the demo is in ten minutes",
	"someone said it would be quick",
	"the bug only happens on stage",
	"the CEO is watching the screen share",
	"it worked on my machine",
	"we promised it for yesterday",
	"the deploy window closes at noon",
	"the rubber duck demanded answers",
	"Slack is already panicking",
	"the linter rejected our optimism",
] as const;

const paragraphSentenceOpeners = [
	"Moreover,",
	"In addition,",
	"However,",
	"Furthermore,",
	"As a result,",
	"Meanwhile,",
	"Still,",
	"Next,",
	"In practice,",
	"For example,",
	"Overall,",
	"That said,",
	"Consequently,",
	"Plot twist,",
	"Somehow,",
	"Surprisingly,",
	"Unfortunately,",
	"Legend has it,",
	"Real talk,",
	"Between us,",
	"Hot take,",
	"Spoiler alert,",
	"Long story short,",
] as const;

interface ParagraphRequest {
	count?: number;
	locale?: string;
	paragraphSize?: number;
}

function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

function lowercaseFirst(value: string): string {
	if (value.length === 0) {
		return value;
	}

	return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function buildParagraphCoreClause(): string {
	const subject = pickFromList(paragraphSubjects);
	const verb = pickFromList(paragraphVerbs);
	const object = pickFromList(paragraphObjects);

	return `${subject} ${verb} ${object}`;
}

function buildParagraphSentence(): string {
	const pattern = randomInt(7);

	switch (pattern) {
		case 0: {
			const clause = buildParagraphCoreClause();
			return `${clause} ${pickFromList(paragraphContextPhrases)}.`;
		}
		case 1: {
			const subject = pickFromList(paragraphSubjects);
			const verb = pickFromList(paragraphVerbs);
			const object = pickFromList(paragraphObjects);
			return `${subject} ${pickFromList(paragraphAdverbs)} ${verb} ${object}.`;
		}
		case 2: {
			const clause = buildParagraphCoreClause();
			return `${clause} to support ${pickFromList(paragraphObjects)}.`;
		}
		case 3: {
			const clause = buildParagraphCoreClause();
			return `${clause} and ${pickFromList(paragraphVerbs)} ${pickFromList(paragraphObjects)}.`;
		}
		case 4: {
			const clause = buildParagraphCoreClause();
			return `Because ${pickFromList(paragraphReasons)}, ${lowercaseFirst(clause)}.`;
		}
		case 5: {
			const primary = buildParagraphCoreClause();
			const secondary = buildParagraphCoreClause();
			return `While ${lowercaseFirst(secondary)}, ${lowercaseFirst(primary)}.`;
		}
		default: {
			const clause = buildParagraphCoreClause();
			return `${clause}, which helps the team ${pickFromList(paragraphVerbs)} ${pickFromList(paragraphObjects)}.`;
		}
	}
}

function buildSentence(): string {
	return `${pickFromList(paragraphSentenceOpeners)} ${lowercaseFirst(buildParagraphSentence())}`;
}

function buildParagraph(size: number): string {
	return Array.from({ length: size }, (_, index) => {
		let sentence = buildParagraphSentence();

		if (index > 0 && randomInt(10) <= 7) {
			sentence = `${pickFromList(paragraphSentenceOpeners)} ${lowercaseFirst(sentence)}`;
		}

		return sentence;
	}).join(" ");
}

export function generateParagraphs(input: unknown = {}) {
	const request = z
		.object({
			locale: z.string().optional(),
			count: z.number().int().min(1).default(1),
			paragraphSize: z.number().int().min(1).default(3),
		})
		.strict()
		.parse(input) as Required<ParagraphRequest>;
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.PARAGRAPH,
		locale,
		count: request.count,
		values: generateSeries(request.count, () =>
			buildParagraph(request.paragraphSize),
		),
	});
}

export function generateSentences(input: unknown = {}) {
	const request = personGeneratorRequestSchema.parse(input);
	const locale = resolveLocale(request.locale);

	return textResultSchema.parse({
		id: GENERATOR_IDS.SENTENCE,
		locale,
		count: request.count,
		values: generateSeries(request.count, () => buildSentence()),
	});
}
