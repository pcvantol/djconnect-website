const OWNER = "pcvantol";

export const ALLOWED_RELEASE_REPOS = new Set([
  "djconnect-app-releases",
  "djconnect-firmware",
  "djconnect-pi-releases"
]);

export const REDIRECT_TARGETS = {
  hacs: "https://my.home-assistant.io/redirect/hacs_repository/?owner=pcvantol&repository=djconnect&category=integration",
  "github-app-releases": "https://github.com/pcvantol/djconnect-app-releases/releases",
  "github-firmware-releases": "https://github.com/pcvantol/djconnect-firmware/releases",
  "github-linux-releases": "https://github.com/pcvantol/djconnect-pi-releases/releases"
};

export const sanitizeToken = (value, fallback = "unknown") => {
  const cleaned = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || fallback;
};

export const githubHeaders = (env = {}) => {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "djconnect-website"
  };
  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }
  return headers;
};

export const recordClick = async (env, target, source = "website") => {
  if (!env?.ANALYTICS_DB) return;

  const day = new Date().toISOString().slice(0, 10);
  await env.ANALYTICS_DB.prepare(`
    INSERT INTO click_counters (day, target, source, count, updated_at)
    VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(day, target, source)
    DO UPDATE SET count = count + 1, updated_at = CURRENT_TIMESTAMP
  `).bind(day, sanitizeToken(target), sanitizeToken(source)).run();
};

export const trackedRedirect = (context, target, destination, status = 302) => {
  context.waitUntil(recordClick(context.env, target).catch(() => undefined));
  return Response.redirect(destination, status);
};

export const isAllowedGithubDownload = (destination, repo) => {
  if (!ALLOWED_RELEASE_REPOS.has(repo)) return false;

  let url;
  try {
    url = new URL(destination);
  } catch {
    return false;
  }

  const releasesPrefix = `/${OWNER}/${repo}/releases/`;
  return url.protocol === "https:" && url.hostname === "github.com" && url.pathname.startsWith(releasesPrefix);
};

export const fetchLatestRelease = async (env, repo) => {
  if (!ALLOWED_RELEASE_REPOS.has(repo)) {
    throw new Error(`Unsupported release repo: ${repo}`);
  }

  const response = await fetch(`https://api.github.com/repos/${OWNER}/${repo}/releases/latest`, {
    headers: githubHeaders(env)
  });
  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}`);
  }
  return response.json();
};

export const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body, null, 2), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  }
});
