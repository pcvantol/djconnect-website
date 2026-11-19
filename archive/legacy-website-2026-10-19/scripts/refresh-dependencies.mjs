import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const mode = process.argv[2] || "update";
if (!["update", "check"].includes(mode)) {
  console.error("Usage: node scripts/refresh-dependencies.mjs [update|check]");
  process.exit(1);
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const hasDeclaredDependencies = ["dependencies", "devDependencies", "optionalDependencies"]
  .some((key) => packageJson[key] && Object.keys(packageJson[key]).length > 0);

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

console.log(`Dependency/tool refresh mode: ${mode}`);
run("npm", ["--version"]);

if (!hasDeclaredDependencies) {
  console.log("No declared npm dependencies to update.");
  process.exit(0);
}

if (mode === "check") {
  if (!existsSync("package-lock.json")) {
    console.error("package-lock.json is required. Run `npm install` and commit the lockfile.");
    process.exit(1);
  }
  // CI runs npm ci first, which verifies package.json against the committed lockfile.
  // A registry refresh here would make an unchanged commit fail when a new package is published.
  run("npm", ["ls", "--all"]);
  console.log("Installed dependency tree is valid.");
  process.exit(0);
}

run("npx", ["wrangler@4", "--version"]);
run("npx", ["playwright", "--version"]);
run("npm", existsSync("package-lock.json") ? ["update", "--package-lock-only"] : ["update"]);
