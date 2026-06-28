import test from "node:test";
import assert from "node:assert/strict";

import {
  releaseOutputDir,
  sharedReleaseAssets,
  sourceDir
} from "../scripts/site-config.mjs";
import { publicPages, read } from "./helpers/site.mjs";

test("site config centralizes release build inputs", async () => {
  const [buildScript, packageJson] = await Promise.all([
    read("scripts/build-release.mjs"),
    read("package.json")
  ]);

  assert.equal(sourceDir, "wwwroot");
  assert.equal(releaseOutputDir, "dist/wwwroot");
  assert.ok(sharedReleaseAssets.includes("assets/site-nav.css"));
  assert.ok(sharedReleaseAssets.includes("assets/site-nav.js"));
  assert.ok(sharedReleaseAssets.includes("assets/downloads.js"));
  assert.ok(sharedReleaseAssets.includes("assets/voice-intents.js"));
  assert.match(buildScript, /from "\.\/site-config\.mjs"/);
  assert.match(buildScript, /readSiteVersion/);
  assert.match(JSON.parse(packageJson).scripts["build:release"], /scripts\/build-release\.mjs/);
});

test("public page registry covers every static HTML page", async () => {
  const pageList = [...publicPages].sort();
  const sitemap = await read("wwwroot/sitemap.xml");

  assert.deepEqual(pageList, [
    "404",
    "blog",
    "blog-djconnect-project",
    "embedded",
    "features",
    "index",
    "ios",
    "maccatalyst",
    "macos",
    "platform",
    "privacy",
    "raspberry-pi",
    "start",
    "support",
    "testflight",
    "testflight-macos",
    "troubleshooting",
    "voice-assistant",
    "voice-commands",
    "windows"
  ].sort());

  for (const page of publicPages.filter((name) => name !== "404")) {
    const route = page === "index" ? "https://djconnect.dev/" : `https://djconnect.dev/${page}`;
    assert.match(sitemap, new RegExp(route.replaceAll(".", "\\.")));
  }
});
