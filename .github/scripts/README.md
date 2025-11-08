# GitHub Scripts

Utility scripts for maintaining the BambiSleep™ Church repository.

## 🎨 format-hex-codes.js

Automatically formats hex color codes in markdown files to prevent Copilot's instruction parser from misinterpreting them as tool references.

### Problem

GitHub Copilot's instruction parser treats hex codes like `#0A0014` as potential tool or toolset references, generating false-positive warnings:

```
Unknown tool or toolset '0A0014'.
```

### Solution

This script converts hex codes to a parser-safe format:

- `#0A0014` → `hex 0A0014`
- `` `#0A0014` `` → `hex 0A0014`

### Usage

```bash
# Format a single file
node .github/scripts/format-hex-codes.js .github/copilot-instructions.md

# Validate without modifying
node .github/scripts/format-hex-codes.js <file> --dry-run
```

### Integration

Add to `.vscode/settings.json` to run on save:

```json
{
  "files.saveActions": {
    "source.runScript": "node .github/scripts/format-hex-codes.js ${file}"
  }
}
```

Or add as a pre-commit hook in `.git/hooks/pre-commit`:

```bash
#!/bin/sh
node .github/scripts/format-hex-codes.js .github/copilot-instructions.md
```

## 📋 Future Scripts

- `validate-persona.js` - Validate persona YAML against schema
- `check-safety-coverage.js` - Ensure all violation types have tests
- `update-phase-docs.js` - Auto-update completion status in docs
