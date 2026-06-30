import clipboardy from "clipboardy";
import { readConfig } from "@/lib/cli/config";

interface CopyToClipboardService {
	copy: (value: string) => Promise<void>;
}

class CopyToClipboard implements CopyToClipboardService {
	private readonly isAvailable = readConfig().then(
		(config) => config.copyToClipboard ?? true,
	);

	async copy(value: string): Promise<void> {
		if (!(await this.isAvailable)) {
			console.log(
				"Clipboard is not available (disabled in config, set copyToClipboard to true on config file)",
			);
			return;
		}
		clipboardy.writeSync(value);
		console.log("Copied to clipboard");
	}
}

export default CopyToClipboard;
