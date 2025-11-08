# 🎨 Hex Code Formatting Guide

## Problem Solved

GitHub Copilot's instruction parser was misinterpreting hex color codes as tool references, causing warnings like:

```
Unknown tool or toolset '0A0014'.
Unknown tool or toolset '00F0FF'.
```

## Solution Implemented

### ✅ Fixed Format (Current)

All hex codes in `.github/copilot-instructions.md` now use the `hex` prefix:

```markdown
| Color      | Hex Code   | Description |
| ---------- | ---------- | ----------- |
| Background | hex 0A0014 | Deep Void   |
| Primary    | hex 00F0FF | Cyber Cyan  |
```

### ❌ Problematic Formats (Avoid)

- `#0A0014` - Parser sees `#` as tool reference separator
- `` `#0A0014` `` - Backticks don't prevent parsing
- `0A0014` without prefix - Could be ambiguous

## Automation

### Manual Format Check

```bash
cd mcp-server
npm run format:hex
```

### Automated Script

The `format-hex-codes.js` script automatically:

1. Detects all hex patterns: `#RRGGBB`, `` `#RRGGBB` ``
2. Converts to safe format: `hex RRGGBB`
3. Validates no issues remain
4. Updates file in-place

### Usage Examples

```bash
# Format copilot instructions
node .github/scripts/format-hex-codes.js .github/copilot-instructions.md

# Format any markdown file
node .github/scripts/format-hex-codes.js docs/CATGIRL.md

# From mcp-server directory (npm script)
cd mcp-server && npm run format:hex
```

## Color Palette Reference

Current CyberNeonGothWave colors:

- **Background**: `hex 0A0014` (Deep Void) - RGB(10, 0, 20)
- **Primary**: `hex 00F0FF` (Cyber Cyan) - RGB(0, 240, 255)
- **Accent 1**: `hex FF006E` (Hot Pink) - RGB(255, 0, 110)
- **Accent 2**: `hex FF10F0` (Neon Purple) - RGB(255, 16, 240)
- **Success**: `hex 39FF14` (Electric Lime) - RGB(57, 255, 20)

## Adding New Colors

When documenting new hex codes:

1. Use format: `hex RRGGBB (Name)`
2. Never use `#RRGGBB` directly
3. Run `npm run format:hex` to validate
4. Commit changes

## Technical Details

### Why This Happens

Copilot's instruction parser uses `#` as a delimiter for tool references (similar to hashtags). The pattern `#[A-Z0-9]+` triggers tool validation, causing false positives on hex codes.

### Why "hex" Prefix Works

- Breaks the `#WORD` pattern
- Maintains semantic meaning (clearly indicates hex color)
- Human-readable and documented
- No special characters to escape

## Files

- **Script**: `.github/scripts/format-hex-codes.js`
- **Docs**: `.github/scripts/README.md`
- **Target**: `.github/copilot-instructions.md`
- **NPM Command**: `mcp-server/package.json` → `format:hex`
