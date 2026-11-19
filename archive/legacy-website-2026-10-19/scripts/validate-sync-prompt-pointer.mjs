import { readFile } from "node:fs/promises";

const pointerPath = process.argv[2] ?? "SYNC_PROMPTS.md";

function fail(message) {
  process.stderr.write(`Invalid SYNC_PROMPTS.md pointer: ${message}\n`);
  process.exitCode = 1;
}

try {
  const content = await readFile(pointerPath, "utf8");
  const lines = content.trim().split(/\r?\n/);
  const required = [
    /^# .*Pointer|^# .*Navigation/i,
    /pcvantol\/djconnect/,
    /SYNC_PROMPTS\.md/,
    /PRODUCT_ROADMAP\.md/,
    /Do not fork .*cross-repo contracts locally/i
  ];
  const copiedContent = [
    /SOFTWARE ASSURANCE IMPLEMENTATION PROMPT/i,
    /^## Mission$/im,
    /^## Architecture$/im,
    /^## Implementation$/im
  ];

  if (lines.length > 40 || content.length > 3000) fail("pointer must remain concise.");
  for (const expression of required) {
    if (!expression.test(content)) fail(`missing required pointer statement (${expression}).`);
  }
  for (const expression of copiedContent) {
    if (expression.test(content)) fail("copied canonical prompt or architecture content is not allowed.");
  }
} catch (error) {
  fail(error.code === "ENOENT" ? "pointer file is missing." : error.message);
}
