# Proton Pass CLI Marketplace

A Claude Code plugin marketplace for managing passwords, secrets, and vaults via the Proton Pass CLI.

## Install as Marketplace

```bash
/plugin marketplace add <your-username>/proton-pass-cli-skill
/plugin install proton-pass-cli@proton-pass-marketplace
```

## Local Build

```bash
bun run build
```

Copies the plugin to `~/.claude/plugins/proton-pass-cli/` for local development.

## Structure

```
proton-pass-cli-skill/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace catalog
├── plugins/
│   └── proton-pass-cli/
│       ├── .claude-plugin/
│       │   └── plugin.json           # Plugin manifest
│       └── skills/
│           └── proton-pass-cli/
│               ├── SKILL.md          # Core skill content
│               └── references/
│                   └── commands.md   # Detailed command reference
├── build.mjs                         # Local install script
└── package.json
```
