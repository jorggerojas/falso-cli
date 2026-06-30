export const GENERATE_TYPES = {
	ADDRESS: "address",
	BINARY: "binary",
	CITY: "city",
	COMPANY: "company",
	COUNTRY: "country",
	DECIMAL: "decimal",
	EMAIL: "email",
	FULL_NAME: "full-name",
	HEX: "hex",
	IP: "ip",
	IPV6: "ipv6",
	JOB_TITLE: "job-title",
	MAC: "mac",
	NAME: "name",
	OCTAL: "octal",
	PARAGRAPH: "paragraph",
	PASSWORD: "password",
	PERSONA: "persona",
	PHONE: "phone",
	STATE: "state",
	URL: "url",
	USERNAME: "username",
	UUID: "uuid",
	WEBSITE: "website",
	ZIP: "zip",
	SENTENCE: "sentence",
} as const;

export const generateTypeValues = Object.values(GENERATE_TYPES);

export type GenerateType = (typeof GENERATE_TYPES)[keyof typeof GENERATE_TYPES];

export const CONFIG_ACTIONS = {
	COPY_TO_CLIPBOARD: "copyToClipboard",
} as const;

export const configActionValues = Object.values(CONFIG_ACTIONS);

export type ConfigAction = (typeof CONFIG_ACTIONS)[keyof typeof CONFIG_ACTIONS];
