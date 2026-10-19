import { isAllowedGithubDownload, sanitizeToken, trackedRedirect } from "../_shared/analytics.js";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const destination = url.searchParams.get("url") || "";
  const repo = url.searchParams.get("repo") || "";
  const target = sanitizeToken(url.searchParams.get("target") || repo || "download");

  if (!isAllowedGithubDownload(destination, repo)) {
    return new Response("Unsupported download target", { status: 400 });
  }

  return trackedRedirect(context, target, destination);
}
