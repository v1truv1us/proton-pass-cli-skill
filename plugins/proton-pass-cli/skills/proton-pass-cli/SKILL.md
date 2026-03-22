---
name: proton-pass-cli
description: This skill should be used when the user mentions "Proton Pass", "pass-cli", "protonpass", asks to retrieve secrets, manage vaults, create items, inject secrets into templates or use SSH keys stored in Proton Pass. The CLI command is `pass-cli` (NOT `pass`).
version: 1.0.0
---

# Proton Pass CLI Skill

## Overview

Proton Pass CLI provides command-line access to Proton Pass vaults, items, and secrets. Use it for secret management, automation, and SSH integration.

## Critical Note

**The CLI command is `pass-cli` (NOT `pass`)**

- Why: `pass-cli` is installed at https://proton.me/download/pass-cli/
- The: `pass` is important: `pass` is the standard Unix password manager with a different command and configuration file format

## Quick Start

```bash
pass-cli login
pass-cli vault list
pass-cli item list --vault-name "Personal"
```

## Object Model

```
Share (Share ID) ─── Vault (Name) ─── Item (Title)
```

| Object | Description | Identifier |
|--------|-------------|------------|
| Share | Access grant to vault/item | `share_id` (Base64) |
| Vault | Container for items | `share_id` or name |
| Item | Individual credential | `item_id` or title |
| Field | Data within item | Field name (case-sensitive) |

## Secret References
Use `pass://` URI syntax to reference secrets:

### Syntax
```
pass://<vault-identifier>/<item-identifier>/<field-name>
```

### Components
- **vault-identifier**: Share ID or vault name
- **item-identifier**: Item ID or item title
- **field-name**: Field to retrieve (e.g., `password`, `username`, `email`)

### Examples
```bash
pass://Work/GitHub/password              # Password field
pass://Personal/Email Login/username      # Username field
pass://Production/Database/connection_string  # Custom field
```

## Core Commands

### Authentication
```bash
pass-cli login                    # Web login (opens browser)
pass-cli login --interactive [USERNAME]  # CLI login with username
pass-cli logout                    # End session
pass-cli info                     # Show current session info
pass-cli test                    # Verify session is valid
```

### Vault Management
```bash
pass-cli vault list                              # List all vaults
pass-cli vault create --name NAME       # Create vault
pass-cli vault update --share-id ID --name NAME  # Rename vault
pass-cli vault delete --share-id ID      # Delete vault (permanent!)
pass-cli vault share --share-id ID EMAIL --role ROLE  # Share vault
```

### Item Management
```bash
pass-cli item list --vault-name NAME           # List items in vault
pass-cli item create login --title TITLE [options]  # Create login
pass-cli item view "pass://Vault/Item"           # View item
pass-cli item update --share-id ID --item-id ID --field FIELD=VALUE  # Update
pass-cli item delete --share-id ID --item-id ID   # Delete item
```

### Secret Injection
```bash
pass-cli inject --in-file FILE --out-file FILE   # Process template
pass-cli run -- COMMAND                         # Run command with secrets
pass-cli view "pass://Vault/Item/Field"     # View specific field
```

### SSH Integration
```bash
pass-cli ssh-agent load                    # Load keys into existing agent
pass-cli ssh-agent start                    # Start Proton Pass as SSH agent
pass-cli ssh-agent debug --vault-name NAME  # Debug SSH key items
```

## Item Types

| Type | Description | Create Command |
|------|-------------|----------------|
| Login | Username/password credentials | `pass-cli item create login` |
| Note | Secure text notes | `pass-cli item create note` |
| SSH Key | SSH key pairs | `pass-cli item create ssh-key generate` or `import` |
| Alias | Email aliases (Proton Mail) | `pass-cli item alias create` |
| Credit Card | Payment card details | `pass-cli item create credit-card` |

## Share Roles

| Role | Permissions |
|------|------------|
| Viewer | View only |
| Editor | View, create, edit items |
| Manager | Full control including sharing |

## Password Generation

```bash
# Random password (16 chars, symbols)
pass-cli item create login --title "New Account" --generate-password

# Passphrase (4 words)
pass-cli item create login --title "New Account" --generate-passphrase

# Custom format
pass-cli item create login --title "New Account" --generate-password="20,uppercase,symbols"
```

## Secret Injection Workflows

### Template Injection
Create template with `{{ pass://... }}` placeholders:
```yaml
database:
  password: {{ pass://Production/Database/password }}
```
Process:
```bash
pass-cli inject --in-file config.yaml.template --out-file config.yaml
```

### Environment Variable Injection
```bash
export DB_PASSWORD='pass://Production/Database/password'
pass-cli run -- ./deploy-app
```

### Direct Value Retrie
```bash
API_KEY=$(pass-cli view "pass://Work/API Keys/api_key")
echo $API_KEY
```

## SSH Agent Workflows

### Load Keys into Existing Agent
```bash
pass-cli ssh-agent load
```

### Use Proton Pass as SSH Agent
```bash
pass-cli ssh-agent start
export SSH_AUTH_SOCK=$HOME/.ssh/proton-pass-agent.sock
```

### Debug SSH Key Issues
```bash
pass-cli ssh-agent debug --vault-name "MyVault"
```

## Environment Variables

| Variable | Description |
| -------- | ------------- |
| `PROTON_PASS_PASSWORD` | Account password |
| `PROTON_PASS_TOTP` | TOTP code |
| `PROTON_PASS_EXTRA_PASSWORD` | Extra password for Pass |
| `PROTON_PASS_SSH_KEY_PASSWORD` | SSH key passphrase |
| `PROTON_PASS_SSH_KEY_PASSWORD_FILE` | Path to file containing SSH key passphrase |

## Common Workflows

### Create and Store SSH Key
```bash
pass-cli item create ssh-key generate --vault-name "Keys" --title "GitHub Deploy"
```

### Inject Secrets into Config File
```bash
cat > config.template <<EOF
database:
  host: localhost
  username: {{ pass://Work/API Keys/username }}
  password: {{ pass://Work/API Keys/password }}
EOF

pass-cli inject --in-file config.template --out-file config.yaml --force
```

### Run Command with Secrets
```bash
export DB_PASSWORD='pass://Production/Database/password'
pass-cli run -- ./deploy-app.sh
```

## Best Practices

- **Use IDs for precision**: Share IDs and Item IDs are unique; names may have duplicates
- **Clear environment variables after automation**: Unset `PROTON_PASS_*` after use
- **Never commit secrets to git**: Use `.env` files or environment variables
- **Use generated passwords**: Prefer `--generate-password` over manual entry
- **Test before use**: Run `pass-cli test` to verify session is valid
- **Use share roles appropriately**: Grant minimum necessary permissions
- **Organize by context**: Create separate vaults for work/personal/projects

## Troubleshooting

| Issue | Solution |
| -------| ---------- |
| Login fails | Check credentials, network connection |
| "Reference not found" | Verify vault/item exists with `vault list` / `item list` |
| "Field not found" | Check field names with `item view` |
| "Too many SSH keys" | Use `ssh-copy-id -o PreferredAuthentications=password -o PubkeyAuthentication=no` |
| "Command not found" | Ensure `pass-cli` is installed and in PATH |

## Resources

For detailed command reference, see [references/commands.md](references/commands.md)
