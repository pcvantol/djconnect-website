import { REDIRECT_TARGETS, fetchLatestRelease, trackedRedirect } from "../_shared/analytics.js";

const latestAssetTargets = {
  "linux-install": {
    repo: "djconnect-pi-releases",
    match: (asset) => /^djconnect-pi-[\d.]+\.tar\.gz$/.test(asset.name) || asset.name.endsWith(".tar.gz")
  }
};

export async function onRequestGet(context) {
  const target = Array.isArray(context.params.target) ? context.params.target[0] : context.params.target;

  if (latestAssetTargets[target]) {
    const config = latestAssetTargets[target];
    try {
      const release = await fetchLatestRelease(context.env, config.repo);
      const asset = (release.assets || []).find(config.match);
      if (!asset?.browser_download_url) {
        return new Response("No matching release asset found", { status: 404 });
      }
      return trackedRedirect(context, target, asset.browser_download_url);
    } catch (error) {
      return new Response("Could not resolve latest release asset", { status: 502 });
    }
  }

  const destination = REDIRECT_TARGETS[target];
  if (!destination) {
    return new Response("Unknown redirect target", { status: 404 });
  }

  return trackedRedirect(context, target, destination);
}
