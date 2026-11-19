import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { readSiteVersion, sourceDir } from "./site-config.mjs";

const versionedAssetPattern = /(assets\/(?:i18n|page-translations|site-nav|downloads|releases|admin|voice-intents)\.(?:css|js))\?v=\d+\.\d+\.\d+/gu;
const siteVersionPattern = /DJConnect website v\d+\.\d+\.\d+/gu;

const syncDirectory = async (directory, siteVersion) => {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return syncDirectory(file, siteVersion);
    if (!entry.name.endsWith(".html")) return;

    const original = await readFile(file, "utf8");
    const updated = original
      .replace(versionedAssetPattern, `$1?v=${siteVersion}`)
      .replace(siteVersionPattern, `DJConnect website v${siteVersion}`);
    if (updated !== original) await writeFile(file, updated);
  }));
};

const version = await readSiteVersion();
await syncDirectory(path.resolve(sourceDir), version);
