const releaseCopy = {
  nl: {
    loading: "Releases laden...",
    empty: "Er zijn nog geen releases gevonden.",
    failed: "Releases konden niet live worden geladen. Open GitHub voor de nieuwste versie.",
    open: "Open release op GitHub",
    prerelease: "Pre-release"
  },
  en: {
    loading: "Loading releases...",
    empty: "No releases found yet.",
    failed: "Could not load releases live. Open GitHub for the newest version.",
    open: "Open release on GitHub",
    prerelease: "Pre-release"
  }
};

const formatDate = (dateValue, language) => new Intl.DateTimeFormat(language === "nl" ? "nl-NL" : "en", {
  day: "numeric",
  month: "short",
  year: "numeric"
}).format(new Date(dateValue));

const stripMarkdown = (text = "") => text
  .replace(/```[\s\S]*?```/g, "")
  .replace(/`([^`]+)`/g, "$1")
  .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
  .replace(/[#>*_~]/g, "")
  .trim();

const getJson = (url) => {
  if (typeof fetch === "function") {
    return fetch(url, { headers: { "Accept": "application/vnd.github+json" } }).then((response) => {
      if (!response.ok) throw new Error(`GitHub releases returned ${response.status}`);
      return response.json();
    });
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.setRequestHeader("Accept", "application/vnd.github+json");
    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(`GitHub releases returned ${request.status}`));
        return;
      }
      resolve(JSON.parse(request.responseText));
    };
    request.onerror = () => reject(new Error("GitHub releases request failed"));
    request.send();
  });
};

const renderReleases = async (root) => {
  const owner = root.dataset.githubOwner || "pcvantol";
  const repo = root.dataset.githubRepo || "djconnect-website";
  const limit = Number(root.dataset.releaseLimit || 3);
  const language = document.documentElement.lang === "nl" ? "nl" : "en";
  const copy = releaseCopy[language];

  root.innerHTML = `<div class="release-status">${copy.loading}</div>`;

  try {
    let releaseData;
    try {
      releaseData = await getJson(`/api/releases?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&limit=${limit}`);
    } catch (proxyError) {
      releaseData = await getJson(`https://api.github.com/repos/${owner}/${repo}/releases`);
    }

    const releases = releaseData.slice(0, limit);
    if (!releases.length) {
      root.innerHTML = `<div class="release-status">${copy.empty}</div>`;
      return;
    }

    root.innerHTML = releases.map((release) => {
      const body = stripMarkdown(release.body || "").slice(0, 180);
      const date = release.published_at || release.created_at;
      const title = release.name || release.tag_name;
      return `
        <article class="release-card">
          <header>
            <div>
              <h3>${title}</h3>
              <span class="release-tag">${release.tag_name}${release.prerelease ? ` · ${copy.prerelease}` : ""}</span>
            </div>
            <time datetime="${date}">${formatDate(date, language)}</time>
          </header>
          ${body ? `<p>${body}${body.length === 180 ? "..." : ""}</p>` : ""}
          <a href="${release.html_url}" target="_blank" rel="noopener">${copy.open}</a>
        </article>
      `;
    }).join("");
  } catch (error) {
    root.innerHTML = `<div class="release-status">${copy.failed}</div>`;
  }
};

document.querySelectorAll("[data-github-releases]").forEach((root) => {
  renderReleases(root);
});
