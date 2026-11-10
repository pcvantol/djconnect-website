import assert from "node:assert/strict";
import test from "node:test";
import { onRequestGet } from "../functions/api/downloads/macos.js";

const release = (version, { platform = "macos", draft = false, prerelease = true, unsigned = true } = {}) => {
  const tag = `${platform}/v${version}`;
  const name = `DJConnect-macOS-${version}${unsigned ? "-unsigned" : ""}.zip`;
  const downloadUrl = `https://github.com/pcvantol/djconnect-app-releases/releases/download/${tag}/${name}`;
  return {
    tag_name: tag, draft, prerelease,
    assets: [{ state: "uploaded", name, browser_download_url: downloadUrl }]
  };
};

test("the newest eligible macOS binary is resolved across mixed release pages", async t => {
  const draft = release("5.0.0", { draft: true });
  const external = release("4.9.0");
  external.assets[0].browser_download_url = "https://example.org/unsigned.zip";
  const missing = release("4.8.0");
  missing.assets[0].state = "new";
  const newest = release("4.1.0");
  const firstPage = [release("6.0.0", { platform: "ios" }), draft, external, missing,
    ...Array.from({ length: 96 }, () => ({ tag_name: "internal-ha-build", assets: [] }))];
  const request = t.mock.method(globalThis, "fetch", async url => Response.json(
    url.endsWith("page=1") ? firstPage : [newest, release("4.0.0")]
  ));

  const response = await onRequestGet({ env: {} });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {
    version: "4.1.0", prerelease: true, unsigned: true, downloadUrl: newest.assets[0].browser_download_url
  });
  assert.equal(request.mock.callCount(), 2);
  assert.match(request.mock.calls[1].arguments[0], /^https:\/\/api\.github\.com\/repos\/pcvantol\/djconnect-app-releases\/releases\?per_page=100&page=2$/);
});

test("a signed stable release replaces the unsigned preview", async t => {
  const current = release("4.2.0", { prerelease: false, unsigned: false });
  t.mock.method(globalThis, "fetch", async () => Response.json([current, release("4.1.0")]));
  assert.deepEqual(await (await onRequestGet({ env: {} })).json(), {
    version: "4.2.0", prerelease: false, unsigned: false, downloadUrl: current.assets[0].browser_download_url
  });
});

test("unavailable releases and upstream errors expose no upstream details", async t => {
  const request = t.mock.method(globalThis, "fetch", async () => Response.json([]));
  assert.equal((await onRequestGet({ env: {} })).status, 404);
  request.mock.mockImplementation(async () => new Response("upstream details", { status: 403 }));
  const response = await onRequestGet({ env: {} });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "release_unavailable" });
});
