import { ALLOWED_RELEASE_REPOS, githubHeaders } from "./_shared/analytics.js";

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const formatBytes = (bytes) => {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} KB`;
  return `${Math.round(value / 1024 / 102.4) / 10} MB`;
};

const fetchReleaseStats = async (env, repo) => {
  const response = await fetch(`https://api.github.com/repos/pcvantol/${repo}/releases?per_page=30`, {
    headers: githubHeaders(env)
  });

  if (!response.ok) {
    return {
      repo,
      ok: false,
      status: response.status,
      releases: [],
      totalDownloads: 0,
      assetCount: 0
    };
  }

  const releases = await response.json();
  const normalizedReleases = releases.map((release) => {
    const assets = (release.assets || []).map((asset) => ({
      name: asset.name,
      size: Number(asset.size || 0),
      downloads: Number(asset.download_count || 0),
      updatedAt: asset.updated_at,
      url: asset.browser_download_url
    }));

    return {
      name: release.name || release.tag_name,
      tag: release.tag_name,
      publishedAt: release.published_at,
      url: release.html_url,
      downloads: assets.reduce((total, asset) => total + asset.downloads, 0),
      assets
    };
  });

  return {
    repo,
    ok: true,
    releases: normalizedReleases,
    latest: normalizedReleases[0],
    totalDownloads: normalizedReleases.reduce((total, release) => total + release.downloads, 0),
    assetCount: normalizedReleases.reduce((total, release) => total + release.assets.length, 0)
  };
};

const renderAssets = (assets) => {
  if (!assets?.length) {
    return `<p class="muted">Geen downloadbare assets in de laatste release.</p>`;
  }

  return `
    <div class="asset-list">
      ${assets.map((asset) => `
        <div class="asset-row">
          <div>
            <strong>${escapeHtml(asset.name)}</strong>
            <span>${formatBytes(asset.size)} · bijgewerkt ${escapeHtml(asset.updatedAt || "-")}</span>
          </div>
          <div class="metric">${asset.downloads}</div>
        </div>
      `).join("")}
    </div>
  `;
};

const renderRepoCard = (stat) => {
  if (!stat.ok) {
    return `
      <article class="card error">
        <div class="card-head">
          <h2>${escapeHtml(stat.repo)}</h2>
          <span>GitHub ${stat.status}</span>
        </div>
        <p class="muted">GitHub release-statistieken konden nu niet worden opgehaald.</p>
      </article>
    `;
  }

  const latest = stat.latest;
  return `
    <article class="card">
      <div class="card-head">
        <h2>${escapeHtml(stat.repo)}</h2>
        <span>${stat.releases.length} releases · ${stat.assetCount} assets</span>
      </div>
      <div class="summary">
        <div><strong>${stat.totalDownloads}</strong><span>GitHub downloads totaal</span></div>
        <div><strong>${latest ? latest.downloads : 0}</strong><span>laatste release</span></div>
      </div>
      ${latest ? `
        <h3><a href="${escapeHtml(latest.url)}" target="_blank" rel="noopener">${escapeHtml(latest.name)}</a></h3>
        <p class="muted">${escapeHtml(latest.tag)} · gepubliceerd ${escapeHtml(latest.publishedAt || "-")}</p>
        ${renderAssets(latest.assets)}
      ` : `<p class="muted">Nog geen releases gevonden.</p>`}
    </article>
  `;
};

const renderPage = (stats) => {
  const generatedAt = new Date().toISOString();
  const totalDownloads = stats.reduce((total, stat) => total + Number(stat.totalDownloads || 0), 0);

  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>DJConnect Admin · Download stats</title>
  <style>
    :root { --bg:#0b0d12; --panel:rgba(255,255,255,0.08); --text:#f7f7fb; --muted:#b7bccb; --line:rgba(255,255,255,0.14); --cyan:#66e0ff; --green:#7ef7a7; --red:#fb7185; }
    * { box-sizing:border-box; }
    body { margin:0; color:var(--text); font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height:1.5; background:radial-gradient(circle at 15% 8%, rgba(102,224,255,0.18), transparent 28rem), radial-gradient(circle at 85% 0%, rgba(126,247,167,0.12), transparent 28rem), var(--bg); }
    main { width:min(1120px, calc(100% - 32px)); margin:0 auto; padding:48px 0; }
    h1,h2,h3,p { margin:0; }
    h1 { font-size:clamp(2.4rem, 5vw, 4.6rem); line-height:0.98; letter-spacing:-0.05em; }
    h2 { font-size:1.25rem; letter-spacing:-0.03em; }
    h3 { margin-top:24px; font-size:1rem; }
    a { color:inherit; }
    .lead { margin-top:18px; max-width:760px; color:var(--muted); font-size:1.08rem; }
    .top { display:grid; grid-template-columns:1fr auto; gap:24px; align-items:end; margin-bottom:28px; }
    .total { border:1px solid var(--line); border-radius:22px; background:linear-gradient(135deg, rgba(102,224,255,0.15), rgba(126,247,167,0.12)); padding:20px; min-width:220px; }
    .total strong { display:block; font-size:2.4rem; line-height:1; }
    .total span, .muted { color:var(--muted); }
    .notice { border:1px solid var(--line); border-radius:18px; background:rgba(255,255,255,0.06); color:var(--muted); padding:16px; margin-bottom:18px; }
    .grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; }
    .card { border:1px solid var(--line); border-radius:24px; background:var(--panel); padding:20px; box-shadow:0 18px 46px rgba(0,0,0,0.22); }
    .card.error { border-color:rgba(251,113,133,0.35); }
    .card-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:18px; }
    .card-head span { color:var(--muted); font-size:0.9rem; text-align:right; }
    .summary { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .summary div { border:1px solid var(--line); border-radius:18px; padding:14px; background:rgba(255,255,255,0.05); }
    .summary strong { display:block; font-size:1.75rem; line-height:1; color:var(--green); }
    .summary span { display:block; margin-top:6px; color:var(--muted); font-size:0.85rem; }
    .asset-list { display:grid; gap:10px; margin-top:14px; }
    .asset-row { display:grid; grid-template-columns:1fr auto; gap:14px; align-items:center; border:1px solid var(--line); border-radius:16px; padding:12px; background:rgba(255,255,255,0.05); }
    .asset-row span { display:block; color:var(--muted); font-size:0.86rem; margin-top:3px; }
    .metric { min-width:58px; min-height:42px; display:grid; place-items:center; border-radius:14px; background:linear-gradient(135deg,var(--cyan),var(--green)); color:#06110c; font-weight:950; }
    footer { margin-top:22px; color:var(--muted); font-size:0.86rem; }
    @media (max-width:900px) { .top { grid-template-columns:1fr; } .grid { grid-template-columns:1fr; } .total { min-width:0; } }
  </style>
</head>
<body>
  <main>
    <div class="top">
      <div>
        <h1>Download statistieken</h1>
        <p class="lead">Runtime opgehaald uit de GitHub API. Deze tijdelijke adminpagina gebruikt nog geen database persistence en telt nog geen website-redirect clicks mee.</p>
      </div>
      <div class="total"><strong>${totalDownloads}</strong><span>GitHub asset downloads totaal</span></div>
    </div>
    <div class="notice">Afgeschermd via Cloudflare Access. Beheer toegang in Cloudflare Zero Trust, niet in deze repository.</div>
    <section class="grid">
      ${stats.map(renderRepoCard).join("")}
    </section>
    <footer>Gegenereerd op ${escapeHtml(generatedAt)} · bron: GitHub release asset <code>download_count</code></footer>
  </main>
</body>
</html>`;
};

export async function onRequestGet({ request, env }) {
  const stats = await Promise.all([...ALLOWED_RELEASE_REPOS].map((repo) => fetchReleaseStats(env, repo)));
  return new Response(renderPage(stats), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow"
    }
  });
}
