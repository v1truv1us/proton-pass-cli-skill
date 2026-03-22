# Proton Pass CLI Command Reference

## Installation

### Linux/macOS
```bash
curl -fsSL https://proton.me/download/pass-cli/install.sh | bash
```

### Windows
```powershell
Invoke-WebRequest -Uri https://proton.me/download/pass-cli/install.ps1 -OutFile install.ps1; .\install.ps1
```

## Authentication Commands

### login
Authenticate with Proton Pass and establish a session.

```bash
pass-cli login [--interactive [USERNAME]]
```

**Options:**
- `--interactive`: Use command-line authentication instead of web login

**Environment Variables:**
- `PROTON_PASS_PASSWORD`: Account password
- `PROTON_PASS_TOTP`: TOTP code
- `PROTON_PASS_EXTRA_PASSWORD`: Extra password for Pass
- `PROTON_PASS_PASSWORD_FILE`: Path to file containing password
- `PROTON_PASS_TOTP_FILE`: Path to file containing TOTP
- `PROTON_PASS_EXTRA_PASSWORD_FILE`: Path to file containing extra password

**Examples:**
```bash
pass-cli login
pass-cli login --interactive user@proton.me
PROTON_PASS_PASSWORD='password' pass-cli login --interactive user@proton.me
```

### logout
End current session.

```bash
pass-cli logout
```

### info
Display current session information.

```bash
pass-cli info
```

### test
Verify session is valid.

```bash
pass-cli test
```

## Vault Commands

### vault list
List all vaults.

```bash
pass-cli vault list [--output FORMAT]
```

**Options:**
- `--output FORMAT`: Output format (`human` or `json`)

**Examples:**
```bash
pass-cli vault list
pass-cli vault list --output json
```

### vault create
Create a new vault.

```bash
pass-cli vault create --name NAME
```

**Options:**
- `--name NAME`: Name of the vault (required)

**Examples:**
```bash
pass-cli vault create --name "Personal"
pass-cli vault create --name "Work Projects"
```

### vault update
Update vault properties.

```bash
pass-cli vault update (--share-id SHARE_ID | --vault-name NAME) --name NEW_NAME
```

**Options:**
- `--share-id SHARE_ID`: Share ID of vault
- `--vault-name NAME`: Name of vault
- `--name NEW_NAME`: New name (required)

**Examples:**
```bash
pass-cli vault update --share-id "abc123" --name "New Name"
pass-cli vault update --vault-name "Old Name" --name "New Name"
```

### vault delete
Delete a vault permanently.

```bash
pass-cli vault delete (--share-id SHARE_ID | --vault-name NAME)
```

**Options:**
- `--share-id SHARE_ID`: Share ID of vault
- `--vault-name NAME`: Name of vault

**Warning:** This permanently deletes the vault and all items within it.

### vault share
Share a vault with another user.

```bash
pass-cli vault share (--share-id SHARE_ID | --vault-name NAME) EMAIL [--role ROLE]
```

**Options:**
- `--share-id SHARE_ID`: Share ID of vault
- `--vault-name NAME`: Name of vault
- `EMAIL`: Email address to share with
- `--role ROLE`: Role (`viewer`, `editor`, `manager`)

### vault member
Manage vault members.

```bash
pass-cli vault member list (--share-id SHARE_ID | --vault-name NAME)
pass-cli vault member update --share-id SHARE_ID --member-share-id MEMBER_ID --role ROLE
pass-cli vault member remove --share-id SHARE_ID --member-share-id MEMBER_ID
```

### vault transfer
Transfer vault ownership.

```bash
pass-cli vault transfer (--share-id SHARE_ID | --vault-name NAME) MEMBER_SHARE_ID
```

## Item Commands

### item list
List items in a vault.

```bash
pass-cli item list [VAULT_NAME] [--share-id SHARE_ID] [--output FORMAT]
```

**Options:**
- `VAULT_NAME`: Name of vault (argument)
- `--share-id SHARE_ID`: Share ID of vault
- `--output FORMAT`: Output format (`human` or `json`)

### item create login
Create a login item.

```bash
pass-cli item create login [OPTIONS]
```

**Options:**
- `--share-id SHARE_ID` / `--vault-name NAME`: Target vault
- `--title TITLE`: Item title (required unless template)
- `--username USERNAME`: Username
- `--email EMAIL`: Email
- `--password PASSWORD`: Password
- `--generate-password[=SETTINGS]`: Generate password
- `--generate-passphrase[=WORD_COUNT]`: Generate passphrase
- `--url URL`: Associated URL (can be multiple)
- `--get-template`: Output JSON template
- `--from-template FILE`: Create from template file

**Password Generation Settings:**
Format: `"length,uppercase,symbols"`
- Example: `--generate-password="20,uppercase,symbols"`
- Default: 16 chars with uppercase and symbols

**Examples:**
```bash
pass-cli item create login --vault-name "Personal" --title "GitHub" --username "user" --generate-password --url "https://github.com"
pass-cli item create login --share-id "abc123" --title "API Key" --username "api_user" --password "secret123"
```

### item create note
Create a secure note.

```bash
pass-cli item create note --share-id SHARE_ID --title TITLE --note NOTE
```

### item create ssh-key generate
Generate a new SSH key pair.

```bash
pass-cli item create ssh-key generate [OPTIONS]
```

**Options:**
- `--share-id SHARE_ID` / `--vault-name NAME`: Target vault
- `--title TITLE`: Item title (required)
- `--key-type TYPE`: Key type (`ed25519`, `rsa2048`, `rsa4096`)
- `--comment COMMENT`: Key comment
- `--password`: Enable passphrase protection

**Examples:**
```bash
pass-cli item create ssh-key generate --vault-name "Keys" --title "GitHub" --key-type ed25519
```

### item create ssh-key import
Import an existing SSH key.

```bash
pass-cli item create ssh-key import --from-private-key PATH [OPTIONS]
```

**Options:**
- `--from-private-key PATH`: Path to private key file (required)
- `--share-id SHARE_ID` / `--vault-name NAME`: Target vault
- `--title TITLE`: Item title (required)
- `--password`: Prompt for passphrase if key is encrypted

### item view
View item details.

```bash
pass-cli item view [URI] [OPTIONS]
```

**Options:**
- `URI`: Pass URI (`pass://vault/item[/field]`)
- `--share-id SHARE_ID` / `--vault-name NAME`: Vault identifier
- `--item-id ITEM_ID` / `--item-title TITLE`: Item identifier
- `--field FIELD`: Specific field to view
- `--output FORMAT`: Output format

**Examples:**
```bash
pass-cli item view "pass://Personal/GitHub/password"
pass-cli item view --vault-name "Personal" --item-title "GitHub"
pass-cli item view --share-id "abc123" --item-id "xyz789" --field username
```

### item update
Update item fields.

```bash
pass-cli item update (--share-id SHARE_ID | --vault-name NAME) (--item-id ITEM_ID | --item-title TITLE) --field FIELD=VALUE [--field FIELD=VALUE]...
```

**Options:**
- `--share-id SHARE_ID` / `--vault-name NAME`: Vault identifier
- `--item-id ITEM_ID` / `--item-title TITLE`: Item identifier
- `--field FIELD=VALUE`: Field to update (can be multiple)

**Examples:**
```bash
pass-cli item update --vault-name "Personal" --item-title "GitHub" --field "password=newpass123"
pass-cli item update --share-id "abc123" --item-id "xyz789" --field "username=newuser" --field "password=newpass"
```

### item delete
Delete an item.

```bash
pass-cli item delete --share-id SHARE_ID --item-id ITEM_ID
```

### item share
Share an item with another user.

```bash
pass-cli item share --share-id SHARE_ID --item-id ITEM_ID EMAIL [--role ROLE]
```

### item alias create
Create an email alias.

```bash
pass-cli item alias create --share-id SHARE_ID --vault-name NAME --prefix PREFIX
```

### item totp
Generate TOTP codes.

```bash
pass-cli item totp [URI] [OPTIONS]
```

## Secret Injection Commands

### view
View secret value.

```bash
pass-cli view "pass://vault/item/field" [--output FORMAT]
```

### inject
Process template file with secret injection.

```bash
pass-cli inject --in-file FILE --out-file FILE [--force] [--file-mode MODE]
```

**Options:**
- `--in-file FILE`: Input template file
- `--out-file FILE`: Output file
- `--force`: Overwrite existing file
- `--file-mode MODE`: File permissions (default: 0600)

**Template Syntax:**
Use `{{ pass://... }}` to wrap secret references:
```yaml
password: {{ pass://Work/API Keys/password }}
```

### run
Run command with secrets injected into environment variables.

```bash
pass-cli run -- COMMAND [ARGS...]
```

**Environment Variable Syntax:**
```bash
export VAR_NAME='pass://vault/item/field'
pass-cli run -- ./command
```

## SSH Agent Commands

### ssh-agent load
Load SSH keys into existing agent.

```bash
pass-cli ssh-agent load [--share-id SHARE_ID] [--vault-name NAME]
```

### ssh-agent start
Start Proton Pass as SSH agent.

```bash
pass-cli ssh-agent start [--socket-path PATH] [--refresh-interval SECONDS] [--create-new-identities VAULT]
```

**Options:**
- `--socket-path PATH`: Custom socket path
- `--refresh-interval SECONDS`: Key refresh interval (default: 3600)
- `--create-new-identities VAULT`: Auto-import keys added via ssh-add

### ssh-agent debug
Debug SSH key items.

```bash
pass-cli ssh-agent debug [--share-id SHARE_ID] [--vault-name NAME] [--item-id ITEM_ID] [--item-title TITLE] [--output FORMAT]
```

## Password Commands

### password generate
Generate a random password or passphrase.

```bash
pass-cli password generate [--password] [--passphrase]
 [--settings SETTINGS]
```

### password analyze
Analyze password strength.

```bash
pass-cli password analyze PASSWORD
```

## Share Commands

### share list
List all shares.

```bash
pass-cli share list
```

### share info
Display share information.

```bash
pass-cli share info --share-id SHARE_ID
```

## Settings Commands

### settings set
Configure default settings.

```bash
pass-cli settings set default-vault VAULT_NAME
pass-cli settings set default-format FORMAT
```

### settings get
Display current settings.

```bash
pass-cli settings get
```

## User Commands

### user list
List all users.

```bash
pass-cli user list
```

## Update Command

### update
Check for updates.

```bash
pass-cli update
```

## Invite Commands

### invite list
List pending invites.

```bash
pass-cli invite list
```

### invite accept
Accept an invite.

```bash
pass-cli invite accept --invite-id INVITE_ID
```

## Output Formats

Most commands support `--output human` (default) and `--output json` for structured output.

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | Not authenticated |
| 4 | Not found |
| 5 | Permission denied |

## See Also

- **Official Documentation**: https://protonpass.github.io/pass-cli/
- **GitHub Repository**: https://github.com/ProtonPass/pass-cli
