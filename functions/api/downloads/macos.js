import { githubHeaders, jsonResponse } from "../../_shared/analytics.js";

const repository = "djconnect-music-dj/djconnect-app-releases";
const repositoryId = 1265963920;
const releaseTag = /^macos\/v(\d+\.\d+\.\d+(?:-[\da-z]+(?:[.-][\da-z]+)*)?)$/i;
const pageSize = 100;

export async function onRequestGet({ env }) {
  const signal = AbortSignal.timeout(5000);
  const options = { headers: githubHeaders(env), redirect: "manual", signal };

  try {
    const metadata = await fetch(`https://api.github.com/repositories/${repositoryId}`, options);
    if (!metadata.ok) return jsonResponse({ error: "release_unavailable" }, 502);
    const current = await metadata.json();
    if (current.id !== repositoryId || current.full_name !== repository || current.private !== false) {
      return jsonResponse({ error: "release_unavailable" }, 404);
    }

    for (let page = 1; ; page++) {
      const response = await fetch(
        `https://api.github.com/repos/${repository}/releases?per_page=${pageSize}&page=${page}`,
        options
      );
      if (!response.ok) break;

      const releases = await response.json();
      for (const release of releases) {
        const version = releaseTag.exec(release.tag_name)?.[1];
        if (release.draft || !version) continue;

        const name = `DJConnect-macOS-${version}.zip`;
        const downloadUrl = `https://github.com/${repository}/releases/download/${release.tag_name}/${name}`;
        const asset = release.assets?.find(item =>
          item.name === name && item.state === "uploaded" && item.browser_download_url === downloadUrl
        );
        if (!asset) continue;

        const download = await fetch(downloadUrl, { method: "HEAD", signal });
        if (!download.ok) return jsonResponse({ error: "release_unavailable" }, 502);

        return jsonResponse({ version, prerelease: release.prerelease === true, downloadUrl });
      }

      if (releases.length < pageSize) return jsonResponse({ error: "release_unavailable" }, 404);
    }
  } catch {
    // Keep upstream response bodies and details out of this public endpoint.
  }
  return jsonResponse({ error: "release_unavailable" }, 502);
}
