#!/usr/bin/env node
/**
 * Bumps the app version in lockstep across:
 *   - package.json
 *   - src-tauri/Cargo.toml
 *   - src-tauri/tauri.conf.json
 *
 * Usage:
 *   bun run version patch        # 0.1.0 -> 0.1.1
 *   bun run version minor        # 0.1.0 -> 0.2.0
 *   bun run version major        # 0.1.0 -> 1.0.0
 *   bun run version 1.2.3        # explicit
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

const arg = process.argv[2];
if (!arg) {
    console.error("usage: bump-version <patch|minor|major|x.y.z>");
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
