import assert from "node:assert/strict";
import test from "node:test";
import { onRequestGet } from "../functions/api/downloads/macos.js";

const owner = "djconnect-music-dj/djconnect-app-releases";
const repository = { id: 1265963920, full_name: owner, private: false };
const release = (version, { platform = "macos", draft = false, prerelease = true, unsigned = false, publishedAt = "2026-11-09T10:00:00Z" } = {}) => {
  const tag = `${platform}/v${version}`;
  const name = `DJConnect-macOS-${version}${unsigned ? "-unsigned" : ""}.zip`;
  return {
    tag_name: tag, draft, prerelease, published_at: publishedAt,
    assets: [{
      state: "uploaded", name,
      browser_download_url: `https://github.com/${owner}/releases/download/${tag}/${name}`
    }]
  };
};

test("the latest publication date wins across unsorted release pages", async t => {
  const draft = release("5.0.0", { draft: true });
  const external = release("4.9.0");
  external.assets[0].browser_download_url = "https://example.org/download.zip";
  const missing = release("4.8.0");
  missing.assets[0].state = "new";
  const newest = release("4.1.0", { publishedAt: "2026-11-10T11:00:00Z" });
  const firstPage = [
    release("6.0.0", { platform: "ios" }), draft, external, missing,
    release("4.7.0", { unsigned: true }), release("4.0.0"),
    ...Array.from({ length: 94 }, () => ({ tag_name: "internal-ha-build", assets: [] }))
  ];
  const request = t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.endsWith("/repositories/1265963920")) return Response.json(repository);
    if (options.method === "HEAD") {
      assert.equal(url, newest.assets[0].browser_download_url);
      assert.equal(options.headers, undefined);
      return new Response();
    }
    return Response.json(url.endsWith("page=1") ? firstPage : [release("4.0.1"), newest, release("4.0.2")]);
  });

  const response = await onRequestGet({ env: { GITHUB_TOKEN: "test-token" } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {
    version: "4.1.0", prerelease: true, downloadUrl: newest.assets[0].browser_download_url
  });
  assert.equal(request.mock.callCount(), 4);
  assert.equal(request.mock.calls[2].arguments[0], `https://api.github.com/repos/${owner}/releases?per_page=100&page=2`);
});

test("an unexpected owner is rejected before checking releases", async t => {
  const request = t.mock.method(globalThis, "fetch", async () => Response.json({
    ...repository, full_name: "another-owner/djconnect-app-releases"
  }));
  assert.equal((await onRequestGet({ env: {} })).status, 404);
  assert.equal(request.mock.callCount(), 1);
});

test("unsigned and unreachable assets are not offered", async t => {
  const request = t.mock.method(globalThis, "fetch", async url =>
    Response.json(url.endsWith("/repositories/1265963920") ? repository : [release("4.0.0", { unsigned: true })])
  );
  assert.equal((await onRequestGet({ env: {} })).status, 404);
  assert.equal(request.mock.callCount(), 2);
  request.mock.mockImplementation(async (url, options) => {
    if (options.method === "HEAD") return new Response("upstream details", { status: 404 });
    return Response.json(url.endsWith("/repositories/1265963920") ? repository : [release("4.0.0")]);
  });
  const response = await onRequestGet({ env: {} });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "release_unavailable" });
});
