import { createProgram } from "@/commands";

async function main() {
	try {
		await createProgram().parseAsync(process.argv);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

await main();
