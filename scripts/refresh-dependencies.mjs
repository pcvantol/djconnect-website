import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

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
run("npx", ["wrangler@4", "--version"]);
run("npx", ["playwright", "--version"]);

if (!hasDeclaredDependencies) {
  console.log("No declared npm dependencies to update.");
  process.exit(0);
}

const lockPath = "package-lock.json";
const beforeLock = existsSync(lockPath) ? await readFile(lockPath, "utf8") : null;

const updateArgs = existsSync(lockPath) ? ["update", "--package-lock-only"] : ["update"];
run("npm", updateArgs);

if (mode === "check") {
  const afterLock = existsSync(lockPath) ? await readFile(lockPath, "utf8") : null;
  if (beforeLock !== afterLock) {
    if (beforeLock !== null) {
      await writeFile(lockPath, beforeLock);
    }
    console.error("package-lock.json would change after npm update. Run `npm run deps:update` and commit the result.");
    process.exit(1);
  }
  console.log("Dependency lockfile is up to date.");
}
