import { cpSync, mkdirSync, readdirSync } from "fs";
import { join, resolve, relative } from "path";
import { homedir } from "os";

const PLUGIN_NAME = "proton-pass-cli";
const rootDir = resolve(import.meta.dirname);
const sourceDir = join(rootDir, "plugins", PLUGIN_NAME);
const targetDir = join(homedir(), ".claude", "plugins", PLUGIN_NAME);

console.log(`Building ${PLUGIN_NAME} plugin...\n`);

// Copy entire plugin directory to ~/.claude/plugins/
cpSync(sourceDir, targetDir, { recursive: true });

// Print result
console.log(`Installed to ${targetDir}\n`);
function listFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full);
    else console.log(`  ${relative(targetDir, full)}`);
  }
}
listFiles(targetDir);
console.log("\nRestart Claude Code or run /reload-plugins to pick up changes.");
