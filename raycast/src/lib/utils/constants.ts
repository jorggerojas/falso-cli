import { CONFIG_CATALOGS } from "../cli/config";
import { generateTypeValues, type GenerateType } from "../cli/generate-types";

export const DEFAULT_FIELD: GenerateType = generateTypeValues[0] ?? "name";
export const DEFAULT_CATALOG: (typeof CONFIG_CATALOGS)[number] =
	CONFIG_CATALOGS[0] ?? "company";
export const DEFAULT_PARAGRAPH_SIZE = 3;
export const DEFAULT_COPY_TO_CLIPBOARD = true;
