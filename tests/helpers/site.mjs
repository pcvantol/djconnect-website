import { access, readFile } from "node:fs/promises";
import assert from "node:assert/strict";

import { publicPages } from "../../scripts/site-config.mjs";

export { publicPages };

export const webRoot = new URL("../../wwwroot/", import.meta.url);

export const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

export const assertMissing = async (path) => {
  await assert.rejects(
    access(new URL(`../../${path}`, import.meta.url)),
    { code: "ENOENT" },
    `${path} must not exist in this repo`
  );
};

export const extractDataKeys = (html) => {
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

export const extractTranslationBlock = (html, language) => {
  const marker = `${language}: {`;
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, `Missing ${language} translation block`);

  let depth = 0;
  const blockStart = html.indexOf("{", start);
  for (let index = blockStart; index < html.length; index += 1) {
    const char = html[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return html.slice(blockStart, index + 1);
  }
  throw new Error(`Could not parse ${language} translation block`);
};

export const assertTranslationsCoverPage = (html, pageName) => {
  const keys = extractDataKeys(html);
  assert.ok(keys.length > 0, `${pageName} should have translatable text keys`);

  for (const language of ["nl", "en"]) {
    const block = extractTranslationBlock(html, language);
    for (const key of ["title", "metaDescription", ...keys]) {
      assert.match(block, new RegExp(`${key}:`), `${pageName} ${language} missing ${key}`);
    }
  }
};

export const extractRefs = (html) => {
  const refs = [];
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    refs.push(match[1]);
  }
  return refs;
};

const shouldSkipRef = (ref) => (
  !ref ||
  ref.startsWith("#") ||
  ref.startsWith("http://") ||
  ref.startsWith("https://") ||
  ref.startsWith("mailto:") ||
  ref.startsWith("tel:") ||
  ref.startsWith("/go/") ||
  ref.startsWith("/api/")
);

export const assertLocalRefExists = async (page, ref) => {
  if (shouldSkipRef(ref)) return;

  const cleanRef = ref.split("#")[0].split("?")[0];
  if (!cleanRef) return;

  const base = new URL(`../../wwwroot/${page}`, import.meta.url);
  const target = new URL(cleanRef, base);

  assert.ok(
    target.href.startsWith(webRoot.href),
    `${page} references local file outside wwwroot: ${ref}`
  );
  await access(target);
};
