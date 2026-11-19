import { fetchLatestRelease, isAllowedGithubDownload, trackedRedirect } from "../../_shared/analytics.js";

const downloads = new Map([
  ["esp32", { repo: "djconnect-firmware", filename: version => `djconnect-lilygo-t-embed-s3-v${version}.bin` }],
  ["pi5", { repo: "djconnect-pi-releases", filename: version => `djconnect-pi-pi5-arm64-${version}.tar.gz` }],
  ["pi-zero-2w", { repo: "djconnect-pi-releases", filename: version => `djconnect-pi-pi-zero-2w-arm64-${version}.tar.gz` }]
]);

export async function onRequestGet(context) {
  const { device } = context.params;
  const download = downloads.get(device);
  if (!download) return new Response("Unknown device", { status: 404 });

  try {
    const release = await fetchLatestRelease(context.env, download.repo);
    const version = /^v(\d+\.\d+\.\d+)$/.exec(release.tag_name)?.[1];
    const asset = version && release.assets?.find(item =>
      item.state === "uploaded" && item.name === download.filename(version)
    );
    if (!asset || !isAllowedGithubDownload(asset.browser_download_url, download.repo)) {
      return new Response("Download unavailable", { status: 404 });
    }
    return trackedRedirect(context, device, asset.browser_download_url);
  } catch {
    return new Response("Download unavailable", { status: 502 });
  }
}
