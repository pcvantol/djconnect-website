import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const extractDataKeys = (html) => {
  const keys = new Set();
  for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) {
    keys.add(match[1]);
  }
  for (const match of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const mapping of match[1].split(",")) {
      const [, key] = mapping.split(":").map((part) => part.trim());
      if (key) keys.add(key);
    }
  }
  return [...keys].sort();
};

const extractTranslationBlock = (html, language) => {
  const marker = `${language}: {`;
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, `Missing ${language} translation block`);

  let depth = 0;
  let blockStart = html.indexOf("{", start);
  for (let index = blockStart; index < html.length; index += 1) {
    const char = html[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return html.slice(blockStart, index + 1);
  }
  throw new Error(`Could not parse ${language} translation block`);
};

const assertTranslationsCoverPage = (html, pageName) => {
  const keys = extractDataKeys(html);
  assert.ok(keys.length > 0, `${pageName} should have translatable text keys`);

  for (const language of ["nl", "en"]) {
    const block = extractTranslationBlock(html, language);
    for (const key of ["title", "metaDescription", ...keys]) {
      assert.match(block, new RegExp(`${key}:`), `${pageName} ${language} missing ${key}`);
    }
  }
};

test("site version is consistent", async () => {
  const [version, packageJson, index, embedded] = await Promise.all([
    read("VERSION"),
    read("package.json"),
    read("wwwroot/index.html"),
    read("wwwroot/embedded.html")
  ]);

  const cleanVersion = version.trim();
  assert.equal(cleanVersion, "3.1.0");
  assert.equal(JSON.parse(packageJson).version, cleanVersion);
  assert.match(index, new RegExp(`DJConnect website v${cleanVersion}`));
  assert.match(embedded, new RegExp(`DJConnect website v${cleanVersion}`));
});

test("homepage has platform routes and app store placeholders", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /href="embedded\.html"/);
  assert.match(index, /data-store-link="macos"/);
  assert.match(index, /data-store-link="ios"/);
  assert.match(index, /Mac App Store/);
  assert.match(index, /App Store/);
});

test("embedded page links back to platform homepage", async () => {
  const embedded = await read("wwwroot/embedded.html");
  assert.match(embedded, /href="index\.html"/);
  assert.match(embedded, /DJConnect op ESP32|DJConnect on ESP32/);
});

test("all translation keys are present in Dutch and English", async () => {
  const [index, embedded] = await Promise.all([
    read("wwwroot/index.html"),
    read("wwwroot/embedded.html")
  ]);

  assertTranslationsCoverPage(index, "homepage");
  assertTranslationsCoverPage(embedded, "embedded");
});

test("copyright is shown in the requested form", async () => {
  const [index, embedded] = await Promise.all([
    read("wwwroot/index.html"),
    read("wwwroot/embedded.html")
  ]);
  assert.match(index, /Copyright Peter van Tol 2026/);
  assert.match(embedded, /Copyright Peter van Tol 2026/);
});
