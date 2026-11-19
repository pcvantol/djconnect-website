import { access, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import vm from "node:vm";

import { publicPages } from "../../scripts/site-config.mjs";

export { publicPages };

export const webRoot = new URL("../../wwwroot/", import.meta.url);

const pageKeyFor = (path) => {
  const match = path.match(/^wwwroot\/(?:(?:en|de|fr|es)\/)?([^/]+)\.html$/);
  return match?.[1] || null;
};

let pageTranslationsCache;
export const readPageTranslations = async () => {
  if (pageTranslationsCache) return pageTranslationsCache;
  const source = await readFile(new URL("../../wwwroot/assets/page-translations.js", import.meta.url), "utf8");
  const context = vm.createContext({ window: {} });
  vm.runInContext(source, context, { timeout: 1000 });
  pageTranslationsCache = context.window.DJCONNECT_PAGE_TRANSLATIONS || {};
  return pageTranslationsCache;
};

export const read = async (path) => {
  const contents = await readFile(new URL(`../../${path}`, import.meta.url), "utf8");
  const pageKey = pageKeyFor(path);
  if (!pageKey) return contents;
  const pageTranslations = await readPageTranslations();
  if (!pageTranslations[pageKey]) return contents;
  const literal = JSON.stringify(pageTranslations[pageKey]).replace(/"([A-Za-z_$][\w$]*)":/g, "$1: ");
  return `${contents}\n<script>const translations = ${literal};</script>\n`;
};

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
  const markers = [`${language}: {`, `"${language}":{`, `"${language}": {`];
  const start = markers
    .map((marker) => html.indexOf(marker))
    .filter((index) => index !== -1)
    .sort((left, right) => left - right)[0] ?? -1;
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
      assert.match(block, new RegExp(`"?${key}"?\\s*:`), `${pageName} ${language} missing ${key}`);
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
