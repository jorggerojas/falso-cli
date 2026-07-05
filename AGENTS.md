# AGENTS.md — Falso

## Purpose

Falso is a fast, local-first fake content generator for developers, testers,
designers, and product builders.

It generates fake data, random text, structured mock objects, and reusable
payloads for forms, QA workflows, UI mockups, demos, dashboards, and CMS
entries—from the terminal and, optionally, from a Raycast extension on macOS.

## Distribution notes

- **CLI** — published as `falso-cli` on npm.
- **Raycast** — source lives in `raycast/`; **not submitted to the Raycast
  Store**. Raycast already has a popular
  [Lorem Ipsum](https://www.raycast.com/AntonNiklasson/lorem-ipsum) extension;
  Falso targets structured fake data beyond placeholder text and stays in-repo
  for personal/contributor installs.
- **Alternatives** — [Fake Filler](https://fakefiller.com) is a useful browser
  form filler but browser-only and sometimes over-fills fields. Falso is more
  general (CLI, Raycast, clipboard) and lets the user pick exact types and
  payloads.

## Project rules

- Primary surface is the **CLI**. Do not add a web UI, Astro, or other app
  frameworks beyond the existing Raycast extension in `raycast/`.
- Use TypeScript everywhere with strict mode.
- Use Commander for CLI parsing and subcommands.
- Use Zod for input validation and generator contracts.
- Use pnpm for package management.
- Use Biome for formatting and linting.
- Use Vitest for runtime checks.
- Use tsup to bundle the CLI for distribution.
- Keep the tool local-first and privacy-first.
- Do not add backend, auth, analytics, or AI APIs.
- Do not introduce `any`.
- Do not add unnecessary dependencies.
- Do not refactor unrelated code.

## Current stack

**CLI**

- TypeScript, Commander, Zod, tsup, Biome, Vitest, pnpm

**Raycast** (`raycast/`)

- React 19, `@raycast/api`, TypeScript; shared generators synced from `src/lib/`

## Scripts

- `pnpm dev` — run the CLI with `tsx` (pass CLI flags after `--`).
- `pnpm build` — bundle the CLI with `tsup`.
- `pnpm lint` — run Biome checks and apply safe fixes.
- `pnpm lint:ci` — run Biome in CI mode.
- `pnpm format` — format source files.
- `pnpm test` — run Vitest.
- `pnpm test:watch` — run Vitest in watch mode.
- `pnpm release` — patch release via `standard-version`.
- `pnpm release:minor` / `release:patch` / `release:major` — explicit semver bumps.
- `pnpm raycast:dev` — Raycast extension in development mode.
- `pnpm raycast:build` — build the Raycast extension.
- `pnpm raycast:preview` — build for local Raycast preview.

## CLI commands

The CLI ships `generate`, `config`, and `fill`. Keep handlers under
`src/commands/`, config and fill helpers under `src/lib/cli/`, and generation
logic under `src/lib/generators/`.

### `generate <type>`

Generate fake data for a single type and print it to stdout.

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

Use `--count` with any generator. Use `--locale` for locale-aware generators.
Use `--domain` for `email` and `url`, and use `--path` or `--slug` for `url`.

### `config`

Manage user preferences stored locally.

```bash
falso config paragraph-size 3        # paragraphs length (sentences or size tier)
falso config field add email         # enable a field in fill defaults
falso config field remove username   # disable a field in fill defaults
falso config add company="Acme"       # add one custom company value
falso config add url="acme.com"      # add one custom URL value
falso config list                    # show current settings
```

The config stores paragraph size, enabled fields used by `fill`, and custom
catalog values. By default, `fill` includes every `generate` type. Use
`config field remove` to disable fields and `config field add` to enable them
again. Use `config add <catalog>="value"` to add one custom catalog value at a
time. Duplicate values are ignored and print `already exists`. Custom company
values are used by `generate company`, `generate persona`, and `fill`. Custom
URL values are used by `generate url` and `fill`; values such as `acme.com` are
normalized to valid URLs such as `https://acme.com/`. Falso reads and writes
`~/.config/falso/config.json` unless `FALSO_CONFIG_PATH` points elsewhere.

### `fill`

Generate a local fill payload from the configured fields.

```bash
falso fill              # print a key-value fill payload using current config
falso fill --dry-run    # preview the fill plan with mode and field values
```

This command prints JSON for CLI pipelines and future automation.
By default, `fill` includes every `generate` type as a key-value object.
Use `config field remove` / `config field add` to customize the enabled fields.
`fill` reads the same config file that `config` updates, so any enabled fields
are picked up from `~/.config/falso/config.json` unless `FALSO_CONFIG_PATH` is
set.

## Source layout

- `src/index.ts` — CLI entry point.
- `src/commands/` — Commander commands and handlers.
- `src/lib/cli/` — config persistence and fill-plan helpers.
- `src/lib/generators/` — generator implementations (person, web, content, helpers, contracts).
- `src/lib/contracts/` — shared types and schemas.
- `src/data/` — catalog entries and typed datasets.
- `raycast/` — Raycast extension (React + `@raycast/api`). UI in `raycast/src/*.tsx`;
  `raycast/scripts/sync-shared.mjs` copies `src/lib/cli` and `src/lib/generators`
  into `raycast/src/lib` before dev/build—edit shared logic in the root `src/`
  tree, not the synced copies.

## Raycast extension

Commands: **Generate Fake Data**, **Build Fill Payload**, **Manage Config**.
Uses the same `~/.config/falso/config.json` as the CLI. Do not publish to the
Raycast Store; document changes in `raycast/README.md` when behavior or install
steps change.

## Working guidelines

- Inspect before editing.
- Prefer small, surgical changes.
- Keep the CLI surface thin; push logic into `src/lib/generators/`.
- Keep user-facing strings and docs in English unless a change explicitly adds locale support.
- Keep fake data clearly fake and safe for demos.
- Match patterns from similar CLIs in this workspace (e.g. `create-skeleton-next`) for Commander, prompts, and error handling when adding new commands.
