import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDir = path.resolve("wwwroot");
const outputDir = path.resolve("dist/wwwroot");

const sharedAssets = [
  "assets/site-nav.css",
  "assets/site-nav.js",
  "assets/downloads.css",
  "assets/downloads.js",
  "assets/releases.css",
  "assets/releases.js",
  "assets/voice-intents.js"
];

const stripJsComments = (input) => {
  let output = "";
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1] || "";

    if (lineComment) {
      if (char === "\n") {
        lineComment = false;
        output += "\n";
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      output += char;
      continue;
    }

    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    output += char;
  }

  return output;
};

const minifyJs = (input) => stripJsComments(input)
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

const rewriteHtmlReferences = async (assetMap) => {
  const entries = await readdir(outputDir);

  await Promise.all(entries
    .filter((entry) => entry.endsWith(".html"))
    .map(async (entry) => {
      const file = path.join(outputDir, entry);
      let html = await readFile(file, "utf8");

      for (const [original, minified] of assetMap) {
        html = html.replaceAll(original, minified);
      }

      await writeFile(file, `${minifyHtml(html)}\n`);
    }));
};

const assertSharedAssetsExist = async () => {
  await Promise.all(sharedAssets.map(async (asset) => {
    const assetStat = await stat(path.join(sourceDir, asset));
    if (!assetStat.isFile()) throw new Error(`Missing release asset: ${asset}`);
  }));
};

await assertSharedAssetsExist();
await rm(outputDir, { recursive: true, force: true });
await mkdir(path.dirname(outputDir), { recursive: true });
await cp(sourceDir, outputDir, { recursive: true });

const generatedAssets = await Promise.all(sharedAssets.map(minifyAsset));
const assetMap = new Map(generatedAssets.map(({ original, minified }) => [original, minified]));
await rewriteHtmlReferences(assetMap);

console.log(`Built minified release site: ${path.relative(process.cwd(), outputDir)}`);
