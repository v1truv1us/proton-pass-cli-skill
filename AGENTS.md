# AGENTS.md — Proton Pass CLI Skill

## Repository Overview

This is a **Claude Code plugin marketplace** for Proton Pass CLI integration. It is not a runtime application — it is a skill/plugin that gets copied into `~/.claude/plugins/proton-pass-cli/`. The only meaningful artifact is the plugin under `plugins/proton-pass-cli/`.

## Commands

### Build / Install

```bash
bun run build      # Copies plugins/proton-pass-cli/ → ~/.claude/plugins/proton-pass-cli/
```

After running `bun run build`, restart Claude Code or run `/reload-plugins` to pick up changes.

### Lint

No linting is configured. Do not add ESLint, Prettier, or Biome unless the team adopts them.

### Tests

No test framework is configured. There are no test files in this repository. Do not add a test runner without team consensus.

- **Single test command:** Not applicable — no tests exist.

### Manual Smoke Check

After `bun run build`, verify the plugin copied correctly:

```bash
ls ~/.claude/plugins/proton-pass-cli/
```

Expected output:

```
.claude-plugin/
skills/
```

## Code Style

### JavaScript (.mjs / .js)

- **ESM**: Use `import`/`export`. No CommonJS (`require`/`module.exports`).
- **Quotes**: Double quotes `"` for strings. Single quotes only where double quotes would require escaping.
- **Semicolons**: Always terminate statements with `;`.
- **Indentation**: 2 spaces. No tabs.
- **Imports**: Named imports from Node built-ins. Sort alphabetically.

```js
import { cpSync, readdirSync } from "fs";
import { join, resolve, relative } from "path";
import { homedir } from "os";
```

- **Constants**: `UPPER_SNAKE_CASE` for module-level constants (e.g., `PLUGIN_NAME`).
- **Variables/Functions**: `camelCase`. Function declarations (not arrow functions) for named helpers.
- **No unused imports**: `build.mjs:1` currently imports `mkdirSync` without using it — avoid this.

```js
// Good
const rootDir = resolve(import.meta.dirname);

// Avoid
const rootDir = resolve(import.meta.dirname)
```

### JSON

- 2-space indentation.
- Double quotes on all keys and string values.
- No trailing commas.
- Compact form (no unnecessary whitespace within values).

```json
{
  "name": "proton-pass-cli",
  "version": "1.0.0"
}
```

### Markdown

- Use ATX headings (`#`, `##`, `###`).
- Always annotate fenced code blocks with a language tag (` ```bash ``` `).
- Use tables for structured reference data.
- Use YAML front matter in `SKILL.md` files.

```markdown
---
name: proton-pass-cli
description: ...
---
```

### Error Handling

Fail-fast synchronous patterns are acceptable for tooling scripts (no `try/catch` unless you handle the error). For anything user-facing, add basic validation or descriptive error messages.

## Repository Structure

```
proton-pass-cli-skill/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace catalog (owned field must match)
├── plugins/
│   └── proton-pass-cli/           # SOURCE OF TRUTH — edit here, not in ~/.claude/plugins/
│       ├── .claude-plugin/
│       │   └── plugin.json        # Plugin manifest
│       └── skills/
│           └── proton-pass-cli/
│               ├── SKILL.md       # Core skill content
│               └── references/
│                   └── commands.md # Detailed command reference
├── build.mjs                       # Copies plugin → ~/.claude/plugins/
└── package.json
```

**The installed copy at `~/.claude/plugins/proton-pass-cli/` is a build artifact. Always edit files under `plugins/proton-pass-cli/` and re-run `bun run build`.**

## Metadata Synchronization Rules

These three files must stay in sync. When bumping the version, update all three:

| File | Field to update |
|------|-----------------|
| `package.json` | `version` |
| `.claude-plugin/marketplace.json` | `metadata.version` + plugin entry `version` |
| `plugins/proton-pass-cli/.claude-plugin/plugin.json` | `version` |

The `name` field in `marketplace.json` under `owner` must match the GitHub username of the plugin publisher.

## Plugin/Skill Authoring Conventions

### SKILL.md

- Start with YAML front matter containing `name`, `description`, and `version`.
- `description` field: write it as a trigger phrase for the AI agent. Be specific about what phrases should activate this skill.
- Keep the skill concise. Move deep reference material into `references/commands.md`.

### references/commands.md

- Organize by command group (auth, vault, item, SSH, etc.).
- Use `### command-name` headings for each subcommand.
- Document all flags under each command with `**Options:**` and examples.
- Include exit codes for CLI behavior.

## Important Domain Rules

- The CLI binary is `pass-cli` — **never `pass`**. `pass` is the standard Unix password manager with a different command structure.
- All examples in SKILL.md and commands.md must use `pass-cli`, never `pass`.
- Share IDs are Base64 strings and are unique identifiers; vault/item names are not unique and may have duplicates.

## What Not to Do

- Do not add tests, linting, or TypeScript without team approval.
- Do not edit `~/.claude/plugins/proton-pass-cli/` directly.
- Do not commit secrets or `.env` files.
- Do not add a `bun.lockb` — this repo does not track lockfiles.
- Do not change indentation styles in existing JSON files.

## Cursor / Copilot Rules

No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` files exist in this repository. There are no external agent-instruction files to include.
