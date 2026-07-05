import { useCallback, useEffect, useRef, useState } from "react";
import { Action, ActionPanel, Clipboard, Detail } from "@raycast/api";
import { readConfig } from "./lib/cli/config";
import { FILL_MODE, formatFillPlan } from "./lib/cli/fill";
import {
	renderErrorMarkdown,
	renderJsonMarkdown,
	renderLoadingMarkdown,
	showFailureToast,
	showSuccessToast,
} from "./lib/utils/helpers";

export default function FillCommand() {
	const [markdown, setMarkdown] = useState(() =>
		renderLoadingMarkdown("Fill payload"),
	);
	const [isLoading, setIsLoading] = useState(true);
	const runIdRef = useRef(0);

	const runFill = useCallback(async () => {
		const runId = ++runIdRef.current;
		setIsLoading(true);
		setMarkdown(renderLoadingMarkdown("Fill payload"));

		try {
			const config = await readConfig();
			if (runId !== runIdRef.current) {
				return;
			}

			const result = await formatFillPlan(config, FILL_MODE.PAYLOAD);
			if (runId !== runIdRef.current) {
				return;
			}

			await Clipboard.copy(result);
			if (runId !== runIdRef.current) {
				return;
			}

			setMarkdown(renderJsonMarkdown("Fill payload", result));
			await showSuccessToast("Payload ready", "Copied to clipboard");
		} catch (error) {
			if (runId !== runIdRef.current) {
				return;
			}

			const message = error instanceof Error ? error.message : String(error);
			setMarkdown(renderErrorMarkdown("Fill failed", message));
			await showFailureToast("Fill failed", message);
		} finally {
			if (runId === runIdRef.current) {
				setIsLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		void runFill();
	}, [runFill]);

	return (
		<Detail
			isLoading={isLoading}
			markdown={markdown}
			actions={
				<ActionPanel>
					<Action title="Generate Again" onAction={() => void runFill()} />
				</ActionPanel>
			}
		/>
	);
}
