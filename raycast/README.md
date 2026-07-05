# Falso for Raycast

Raycast extension that mirrors the Falso CLI: generate fake data, build fill
payloads, and manage local config without leaving the launcher.

This extension is **not published to the Raycast Store**. It lives in this
repository for personal use and contributors who already use Raycast.

## Why not in the Raycast Store?

Raycast already ships a popular [Lorem Ipsum](https://www.raycast.com/AntonNiklasson/lorem-ipsum)
extension for placeholder text. That overlap makes a store submission a poor fit
for review and discovery, so this extension stays source-only.

Falso goes further than lorem ipsum: names, emails, personas, URLs, network
values, passwords, and configurable fill payloads. Use the CLI when you want
the same generators in scripts and pipelines; use this extension when you want
quick copy-to-clipboard from Raycast.

## Compared to other tools

| Tool | Scope | Notes |
| ---- | ----- | ----- |
| **Falso (CLI + Raycast)** | Terminal, Raycast, any app via clipboard | Local-first, no network. You pick the type and copy exactly what you need. |
| [Fake Filler](https://fakefiller.com) | Browser only | Excellent for web forms, but it only runs in the browser and sometimes fills more fields than you intended. |
| [Lorem Ipsum (Raycast)](https://www.raycast.com/AntonNiklasson/lorem-ipsum) | Raycast → clipboard | Great for placeholder paragraphs; does not cover structured fake data. |

Falso is more general: one generator surface for QA, demos, CMS drafts, and
mock APIs—not tied to a single browser tab or text-only placeholders.

## Commands

| Command | Description |
| ------- | ----------- |
| **Generate Fake Data** | Pick a generator type, optional batch count, view result, copy to clipboard. |
| **Build Fill Payload** | Build JSON from enabled config fields and copy it to the clipboard. |
| **Manage Config** | View settings, paragraph size, enabled fill fields, and custom catalog values. |

Config is shared with the CLI at `~/.config/falso/config.json` (or
`FALSO_CONFIG_PATH` when set).

## Development

From the repository root:

```bash
pnpm raycast:dev      # run in Raycast development mode
pnpm raycast:build    # production build
pnpm raycast:preview  # build for local preview
```

Or from this directory:

```bash
pnpm install
pnpm dev
```

### Shared code sync

Before `dev` or `build`, `scripts/sync-shared.mjs` copies `src/lib/cli` and
`src/lib/generators` from the parent CLI package into `raycast/src/lib`. Edit
generators and CLI helpers in the root `src/` tree—not the synced copies under
`raycast/src/lib/` (they are overwritten on each sync).

## Requirements

- macOS (Raycast platform requirement)
- [Raycast](https://raycast.com) installed
- Node.js 22+ and pnpm

## Install locally (development)

1. Clone the [falso](https://github.com/jorggerojas/falso) repository.
2. Run `pnpm install` at the repo root, then `pnpm raycast:dev`.
3. In Raycast, open **Manage Extensions** → **+** → **Import Extension** and
   select the `raycast` folder.

The extension is private to your Raycast install; it will not appear in the
public store.
