const downloadCopy = {
  nl: {
    loading: "Downloads laden...",
    empty: "Er zijn nog geen binaries gepubliceerd in deze release-repo.",
    emptyPi: "Er zijn nog geen Linux builds gepubliceerd in deze release-repo.",
    emptyMac: "Er zijn nog geen macOS binaries gepubliceerd in deze release-repo.",
    failed: "Downloads konden niet live worden geladen. Open GitHub voor de nieuwste binaries.",
    download: "Download",
    noAssets: "Deze release heeft nog geen downloadbare assets.",
    github: "Open release op GitHub",
    changelog: "Changelog",
    noChangelog: "Geen changelogtekst gepubliceerd bij deze release.",
    installTitle: "DJConnect Pi app install",
    installText: "Installeer DJConnect Pi vanaf de publieke release-bundel. Gebruik dit nadat Raspberry Pi OS is voorbereid. Het script bewaart bestaande pairing/configuratie en kan later opnieuw worden uitgevoerd voor een handmatige update.",
    installLoading: "Install-commando laden...",
    installMissing: "Geen Raspberry Pi install-bundel gevonden in de nieuwste release.",
    copyCommand: "Kopieer install-commando",
    copiedCommand: "Gekopieerd"
  },
  en: {
    loading: "Loading downloads...",
    empty: "No binaries have been published in this release repo yet.",
    emptyPi: "No Linux builds have been published in this release repo yet.",
    emptyMac: "No macOS binaries have been published in this release repo yet.",
    failed: "Could not load downloads live. Open GitHub for the newest binaries.",
    download: "Download",
    noAssets: "This release does not have downloadable assets yet.",
    github: "Open release on GitHub",
    changelog: "Changelog",
    noChangelog: "No changelog text was published with this release.",
    installTitle: "DJConnect Pi app install",
    installText: "Install DJConnect Pi from the public release bundle. Use this after Raspberry Pi OS has been prepared. The script keeps existing pairing/configuration and can be run again later for a manual update.",
    installLoading: "Loading install command...",
    installMissing: "No Raspberry Pi install bundle found in the newest release.",
    copyCommand: "Copy install command",
    copiedCommand: "Copied"
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

const getReleases = async (owner, repo, limit) => {
  try {
    return await getDownloadJson(`/api/releases?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&limit=${limit}`);
  } catch (proxyError) {
    return getDownloadJson(`https://api.github.com/repos/${owner}/${repo}/releases`);
  }
};

const downloadTargetForRepo = (repo) => {
  if (repo === "djconnect-firmware") return "firmware";
  if (repo === "djconnect-pi-releases") return "linux";
  if (repo === "djconnect-app-releases") return "macos";
  return "download";
};

const trackedDownloadUrl = (repo, assetUrl, target = downloadTargetForRepo(repo)) => (
  `/go/download?repo=${encodeURIComponent(repo)}&target=${encodeURIComponent(target)}&url=${encodeURIComponent(assetUrl)}`
);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
}[char]));

const renderChangelog = (release, copy) => {
  const body = String(release.body || "").trim();
  if (!body) {
    return `
      <details class="release-changelog">
        <summary>${copy.changelog}</summary>
        <p>${copy.noChangelog}</p>
      </details>
    `;
  }

  return `
    <details class="release-changelog">
      <summary>${copy.changelog}</summary>
      <div class="release-changelog-body">${escapeHtml(body)}</div>
    </details>
  `;
};

const renderDownloads = async (root) => {
  const owner = root.dataset.githubOwner || "pcvantol";
  const repo = root.dataset.githubRepo || "djconnect-app-releases";
  const limit = Number(root.dataset.releaseLimit || 5);
  const language = document.documentElement.lang === "en" ? "en" : "nl";
  const copy = downloadCopy[language];
  const emptyCopy = repo === "djconnect-pi-releases" ? copy.emptyPi : repo === "djconnect-app-releases" ? copy.emptyMac : copy.empty;

  root.innerHTML = `<div class="download-status">${copy.loading}</div>`;

  try {
    let releases = await getReleases(owner, repo, limit);
    releases = releases.slice(0, limit);
    if (!releases.length) {
      root.innerHTML = `<div class="download-status">${emptyCopy} <a href="https://github.com/${owner}/${repo}/releases" target="_blank" rel="noopener">${copy.github}</a></div>`;
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
              <a class="asset-link" href="${trackedDownloadUrl(repo, asset.browser_download_url)}" rel="noopener">
                <span><strong>${asset.name}</strong><span>${formatBytes(asset.size)}${asset.download_count ? ` · ${asset.download_count} downloads` : ""}</span></span>
                <span class="download-cta">${copy.download}</span>
              </a>
            `).join("") : `<div class="download-status">${copy.noAssets}</div>`}
          </div>
          ${renderChangelog(release, copy)}
        </article>
      `;
    }).join("");
  } catch (error) {
    root.innerHTML = `<div class="download-status">${copy.failed} <a href="https://github.com/${owner}/${repo}/releases" target="_blank" rel="noopener">${copy.github}</a></div>`;
  }
};

const renderInstallCommand = async (root) => {
  const owner = root.dataset.githubOwner || "pcvantol";
  const repo = root.dataset.githubRepo || "djconnect-pi-releases";
  const language = document.documentElement.lang === "en" ? "en" : "nl";
  const copy = downloadCopy[language];

  root.innerHTML = `<div class="download-status">${copy.installLoading}</div>`;

  try {
    const releases = await getReleases(owner, repo, 1);
    const release = releases[0];
    const assets = release?.assets || [];
    const bundle = assets.find((asset) => /^djconnect-pi-[\d.]+\.tar\.gz$/.test(asset.name)) || assets.find((asset) => asset.name.endsWith(".tar.gz"));
    if (!release || !bundle) {
      root.innerHTML = `<div class="download-status">${copy.installMissing} <a href="https://github.com/${owner}/${repo}/releases" target="_blank" rel="noopener">${copy.github}</a></div>`;
      return;
    }

    const version = release.tag_name.replace(/^v/i, "");
    const command = [
      "mkdir -p ~/djconnect-install && \\",
      "cd ~/djconnect-install && \\",
      "rm -rf djconnect-pi-* djconnect-pi.tar.gz && \\",
      "curl -fsSL https://djconnect.dev/go/linux-install -o djconnect-pi.tar.gz && \\",
      "tar -xzf djconnect-pi.tar.gz && \\",
      `cd djconnect-pi-${version} && \\`,
      "sudo ./scripts/install.sh"
    ].join("\n");

    root.innerHTML = `
      <article class="install-card">
        <h3>${copy.installTitle}</h3>
        <p>${copy.installText}</p>
        <div class="install-command-wrap">
          <button class="copy-command" type="button" aria-label="${copy.copyCommand}" title="${copy.copyCommand}" data-copy-text="${escapeHtml(command)}" data-copy-label="${copy.copyCommand}" data-copied-label="${copy.copiedCommand}">
            <span aria-hidden="true">⧉</span>
          </button>
          <pre class="install-command"><code>${command}</code></pre>
        </div>
      </article>
    `;
  } catch (error) {
    root.innerHTML = `<div class="download-status">${copy.failed} <a href="https://github.com/${owner}/${repo}/releases" target="_blank" rel="noopener">${copy.github}</a></div>`;
  }
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-text]");
  if (!button) return;

  const label = button.dataset.copyLabel;
  const copiedLabel = button.dataset.copiedLabel;
  await copyText(button.dataset.copyText);
  button.setAttribute("aria-label", copiedLabel);
  button.setAttribute("title", copiedLabel);
  button.classList.add("is-copied");
  window.setTimeout(() => {
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.classList.remove("is-copied");
  }, 1500);
});

const renderDynamicDownloadBlocks = () => {
  document.querySelectorAll("[data-github-downloads]").forEach((root) => {
    renderDownloads(root);
  });

  document.querySelectorAll("[data-github-install]").forEach((root) => {
    renderInstallCommand(root);
  });
};

renderDynamicDownloadBlocks();

new MutationObserver((mutations) => {
  if (mutations.some((mutation) => mutation.attributeName === "lang")) {
    renderDynamicDownloadBlocks();
  }
}).observe(document.documentElement, { attributes: true });
