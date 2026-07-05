import { useCallback, useEffect, useState } from "react";
import {
	Action,
	ActionPanel,
	Detail,
	Form,
	showToast,
	Toast,
	useNavigation,
} from "@raycast/api";
import {
	ADD_CATALOG_VALUE_STATUS,
	CONFIG_CATALOGS,
	addCatalogValue,
	addEnabledField,
	disableActions,
	enableActions,
	formatConfig,
	readConfig,
	removeEnabledField,
	updateParagraphSize,
	type FalsoConfig,
} from "./lib/cli/config";
import { CONFIG_ACTIONS, generateTypeValues } from "./lib/cli/generate-types";
import type {
	ParagraphFormValues,
	FieldFormValues,
	CatalogFormValues,
} from "./lib/utils/types";
import {
	saveConfigMutation,
	parseCatalog,
	parseGenerateType,
	parsePositiveInteger,
	renderConfigMarkdown,
} from "./lib/utils/helpers";
import {
	DEFAULT_CATALOG,
	DEFAULT_COPY_TO_CLIPBOARD,
	DEFAULT_FIELD,
	DEFAULT_PARAGRAPH_SIZE,
} from "./lib/utils/constants";

function ParagraphSizeForm({
	currentValue,
	onSaved,
}: {
	currentValue: number;
	onSaved: (config: FalsoConfig) => void;
}) {
	const { pop } = useNavigation();

	async function handleSubmit(values: ParagraphFormValues) {
		await saveConfigMutation(
			"Saving paragraph size",
			async () =>
				updateParagraphSize(parsePositiveInteger(values.paragraphSize)),
			(config) => {
				onSaved(config);
				pop();
			},
		);
	}

	return (
		<Form
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Save" onSubmit={handleSubmit} />
				</ActionPanel>
			}
		>
			<Form.TextField
				id="paragraphSize"
				title="Paragraph Size"
				defaultValue={String(currentValue)}
			/>
		</Form>
	);
}

function FieldForm({
	mode,
	onSaved,
}: {
	mode: "add" | "remove";
	onSaved: (config: FalsoConfig) => void;
}) {
	const { pop } = useNavigation();

	async function handleSubmit(values: FieldFormValues) {
		await saveConfigMutation(
			mode === "add" ? "Adding field" : "Removing field",
			async () => {
				const field = parseGenerateType(values.field);
				return mode === "add"
					? addEnabledField(field)
					: removeEnabledField(field);
			},
			(config) => {
				onSaved(config);
				pop();
			},
		);
	}

	return (
		<Form
			actions={
				<ActionPanel>
					<Action.SubmitForm
						title={mode === "add" ? "Add" : "Remove"}
						onSubmit={handleSubmit}
					/>
				</ActionPanel>
			}
		>
			<Form.Dropdown id="field" title="Field" defaultValue={DEFAULT_FIELD}>
				{generateTypeValues.map((field) => (
					<Form.Dropdown.Item key={field} value={field} title={field} />
				))}
			</Form.Dropdown>
		</Form>
	);
}

function CatalogForm({ onSaved }: { onSaved: (config: FalsoConfig) => void }) {
	const { pop } = useNavigation();

	async function handleSubmit(values: CatalogFormValues) {
		const toast = await showToast({
			style: Toast.Style.Animated,
			title: "Saving catalog value",
		});

		try {
			const catalog = parseCatalog(values.catalog);
			const value = values.value.trim();

			if (value.length === 0) {
				throw new Error("Catalog value cannot be empty.");
			}

			const result = await addCatalogValue(catalog, value);
			onSaved(result.config);
			pop();
			toast.style = Toast.Style.Success;
			toast.title =
				result.status === ADD_CATALOG_VALUE_STATUS.ALREADY_EXISTS
					? "Value already exists"
					: "Catalog value added";
			toast.message =
				result.status === ADD_CATALOG_VALUE_STATUS.ALREADY_EXISTS
					? "No changes"
					: "Saved";
		} catch (error) {
			toast.style = Toast.Style.Failure;
			toast.title = "Catalog value failed";
			toast.message = error instanceof Error ? error.message : String(error);
		}
	}

	return (
		<Form
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Save" onSubmit={handleSubmit} />
				</ActionPanel>
			}
		>
			<Form.Dropdown
				id="catalog"
				title="Catalog"
				defaultValue={DEFAULT_CATALOG}
			>
				{CONFIG_CATALOGS.map((catalog) => (
					<Form.Dropdown.Item key={catalog} value={catalog} title={catalog} />
				))}
			</Form.Dropdown>
			<Form.TextField id="value" title="Value" placeholder="Acme" />
		</Form>
	);
}

export default function ConfigCommand() {
	const [config, setConfig] = useState<FalsoConfig | null>(null);

	const handleConfigSaved = (nextConfig: FalsoConfig) => {
		setConfig(nextConfig);
	};

	const loadConfig = useCallback(async () => {
		try {
			setConfig(await readConfig());
		} catch (error) {
			await showToast({
				style: Toast.Style.Failure,
				title: "Could not load config",
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}, []);

	useEffect(() => {
		void loadConfig();
	}, [loadConfig]);

	const copyToClipboard = config?.copyToClipboard ?? DEFAULT_COPY_TO_CLIPBOARD;

	async function handleToggleClipboard() {
		const nextValue = !copyToClipboard;

		await saveConfigMutation(
			nextValue ? "Enabling clipboard copy" : "Disabling clipboard copy",
			async () =>
				nextValue
					? enableActions(CONFIG_ACTIONS.COPY_TO_CLIPBOARD)
					: disableActions(CONFIG_ACTIONS.COPY_TO_CLIPBOARD),
			handleConfigSaved,
		);
	}

	return (
		<Detail
			markdown={renderConfigMarkdown(config)}
			actions={
				<ActionPanel>
					<Action title="Refresh" onAction={() => void loadConfig()} />
					<Action.Push
						title="Set Paragraph Size"
						target={
							<ParagraphSizeForm
								currentValue={config?.paragraphSize ?? DEFAULT_PARAGRAPH_SIZE}
								onSaved={handleConfigSaved}
							/>
						}
					/>
					<Action.Push
						title="Add Field"
						target={<FieldForm mode="add" onSaved={handleConfigSaved} />}
					/>
					<Action.Push
						title="Remove Field"
						target={<FieldForm mode="remove" onSaved={handleConfigSaved} />}
					/>
					<Action.Push
						title="Add Catalog Value"
						target={<CatalogForm onSaved={handleConfigSaved} />}
					/>
					<Action
						title={
							copyToClipboard
								? "Disable Clipboard Copy"
								: "Enable Clipboard Copy"
						}
						onAction={() => void handleToggleClipboard()}
					/>
					{config ? (
						<Action.CopyToClipboard
							title="Copy Config"
							content={formatConfig(config)}
						/>
					) : null}
				</ActionPanel>
			}
		/>
	);
}
