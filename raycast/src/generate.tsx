import { useCallback, useEffect, useState } from "react";
import {
	Action,
	ActionPanel,
	Clipboard,
	Detail,
	Form,
	showToast,
	Toast,
	useNavigation,
} from "@raycast/api";
import { readConfig } from "./lib/cli/config";
import {
	GENERATE_TYPES,
	generateTypeValues,
	type GenerateType,
} from "./lib/cli/generate-types";
import { runGenerate, type GenerateOptions } from "./lib/cli/run-generate";

interface GenerateFormValues {
	type: string;
	count?: string;
}

function parseCount(value?: string): number | undefined {
	if (!value || value.trim().length === 0) {
		return undefined;
	}

	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 1) {
		throw new Error("Count must be a positive integer.");
	}

	return parsed;
}

function buildGenerateOptions(values: GenerateFormValues): GenerateOptions {
	return {
		count: parseCount(values.count),
	};
}

function GenerateResultView({
	type,
	options,
}: {
	type: GenerateType;
	options: GenerateOptions;
}) {
	const { pop } = useNavigation();
	const [markdown, setMarkdown] = useState("# Generated\n\nGenerating…");
	const [isLoading, setIsLoading] = useState(true);

	const runGeneration = useCallback(async () => {
		setIsLoading(true);
		setMarkdown("# Generated\n\nGenerating…");

		try {
			const config = await readConfig();
			const result = runGenerate(type, options, config);

			await Clipboard.copy(result);
			setMarkdown(`# Generated\n\n\`\`\`\n${result}\n\`\`\``);
			await showToast({
				style: Toast.Style.Success,
				title: "Generated fake data",
				message: "Copied to clipboard",
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setMarkdown(`# Generation failed\n\n${message}`);
			await showToast({
				style: Toast.Style.Failure,
				title: "Generation failed",
				message,
			});
		} finally {
			setIsLoading(false);
		}
	}, [type, options]);

	useEffect(() => {
		void runGeneration();
	}, [runGeneration]);

	return (
		<Detail
			isLoading={isLoading}
			markdown={markdown}
			actions={
				<ActionPanel>
					<Action
						title="Generate Again"
						onAction={() => void runGeneration()}
					/>
					<Action title="Back to Form" onAction={pop} />
				</ActionPanel>
			}
		/>
	);
}

export default function GenerateCommand() {
	const { push } = useNavigation();

	async function handleSubmit(values: GenerateFormValues) {
		try {
			const parsedType = values.type as GenerateType;

			if (!generateTypeValues.includes(parsedType)) {
				throw new Error(`Unknown generator type: ${values.type}`);
			}

			push(
				<GenerateResultView
					type={parsedType}
					options={buildGenerateOptions(values)}
				/>,
			);
		} catch (error) {
			await showToast({
				style: Toast.Style.Failure,
				title: "Invalid input",
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return (
		<Form
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Generate" onSubmit={handleSubmit} />
				</ActionPanel>
			}
		>
			<Form.Dropdown
				id="type"
				title="Type"
				defaultValue={GENERATE_TYPES.PERSONA}
			>
				{generateTypeValues.map((type) => (
					<Form.Dropdown.Item key={type} value={type} title={type} />
				))}
			</Form.Dropdown>
			<Form.TextField id="count" title="Count" placeholder="1" />
		</Form>
	);
}
