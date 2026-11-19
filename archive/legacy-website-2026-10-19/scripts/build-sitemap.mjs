import { writeFile } from "node:fs/promises";

import {
  defaultLanguage,
  publicPages,
  sourceDir,
  supportedLanguages
} from "./site-config.mjs";

const baseUrl = "https://djconnect.dev";
const lastmod = "2026-07-01";

const pagePath = (page) => (page === "index" ? "" : page);

const localizedUrl = (page, language) => {
  const prefix = language === defaultLanguage ? "" : `/${language}`;
  const suffix = pagePath(page);
  return `${baseUrl}${prefix}${suffix ? `/${suffix}` : "/"}`;
};

const urls = publicPages
  .filter((page) => page !== "404")
  .flatMap((page) => supportedLanguages.map((language) => localizedUrl(page, language)));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>
`;

await writeFile(`${sourceDir}/sitemap.xml`, sitemap);
console.log(`Wrote ${urls.length} localized sitemap URLs to ${sourceDir}/sitemap.xml`);
