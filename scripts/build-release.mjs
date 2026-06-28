import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  releaseOutputDir,
  readSiteVersion,
  sharedReleaseAssets,
  sourceDir as configuredSourceDir
} from "./site-config.mjs";

const sourceDir = path.resolve(configuredSourceDir);
const outputDir = path.resolve(releaseOutputDir);

const minifyJs = (input) => input
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .join("\n");

const minifyCss = (input) => input
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>+~])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();

const minifyHtml = (input) => input
  .replace(/>\s+</g, "><")
  .replace(/\s{2,}/g, " ")
  .trim();

const minifyAsset = async (relativePath) => {
  const target = path.join(outputDir, relativePath);
  const source = await readFile(target, "utf8");
  const ext = path.extname(relativePath);
  const minified = ext === ".css" ? minifyCss(source) : minifyJs(source);
  const minPath = target.replace(/\.(css|js)$/u, ".min.$1");

  await writeFile(minPath, `${minified}\n`);
  return {
    original: relativePath,
    minified: relativePath.replace(/\.(css|js)$/u, ".min.$1")
  };
};

const versionedAssetPattern = /(assets\/(?:site-nav|downloads|releases|admin|voice-intents)\.(?:css|js))(?:\?v=\d+\.\d+\.\d+)?/gu;
const siteVersionPattern = /DJConnect website v\d+\.\d+\.\d+/gu;

const applySiteMetadata = (html, siteVersion) => html
  .replace(versionedAssetPattern, `$1?v=${siteVersion}`)
  .replace(siteVersionPattern, `DJConnect website v${siteVersion}`);

const rewriteHtmlReferences = async (assetMap, siteVersion) => {
  const entries = await readdir(outputDir);

  await Promise.all(entries
    .filter((entry) => entry.endsWith(".html"))
    .map(async (entry) => {
      const file = path.join(outputDir, entry);
      let html = await readFile(file, "utf8");

      for (const [original, minified] of assetMap) {
        html = html.replaceAll(original, minified);
      }

      html = applySiteMetadata(html, siteVersion);
      await writeFile(file, `${minifyHtml(html)}\n`);
    }));
};

const assertSharedAssetsExist = async () => {
  await Promise.all(sharedReleaseAssets.map(async (asset) => {
    const assetStat = await stat(path.join(sourceDir, asset));
    if (!assetStat.isFile()) throw new Error(`Missing release asset: ${asset}`);
  }));
};

await assertSharedAssetsExist();
const siteVersion = await readSiteVersion();
await rm(outputDir, { recursive: true, force: true });
await mkdir(path.dirname(outputDir), { recursive: true });
await cp(sourceDir, outputDir, { recursive: true });

const generatedAssets = await Promise.all(sharedReleaseAssets.map(minifyAsset));
const assetMap = new Map(generatedAssets.map(({ original, minified }) => [original, minified]));
await rewriteHtmlReferences(assetMap, siteVersion);

console.log(`Built minified release site: ${path.relative(process.cwd(), outputDir)}`);
