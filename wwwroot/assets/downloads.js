const downloadCopy = {
  nl: {
    loading: "Downloads laden...",
    empty: "Er zijn nog geen macOS binaries gepubliceerd in deze release-repo.",
    failed: "Downloads konden niet live worden geladen. Open GitHub voor de nieuwste binaries.",
    download: "Download",
    noAssets: "Deze release heeft nog geen downloadbare assets.",
    github: "Open release op GitHub"
  },
  en: {
    loading: "Loading downloads...",
    empty: "No macOS binaries have been published in this release repo yet.",
    failed: "Could not load downloads live. Open GitHub for the newest binaries.",
    download: "Download",
    noAssets: "This release does not have downloadable assets yet.",
    github: "Open release on GitHub"
  }
};

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
};

const formatDownloadDate = (dateValue, language) => new Intl.DateTimeFormat(language === "nl" ? "nl-NL" : "en", {
  day: "numeric",
  month: "short",
  year: "numeric"
}).format(new Date(dateValue));

const getDownloadJson = (url) => {
  if (typeof fetch === "function") {
    return fetch(url, { headers: { "Accept": "application/vnd.github+json" } }).then((response) => {
      if (!response.ok) throw new Error(`Downloads returned ${response.status}`);
      return response.json();
    });
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.setRequestHeader("Accept", "application/vnd.github+json");
    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(`Downloads returned ${request.status}`));
        return;
      }
      resolve(JSON.parse(request.responseText));
    };
    request.onerror = () => reject(new Error("Downloads request failed"));
    request.send();
  });
};

const renderDownloads = async (root) => {
  const owner = root.dataset.githubOwner || "pcvantol";
  const repo = root.dataset.githubRepo || "djconnect-app-releases";
  const limit = Number(root.dataset.releaseLimit || 5);
  const language = document.documentElement.lang === "en" ? "en" : "nl";
  const copy = downloadCopy[language];

  root.innerHTML = `<div class="download-status">${copy.loading}</div>`;

  try {
    let releases;
    try {
      releases = await getDownloadJson(`/api/releases?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&limit=${limit}`);
    } catch (proxyError) {
      releases = await getDownloadJson(`https://api.github.com/repos/${owner}/${repo}/releases`);
    }

    releases = releases.slice(0, limit);
    if (!releases.length) {
      root.innerHTML = `<div class="download-status">${copy.empty} <a href="https://github.com/${owner}/${repo}/releases" target="_blank" rel="noopener">${copy.github}</a></div>`;
      return;
    }

    root.innerHTML = releases.map((release) => {
      const date = release.published_at || release.created_at;
      const assets = release.assets || [];
      return `
        <article class="download-release">
          <header>
            <div>
              <h3>${release.name || release.tag_name}</h3>
              <span class="tag">${release.tag_name}</span>
            </div>
            <time datetime="${date}">${formatDownloadDate(date, language)}</time>
          </header>
          <div class="asset-list">
            ${assets.length ? assets.map((asset) => `
              <a class="asset-link" href="${asset.browser_download_url}" rel="noopener">
                <span><strong>${asset.name}</strong><span>${formatBytes(asset.size)}${asset.download_count ? ` · ${asset.download_count} downloads` : ""}</span></span>
                <span class="download-cta">${copy.download}</span>
              </a>
            `).join("") : `<div class="download-status">${copy.noAssets}</div>`}
          </div>
        </article>
      `;
    }).join("");
  } catch (error) {
    root.innerHTML = `<div class="download-status">${copy.failed} <a href="https://github.com/${owner}/${repo}/releases" target="_blank" rel="noopener">${copy.github}</a></div>`;
  }
};

document.querySelectorAll("[data-github-downloads]").forEach((root) => {
  renderDownloads(root);
});
