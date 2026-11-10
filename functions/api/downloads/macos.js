import { githubHeaders, jsonResponse } from "../../_shared/analytics.js";

const repository = "pcvantol/djconnect-app-releases";
const releaseTag = /^macos\/v(\d+\.\d+\.\d+(?:-[\da-z]+(?:[.-][\da-z]+)*)?)$/i;
const pageSize = 100;

export async function onRequestGet({ env }) {
  try {
    for (let page = 1; ; page++) {
      const response = await fetch(
        `https://api.github.com/repos/${repository}/releases?per_page=${pageSize}&page=${page}`,
        { headers: githubHeaders(env), signal: AbortSignal.timeout(5000) }
      );
      if (!response.ok) break;

      const releases = await response.json();
      for (const release of releases) {
        const version = releaseTag.exec(release.tag_name)?.[1];
        if (release.draft || !version) continue;

        const prefix = `DJConnect-macOS-${version}`;
        for (const asset of release.assets ?? []) {
          if (![`${prefix}.zip`, `${prefix}.dmg`, `${prefix}-unsigned.zip`].includes(asset.name)) continue;

          const downloadUrl = `https://github.com/${repository}/releases/download/${release.tag_name}/${asset.name}`;
          if (asset.state !== "uploaded" || asset.browser_download_url !== downloadUrl) continue;

          return jsonResponse({
            version,
            prerelease: release.prerelease === true,
            unsigned: asset.name.endsWith("-unsigned.zip"),
            downloadUrl
          });
        }
      }

      if (releases.length < pageSize) return jsonResponse({ error: "release_unavailable" }, 404);
    }
  } catch {
    // Keep upstream response bodies and details out of this public endpoint.
  }
  return jsonResponse({ error: "release_unavailable" }, 502);
}
