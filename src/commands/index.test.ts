import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ENABLED_FIELDS } from "@/lib/cli/config";

vi.mock("clipboardy", () => ({
	default: { writeSync: vi.fn() },
	writeSync: vi.fn(),
}));
import { generateTypeValues } from "@/lib/cli/generate-types";
import { createProgram } from "./index";

const originalConfigPath = process.env.FALSO_CONFIG_PATH;

describe("cli commands", () => {
	let configDirectory = "";

	beforeEach(async () => {
		configDirectory = await mkdtemp(join(tmpdir(), "falso-cli-"));
		process.env.FALSO_CONFIG_PATH = join(configDirectory, "config.json");
	});

	afterEach(() => {
		vi.restoreAllMocks();

		if (originalConfigPath) {
			process.env.FALSO_CONFIG_PATH = originalConfigPath;
			return;
		}

		delete process.env.FALSO_CONFIG_PATH;
	});

	it("generates supported fake values", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync([
			"node",
			"falso",
			"generate",
			"name",
			"--count",
			"2",
		]);

		expect(stdout).toHaveBeenCalledWith("Ava\nAva");
	});

	it("generates a persona by default when no type is provided", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync(["node", "falso"]);

		expect(stdout).toHaveBeenCalledWith(
			expect.stringContaining('"name": "Ava Parker"'),
		);
	});

	it("generates structured personas", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync(["node", "falso", "generate", "persona"]);

		expect(stdout).toHaveBeenCalledWith(
			expect.stringContaining('"name": "Ava Parker"'),
		);
	});

	it("persists config updates locally", async () => {
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync([
			"node",
			"falso",
			"config",
			"paragraph-size",
			"5",
		]);
		await createProgram().parseAsync([
			"node",
			"falso",
			"config",
			"field",
			"add",
			"email",
		]);

		const savedConfig = await readFile(
			process.env.FALSO_CONFIG_PATH ?? "",
			"utf8",
		);

		expect(JSON.parse(savedConfig)).toEqual({
			paragraphSize: 5,
			enabledFields: DEFAULT_ENABLED_FIELDS,
			catalogValues: expect.objectContaining({
				company: [],
				url: [],
			}),
			copyToClipboard: true,
		});
		expect(stdout).toHaveBeenCalled();
	});

	it("adds one catalog value and reports duplicates", async () => {
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync([
			"node",
			"falso",
			"config",
			"add",
			"company=Acme",
		]);
		await createProgram().parseAsync([
			"node",
			"falso",
			"config",
			"add",
			"company=Acme",
		]);

		const savedConfig = await readFile(
			process.env.FALSO_CONFIG_PATH ?? "",
			"utf8",
		);

		expect(JSON.parse(savedConfig)).toEqual(
			expect.objectContaining({
				catalogValues: expect.objectContaining({
					company: ["Acme"],
				}),
			}),
		);
		expect(stdout).toHaveBeenCalledWith("already exists");
	});

	it("adds and uses custom URL catalog values", async () => {
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync([
			"node",
			"falso",
			"config",
			"add",
			"url=acme.com",
		]);

		const savedConfig = await readFile(
			process.env.FALSO_CONFIG_PATH ?? "",
			"utf8",
		);

		expect(JSON.parse(savedConfig)).toEqual(
			expect.objectContaining({
				catalogValues: expect.objectContaining({
					url: ["acme.com"],
				}),
			}),
		);

		stdout.mockClear();
		vi.spyOn(Math, "random").mockReturnValue(0);

		await createProgram().parseAsync(["node", "falso", "generate", "url"]);

		expect(stdout).toHaveBeenCalledWith("https://acme.com/");
	});

	it("uses custom catalog values when generating companies", async () => {
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync([
			"node",
			"falso",
			"config",
			"add",
			"company=Acme",
		]);

		stdout.mockClear();
		vi.spyOn(Math, "random").mockReturnValue(0);

		await createProgram().parseAsync(["node", "falso", "generate", "company"]);

		expect(stdout).toHaveBeenCalledWith("Acme");
	});

	it("prints a fill dry-run payload", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync(["node", "falso", "fill", "--dry-run"]);

		const output = stdout.mock.calls.find(
			([message]) =>
				typeof message === "string" && message.trimStart().startsWith("{"),
		)?.[0] as string;
		const plan = JSON.parse(output) as {
			mode: string;
			values: Array<{ field: string; value: string }>;
		};

		expect(plan.mode).toBe("dry-run");
		expect(
			plan.values
				.map((entry) => entry.field)
				.sort((a, b) => a.localeCompare(b)),
		).toEqual([...generateTypeValues].sort((a, b) => a.localeCompare(b)));
	});

	it("prints a fill payload as a key-value object", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync([
			"node",
			"falso",
			"config",
			"add",
			"company=Acme",
		]);
		stdout.mockClear();

		await createProgram().parseAsync(["node", "falso", "fill"]);

		const output = stdout.mock.calls.find(
			([message]) =>
				typeof message === "string" && message.trimStart().startsWith("{"),
		)?.[0] as string;
		const payload = JSON.parse(output) as Record<string, string>;

		expect(Object.keys(payload).sort((a, b) => a.localeCompare(b))).toEqual(
			[...generateTypeValues].sort((a, b) => a.localeCompare(b)),
		);
		expect(payload.email).toEqual(expect.any(String));
		expect(payload.company).toBe("Acme");
		expect(payload.username).toEqual(expect.any(String));
		expect(payload).not.toHaveProperty("mode");
		expect(payload).not.toHaveProperty("values");
	});

	it("generates sentences", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const stdout = vi.spyOn(console, "log").mockImplementation(() => undefined);

		await createProgram().parseAsync(["node", "falso", "generate", "sentence"]);

		expect(stdout).toHaveBeenCalledWith(expect.stringContaining("prototyping"));
	});
});
