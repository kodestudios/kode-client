#!/usr/bin/env node
/**
 * Bumps the app version in lockstep across:
 *   - package.json
 *   - src-tauri/Cargo.toml
 *   - src-tauri/tauri.conf.json
 *
 * Usage:
 *   bun run version patch         # 0.1.0 -> 0.1.1
 *   bun run version minor         # 0.1.0 -> 0.2.0
 *   bun run version major         # 0.1.0 -> 1.0.0
 *   bun run version 1.2.3         # explicit
 *   bun run version set 1.2.3     # explicit with a command
 *   bun run version --version 1.2.3
 *   bun run version:set 1.2.3     # explicit via package script alias
 *   bun run version:patch         # shortcut aliases also exist for minor/major
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const pkgPath = resolve(root, "package.json");
const cargoPath = resolve(root, "src-tauri/Cargo.toml");
const tauriConfPath = resolve(root, "src-tauri/tauri.conf.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const current = pkg.version;

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("usage: bump-version <patch|minor|major|x.y.z|set x.y.z|--version x.y.z>");
    process.exit(1);
}

function bump(version, kind) {
    const parts = version.split(".").map((n) => parseInt(n, 10));
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
        throw new Error(`invalid current version: ${version}`);
    }
    if (kind === "patch") return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
    if (kind === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
    if (kind === "major") return `${parts[0] + 1}.0.0`;
    throw new Error(`unknown bump: ${kind}`);
}

function explicitVersionFromArgs(args) {
    const [command, version] = args;
    if (command === "set" || command === "--version" || command === "-v") {
        if (!version) throw new Error(`${command} requires a version`);
        if (args.length > 2) throw new Error(`too many arguments: ${args.slice(2).join(" ")}`);
        return version;
    }
    if (args.length > 1) throw new Error(`too many arguments: ${args.slice(1).join(" ")}`);
    return command;
}

const arg = explicitVersionFromArgs(args);
const next = /^\d+\.\d+\.\d+$/.test(arg) ? arg : bump(current, arg);

// package.json
pkg.version = next;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n");

// Cargo.toml — touch only the [package] version, not deps.
const cargo = readFileSync(cargoPath, "utf8");
const cargoNext = cargo.replace(
    /^(\[package\][\s\S]*?\nversion = ")[^"]+(")/m,
    `$1${next}$2`
);
if (cargoNext === cargo) {
    throw new Error("failed to update Cargo.toml version");
}
writeFileSync(cargoPath, cargoNext);

// tauri.conf.json
const conf = JSON.parse(readFileSync(tauriConfPath, "utf8"));
conf.version = next;
writeFileSync(tauriConfPath, JSON.stringify(conf, null, 4) + "\n");

console.log(`bumped ${current} -> ${next}`);
console.log("next steps:");
console.log("  git add package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json");
console.log(`  git commit -m "chore: release v${next}"`);
console.log(`  git tag v${next}`);
console.log("  git push && git push --tags");
