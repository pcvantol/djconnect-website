import { ALLOWED_RELEASE_REPOS, githubHeaders, jsonResponse, sanitizeToken } from "../_shared/analytics.js";

const requireToken = (request, env) => {
  if (!env.STATS_TOKEN) return false;
  const auth = request.headers.get("Authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const queryToken = new URL(request.url).searchParams.get("token") || "";
  return bearer === env.STATS_TOKEN || queryToken === env.STATS_TOKEN;
};

const getClickRows = async (request, env) => {
  if (!env.ANALYTICS_DB) return [];

  const url = new URL(request.url);
  const days = Math.max(1, Math.min(Number(url.searchParams.get("days") || 30), 365));
  const cutoff = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const result = await env.ANALYTICS_DB.prepare(`
    SELECT day, target, source, count
    FROM click_counters
    WHERE day >= ?
    ORDER BY day DESC, target ASC, source ASC
  `).bind(cutoff).all();

  return result.results || [];
};

const getGithubDownloads = async (env) => {
  const repos = [...ALLOWED_RELEASE_REPOS];
  const releases = await Promise.all(repos.map(async (repo) => {
    const response = await fetch(`https://api.github.com/repos/pcvantol/${repo}/releases?per_page=100`, {
      headers: githubHeaders(env)
    });
    if (!response.ok) {
      return { repo, ok: false, status: response.status, assets: [], totalDownloads: 0 };
    }

    const body = await response.json();
    const assets = body.flatMap((release) => (release.assets || []).map((asset) => ({
      repo,
      release: release.tag_name,
      asset: asset.name,
      downloads: Number(asset.download_count || 0),
      updatedAt: asset.updated_at,
      url: asset.browser_download_url
    })));

    return {
      repo,
      ok: true,
      totalDownloads: assets.reduce((total, asset) => total + asset.downloads, 0),
      assets
    };
  }));

  return releases;
};

const summarizeClicks = (rows) => {
  const totals = new Map();
  for (const row of rows) {
    const key = `${sanitizeToken(row.target)}:${sanitizeToken(row.source)}`;
    const existing = totals.get(key) || {
      target: row.target,
      source: row.source,
      count: 0
    };
    existing.count += Number(row.count || 0);
    totals.set(key, existing);
  }
  return [...totals.values()].sort((a, b) => b.count - a.count || a.target.localeCompare(b.target));
};

export async function onRequestGet({ request, env }) {
  if (!requireToken(request, env)) {
    return new Response("Not found", { status: 404 });
  }

  const [clicks, githubDownloads] = await Promise.all([
    getClickRows(request, env),
    getGithubDownloads(env)
  ]);

  return jsonResponse({
    privacy: "Aggregate counts only. No cookies, IP addresses, user agents or identifiers are stored.",
    redirectClicks: {
      totals: summarizeClicks(clicks),
      daily: clicks
    },
    githubDownloads
  });
}
