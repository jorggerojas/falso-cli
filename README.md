# falso-cli

Falso CLI creates fake data for developers, testers, and
designers. It reduces time spent creating mock content or hunting ad-heavy
online tools.

It produces fake data, random text, structured mock objects, and reusable
payloads for forms, QA workflows, UI mockups, demos, dashboards, and CMS
entries—all without network calls.

Add custom values to the catalog and use them in the generation process.

## Surfaces

| Surface | Location | Best for |
| ------- | -------- | -------- |
| **CLI** | `falso` / `falso-cli` on npm | Scripts, pipes, automation, CI |
| **Raycast** | [`raycast/`](./raycast/) | Quick copy from the launcher on macOS |

The Raycast extension shares generators and config with the CLI. It is
**not submitted to the Raycast Store** because Raycast already offers a
[Lorem Ipsum](https://www.raycast.com/AntonNiklasson/lorem-ipsum) extension;
Falso covers a broader set of structured fake data and stays in-repo for
personal and contributor use. See [raycast/README.md](./raycast/README.md).

## Compared to other tools

**[Fake Filler](https://fakefiller.com)** is a solid browser extension for
filling web forms in one shot. It only works in the browser, and it can
sometimes populate more fields than you need. Falso is more general: use the
CLI or Raycast to generate exactly the value or JSON payload you want, then
paste it wherever you need it—browser, desktop app, terminal, or API client.

For placeholder paragraphs inside Raycast, the built-in
[Lorem Ipsum](https://www.raycast.com/AntonNiklasson/lorem-ipsum) extension
remains the right default; Falso complements it with names, emails, personas,
URLs, and the rest of the generator catalog.

## Installation

```bash
pnpm add -g falso-cli
falso --help
```

## Usage

### Commands

#### `generate <type>`

Use `generate` to print fake values directly to stdout. String-based
generators print one value per line, and `persona` prints formatted JSON.

```bash
falso generate name
falso generate email
falso generate full-name
falso generate username
falso generate persona
falso generate paragraph
falso generate password
falso generate url --domain example.dev --slug "Team Launch"
```

Also, default command is `generate` so you can use it like this:

```bash
falso <type>
# is the same as "falso generate <type>"
falso name --count 10
```


| Type | Output |
| ---- | ------ |
| `name` | First or given name |
| `email` | Email address |
| `address` | Address |
| `city` | City |
| `state` | State |
| `zip` | Zip code |
| `country` | Country |
| `phone` | Phone number |
| `website` | Website |
| `company` | Company |
| `job-title` | Job title |
| `url` | URL |
| `ip` | IP address |
| `ipv6` | IPv6 address |
| `mac` | MAC address |
| `uuid` | UUID |
| `binary` | Binary data |
| `hex` | Hexadecimal data |
| `octal` | Octal data |
| `decimal` | Decimal data |
| `full-name` | First and last name |
| `username` | Username / handle |
| `persona` | Structured person profile (name, email, username, etc.) |
| `paragraph` | Lorem-style paragraph (length from config) |
| `password` | Random password |

Current generator options:

- `--count` controls batch size for every generator.
- `--locale` falls back to English when an unsupported locale is provided.
- `--domain` customizes `email` and `url` output.
- `--path` and `--slug` customize `url` output.

#### `config`

Use `config` to manage local CLI defaults stored on disk.

```bash
falso config paragraph-size 3        # paragraphs length (sentences or size tier)
falso config field add email         # enable a field in fill defaults
falso config field remove username   # disable a field in fill defaults
falso config add company="Acme"       # add one custom company value
falso config add url="acme.com"      # add one custom URL value
falso config list                    # show current settings
```

The config file stores paragraph size, enabled fields used by `fill`, and
custom catalog values. By default, `fill` includes every `generate` type. Use
`config field remove` to disable fields and `config field add` to enable them
again. Use `config add <catalog>="value"` to add one custom catalog value at a
time. Duplicate values are ignored and print `already exists`. Custom company
values are used by `generate company`, `generate persona`, and `fill`. Custom
URL values are used by `generate url` and `fill`; values such as `acme.com` are
normalized to valid URLs such as `https://acme.com/`. Falso reads and writes
`~/.config/falso/config.json` unless `FALSO_CONFIG_PATH` points elsewhere.

#### `fill`

Use `fill` to generate a local payload from the enabled config fields. It prints
JSON for CLI pipelines and future automation instead of writing to the OS.

```bash
falso fill              # print a key-value fill payload using current config
falso fill --dry-run    # preview the fill plan with mode and field values
```

By default, `fill` includes every `generate` type as a key-value object.
Use `config field remove` / `config field add` to customize the enabled fields.

### Config file

Config file is stored in `~/.config/falso/config.json` by default. You can change the path by setting `FALSO_CONFIG_PATH` environment variable.

Using [`config` command](#config) you can manage the config file or directly edit it.

## Raycast extension

A companion Raycast extension lives in [`raycast/`](./raycast/). It exposes
**Generate Fake Data**, **Build Fill Payload**, and **Manage Config** commands
and reads the same config file as the CLI.

```bash
pnpm raycast:dev      # development mode
pnpm raycast:build    # production build
```

Once you run build command, you can start using the extension in Raycast.

Full setup, sync behavior, and store policy: [raycast/README.md](./raycast/README.md).

## Contributions

Contributions are welcome! Please feel free to open an issue or submit a pull request. Please follow the [Contributing Guide](CONTRIBUTING.md) for more details.
