import { access, readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

import {
  defaultLanguage,
  publicPages,
  sourceDir,
  supportedLanguages
} from "./site-config.mjs";

const read = (relativePath) => readFile(path.join(sourceDir, relativePath), "utf8");

const extractDataKeys = (html) => {
  const keys = new Set();
  for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) keys.add(match[1]);
  for (const match of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const mapping of match[1].split(",")) {
      const [, key] = mapping.split(":").map((part) => part.trim());
      if (key) keys.add(key);
    }
  }
  return [...keys].sort();
};

const extractTranslations = (html, page) => {
  const match = html.match(/const translations = (\{[\s\S]*?\n\s*\});/);
  if (!match) throw new Error(`${page}: missing const translations block`);
  const context = vm.createContext({});
  return vm.runInContext(`(${match[1]})`, context, { timeout: 1000 });
};

const routeFor = (page, language) => {
  const pagePath = page === "index" ? "" : `${page}.html`;
  const prefix = language === defaultLanguage ? "" : `${language}/`;
  return `${prefix}${pagePath}`;
};

const sitemapUrlFor = (page, language) => {
  const pagePath = page === "index" ? "" : page;
  const prefix = language === defaultLanguage ? "" : `${language}/`;
  return `https://djconnect.dev/${prefix}${pagePath}`;
};

const assertLocalizedRoute = async (page, language) => {
  if (language === defaultLanguage) return;
  const route = routeFor(page, language);
  await access(path.join(sourceDir, route));
};

const validatePage = async (page) => {
  const file = `${page}.html`;
  const html = await read(file);
  const translations = extractTranslations(html, file);
  const dataKeys = extractDataKeys(html);
  const expectedKeys = ["title", "metaDescription", ...dataKeys].sort();

  for (const language of supportedLanguages) {
    if (!translations[language]) throw new Error(`${file}: missing ${language} translations`);
    const keys = Object.keys(translations[language]).sort();
    const missing = expectedKeys.filter((key) => !keys.includes(key));
    if (missing.length) throw new Error(`${file}: ${language} missing keys: ${missing.join(", ")}`);
    if (!html.includes(`hreflang="${language}"`)) throw new Error(`${file}: missing hreflang ${language}`);
    if (!html.includes(`data-lang="${language}"`)) throw new Error(`${file}: missing language switcher ${language}`);
    await assertLocalizedRoute(page, language);
  }

  if (!html.includes('hreflang="x-default"')) throw new Error(`${file}: missing x-default hreflang`);
};

await Promise.all([
  access(path.join(sourceDir, "assets/i18n.js")),
  ...publicPages.map(validatePage)
]);

const sitemap = await read("sitemap.xml");
for (const page of publicPages.filter((name) => name !== "404")) {
  for (const language of supportedLanguages) {
    const url = sitemapUrlFor(page, language);
    if (!sitemap.includes(`<loc>${url}</loc>`)) {
      throw new Error(`sitemap.xml missing localized route: ${url}`);
    }
  }
}

console.log(`Validated ${publicPages.length} public pages for ${supportedLanguages.join(", ")} i18n coverage.`);
