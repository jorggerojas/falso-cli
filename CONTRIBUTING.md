# Contributing to Falso

Thank you for your interest in contributing! Contributions that keep the tool alive and easy to use are welcome.

## Prerequisites

- [Node.js](https://nodejs.org/) `>=22.12.0`
- [pnpm](https://pnpm.io/) (this repo uses pnpm only)

## Development setup

### Fork and clone

```bash
git clone https://github.com/jorggerojas/falso.git
cd falso
```

### Install dependencies

```bash
pnpm install
```

### Run the CLI locally

```bash
pnpm dev -- name
pnpm dev -- generate email --count 3
pnpm dev -- fill --dry-run
pnpm dev -- config list
```

Pass CLI flags after `--` so they are forwarded to the CLI entry point.

### Build

```bash
pnpm build
```

### Test and lint

```bash
pnpm test
pnpm lint
pnpm lint:ci   # check only, no writes (matches CI)
```

## Development workflow

1. Create a branch from `develop`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make focused changes. Prefer small, surgical diffs over large refactors.

3. Run checks before opening a PR:

   ```bash
   pnpm test
   pnpm lint
   pnpm build
   ```

4. Commit using [Conventional Commits](https://www.conventionalcommits.org/). Husky runs `lint-staged` on pre-commit and `commitlint` on commit messages.

### Commit types

| Type       | Use for                                               |
| ---------- | ----------------------------------------------------- |
| `feat`     | New CLI commands, generators, or user-facing behavior |
| `fix`      | Bug fixes                                             |
| `content`  | Catalog data, locales, or fake-data content updates   |
| `docs`     | README, CONTRIBUTING, or other documentation          |
| `test`     | Tests only                                            |
| `refactor` | Code changes without behavior changes                 |
| `perf`     | Performance improvements                              |
| `build`    | Build or bundling changes                             |
| `ci`       | CI/CD changes                                         |
| `chore`    | Maintenance (hidden from changelog)                   |

Examples:

```bash
git commit -m "feat: add sentence generator to fill output"
git commit -m "content: expand Spanish first-name catalog"
git commit -m "fix: normalize custom URL values without scheme"
```

## Project principles

Please keep these constraints in mind when contributing:

- **CLI only** — no web UI, Astro, Next.js, or similar app frameworks.
- **Local-first** — no network calls, backends, auth, analytics, or AI APIs.
- **TypeScript strict** — do not introduce `any`.
- **Minimal dependencies** — avoid adding packages unless they clearly earn their place.
- **Safe fake data** — generated values should be obviously fake and safe for demos.
- **English by default** — user-facing strings stay in English unless a change explicitly adds locale support.

## Adding a generator

When adding a new `generate` type:

1. Implement the generator under `src/lib/generators/`.
2. Register it in the generator index and contracts/schemas as needed.
3. Add the type to `src/lib/cli/generate-types.ts` and wire it in `src/commands/generate.ts`.
4. Update catalog or dataset files in `src/data/` when the generator uses shared lists.
5. If `fill` should include the new field by default, update the fill plan helpers in `src/lib/cli/`.
6. Add or extend Vitest coverage for the generator and CLI dispatch.
7. Document the new type in `README.md`.

Run `pnpm dev -- generate <type>` and `pnpm dev -- fill` to verify stdout output and JSON payloads.

## Pull request process

1. Open an issue first for large features or breaking changes so approach can be discussed.
2. Keep PRs focused on one feature or fix.
3. Include tests for behavior changes.
4. Update `README.md` when CLI surface, flags, or config behavior changes.
5. Ensure `pnpm test`, `pnpm lint:ci`, and `pnpm build` pass.
6. Write a clear PR title and description; link related issues.

Maintainers use [standard-version](https://github.com/conventional-changelog/standard-version) for releases. User-facing changes should use commit types that appear in `.versionrc.json` when appropriate.

## Need help?

- [Open an issue](https://github.com/jorggerojas/falso/issues) for bugs or feature requests.
- Check existing issues and pull requests before starting work.
- For agent-assisted contributions, see `AGENTS.md` for project-specific rules.

## Code of conduct

- Be respectful and inclusive.
- Welcome newcomers and help them get started.
- Give constructive, specific feedback.
- Keep discussions on topic.

Thank you for contributing!
