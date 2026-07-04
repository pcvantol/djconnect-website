import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  releaseOutputDir,
  readSiteVersion,
  sharedReleaseAssets,
  sourceDir as configuredSourceDir
} from "./site-config.mjs";

const sourceDir = path.resolve(configuredSourceDir);
const outputDir = path.resolve(releaseOutputDir);
const stagingDir = path.resolve(`${releaseOutputDir}.tmp-${process.pid}`);
const lockDir = path.resolve(`${releaseOutputDir}.lock`);

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

const versionedAssetPattern = /(assets\/(?:i18n|page-translations|site-nav|downloads|releases|admin|voice-intents)\.(?:css|js))(?:\?v=\d+\.\d+\.\d+)?/gu;
const siteVersionPattern = /DJConnect website v\d+\.\d+\.\d+/gu;

const applySiteMetadata = (html, siteVersion) => html
  .replace(versionedAssetPattern, `$1?v=${siteVersion}`)
  .replace(siteVersionPattern, `DJConnect website v${siteVersion}`);

const rewriteHtmlReferences = async (assetMap, siteVersion) => {
  const rewriteInDirectory = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });

    await Promise.all(entries.map(async (entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await rewriteInDirectory(file);
        return;
      }
      if (!entry.name.endsWith(".html")) return;

      let html = await readFile(file, "utf8");

      for (const [original, minified] of assetMap) {
        html = html.replaceAll(original, minified);
      }

      html = applySiteMetadata(html, siteVersion);
      await writeFile(file, `${minifyHtml(html)}\n`);
    }));
  };

  await rewriteInDirectory(outputDir);
};

const assertSharedAssetsExist = async () => {
  await Promise.all(sharedReleaseAssets.map(async (asset) => {
    const assetStat = await stat(path.join(sourceDir, asset));
    if (!assetStat.isFile()) throw new Error(`Missing release asset: ${asset}`);
  }));
};

const acquireBuildLock = async () => {
  try {
    await mkdir(lockDir, { recursive: false });
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error(`Release build already running: ${path.relative(process.cwd(), lockDir)}`);
    }
    throw error;
  }
};

await acquireBuildLock();

try {
  await assertSharedAssetsExist();
  const siteVersion = await readSiteVersion();
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(path.dirname(outputDir), { recursive: true });
  await cp(sourceDir, stagingDir, { recursive: true });
  await rm(outputDir, { recursive: true, force: true });
  await rename(stagingDir, outputDir);

  const generatedAssets = await Promise.all(sharedReleaseAssets.map(minifyAsset));
  const assetMap = new Map(generatedAssets.map(({ original, minified }) => [original, minified]));
  await rewriteHtmlReferences(assetMap, siteVersion);

  console.log(`Built minified release site: ${path.relative(process.cwd(), outputDir)}`);
} finally {
  await rm(stagingDir, { recursive: true, force: true });
  await rm(lockDir, { recursive: true, force: true });
}
