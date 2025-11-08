#!/usr/bin/env node
/**
 * 🎨 Hex Code Formatter for Copilot Instructions
 *
 * This script automatically formats hex color codes in markdown files
 * to prevent Copilot's instruction parser from misinterpreting them
 * as tool or toolset references.
 *
 * Usage:
 *   node .github/scripts/format-hex-codes.js <file>
 *
 * Example:
 *   node .github/scripts/format-hex-codes.js .github/copilot-instructions.md
 */

const fs = require("fs");
const path = require("path");

/**
 * Format hex codes to prevent parser warnings
 * Converts: #0A0014 → hex 0A0014
 * Converts: `#0A0014` → hex 0A0014
 */
function formatHexCodes(content) {
  // Pattern 1: Backtick-wrapped hex codes with #
  content = content.replace(/`#([0-9A-Fa-f]{6})`/g, "hex $1");

  // Pattern 2: Standalone hex codes with #
  content = content.replace(/#([0-9A-Fa-f]{6})\b/g, "hex $1");

  // Pattern 3: Already formatted but check consistency
  content = content.replace(/\bhex\s+([0-9A-Fa-f]{6})\b/g, "hex $1");

  return content;
}

/**
 * Validate hex code formatting in content
 */
function validateHexCodes(content) {
  const problematicPatterns = [
    /#([0-9A-Fa-f]{6})/g, // Unescaped hex codes
    /`#([0-9A-Fa-f]{6})`/g, // Backtick-wrapped hex codes
  ];

  const issues = [];

  problematicPatterns.forEach((pattern, idx) => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      issues.push({
        type: idx === 0 ? "unescaped" : "backtick-wrapped",
        code: match[1],
        position: match.index,
      });
    }
  });

  return issues;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: node format-hex-codes.js <file>");
    console.error(
      "Example: node format-hex-codes.js .github/copilot-instructions.md"
    );
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`🎨 Processing: ${filePath}`);

  // Read file
  const originalContent = fs.readFileSync(filePath, "utf8");

  // Validate before formatting
  const issuesBefore = validateHexCodes(originalContent);
  if (issuesBefore.length === 0) {
    console.log("✅ No hex code formatting issues found!");
    return;
  }

  console.log(
    `⚠️  Found ${issuesBefore.length} hex code(s) needing formatting:`
  );
  issuesBefore.forEach((issue) => {
    console.log(`   - ${issue.type}: ${issue.code}`);
  });

  // Format hex codes
  const formattedContent = formatHexCodes(originalContent);

  // Validate after formatting
  const issuesAfter = validateHexCodes(formattedContent);

  if (issuesAfter.length === 0) {
    // Write back to file
    fs.writeFileSync(filePath, formattedContent, "utf8");
    console.log(`✅ Successfully formatted ${issuesBefore.length} hex code(s)`);
    console.log(`📝 File updated: ${filePath}`);
  } else {
    console.error(`❌ Formatting failed - ${issuesAfter.length} issues remain`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { formatHexCodes, validateHexCodes };
