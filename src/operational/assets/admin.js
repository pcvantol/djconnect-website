const tokenInput = document.querySelector("#stats-token");
const daysInput = document.querySelector("#stats-days");
const loadButton = document.querySelector("#load-stats");
const statusEl = document.querySelector("#stats-status");
const metricClicks = document.querySelector("#metric-clicks");
const metricDownloads = document.querySelector("#metric-downloads");
const metricRows = document.querySelector("#metric-rows");
const clickTotalsEl = document.querySelector("#click-totals");
const dailyRowsEl = document.querySelector("#daily-rows");
const downloadGroupsEl = document.querySelector("#download-groups");
const registrationsForm = document.querySelector("#registrations-form");
const registrationClientTypeInput = document.querySelector("#registration-client-type");
const registrationApnsEnvironmentInput = document.querySelector("#registration-apns-environment");
const registrationStatusFilterInput = document.querySelector("#registration-status-filter");
const registrationInstallFilterInput = document.querySelector("#registration-install-filter");
const loadRegistrationsButton = document.querySelector("#load-registrations");
const registrationsStatusEl = document.querySelector("#registrations-status");
const registrationRowsEl = document.querySelector("#registration-rows");
const previousRegistrationsButton = document.querySelector("#previous-registrations");
const nextRegistrationsButton = document.querySelector("#next-registrations");
const registrationsPageLabel = document.querySelector("#registrations-page-label");
const revokeForm = document.querySelector("#revoke-form");
const revokeInstallIdInput = document.querySelector("#revoke-install-id");
const revokeTokenIdInput = document.querySelector("#revoke-token-id");
const revokeReasonInput = document.querySelector("#revoke-reason");
const revokeConfirm = document.querySelector("#revoke-confirm");
const confirmInstallId = document.querySelector("#confirm-install-id");
const confirmTokenId = document.querySelector("#confirm-token-id");
const confirmReason = document.querySelector("#confirm-reason");
const confirmRevokeCheck = document.querySelector("#confirm-revoke-check");
const executeRevokeButton = document.querySelector("#execute-revoke");
const revokeStatusEl = document.querySelector("#revoke-status");

const TOKEN_KEY = "djconnect.statsToken";
const REGISTRATIONS_ENDPOINT = "/api/operator/registrations";
const REGISTRATIONS_LIMIT = 25;
const REVOKE_ENDPOINT = "/api/operator/install-token/revoke";
const REVOKE_REASONS = new Set([
  "operator-disabled-compromised-install",
  "operator-disabled-requested",
  "operator-disabled-cleanup",
  "operator-disabled-other"
]);
let preparedRevoke = null;
let registrationsOffset = 0;
let registrationsNextOffset = null;

const formatNumber = (value) => new Intl.NumberFormat("nl-NL").format(Number(value || 0));

const setStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
};

const setRevokeStatus = (message, type = "info") => {
  revokeStatusEl.textContent = message;
  revokeStatusEl.classList.toggle("error", type === "error");
  revokeStatusEl.classList.toggle("success", type === "success");
};

const escapeText = (value) => {
  const span = document.createElement("span");
  span.textContent = String(value ?? "");
  return span.innerHTML;
};

const renderEmptyRow = (target, columns, message) => {
  target.innerHTML = `<tr><td colspan="${columns}">${escapeText(message)}</td></tr>`;
};

const renderClickTotals = (totals) => {
  if (!totals.length) {
    renderEmptyRow(clickTotalsEl, 3, "No D1 redirect clicks in this period.");
    return;
  }

  clickTotalsEl.innerHTML = totals.map((row) => `
    <tr>
      <td>${escapeText(row.target)}</td>
      <td>${escapeText(row.source)}</td>
      <td class="numeric">${formatNumber(row.count)}</td>
    </tr>
  `).join("");
};

const renderDailyRows = (rows) => {
  if (!rows.length) {
    renderEmptyRow(dailyRowsEl, 4, "No D1 rows returned.");
    return;
  }

  dailyRowsEl.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeText(row.day)}</td>
      <td>${escapeText(row.target)}</td>
      <td>${escapeText(row.source)}</td>
      <td class="numeric">${formatNumber(row.count)}</td>
    </tr>
  `).join("");
};

const renderGithubDownloads = (groups) => {
  if (!groups.length) {
    downloadGroupsEl.textContent = "No GitHub release downloads returned.";
    return;
  }

  downloadGroupsEl.innerHTML = groups.map((group) => {
    const assets = (group.assets || [])
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 12);
    const assetRows = assets.length
      ? assets.map((asset) => `
          <div class="asset-row">
            <a href="${escapeText(asset.url)}">${escapeText(asset.asset)}</a>
            <strong>${formatNumber(asset.downloads)}</strong>
          </div>
        `).join("")
      : "<p>No release assets returned.</p>";

    return `
      <article class="download-group">
        <header>
          <span>${escapeText(group.repo)}</span>
          <span>${group.ok ? formatNumber(group.totalDownloads) : `GitHub ${escapeText(group.status)}`}</span>
        </header>
        ${assetRows}
      </article>
    `;
  }).join("");
};


const setRegistrationsStatus = (message, type = "info") => {
  registrationsStatusEl.textContent = message;
  registrationsStatusEl.classList.toggle("error", type === "error");
  registrationsStatusEl.classList.toggle("success", type === "success");
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(String(value).replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
};

const renderStatusPill = (registration) => {
  if (registration.invalid) return '<span class="pill error">Invalid</span>';
  if (registration.disabled) return '<span class="pill muted">Disabled</span>';
  return '<span class="pill success">Active</span>';
};

const renderRegistrations = (registrations) => {
  if (!registrations.length) {
    renderEmptyRow(registrationRowsEl, 8, "No APNs registrations match these filters.");
    return;
  }

  registrationRowsEl.innerHTML = registrations.map((registration) => `
    <tr>
      <td>${escapeText(registration.client_type)}</td>
      <td>${escapeText(registration.apns_environment)}</td>
      <td><code>${escapeText(registration.ha_install_id_hash)}</code></td>
      <td><code>${escapeText(registration.device_id_hash)}</code></td>
      <td>${renderStatusPill(registration)}</td>
      <td>${escapeText(formatDateTime(registration.last_success_at))}</td>
      <td>${escapeText(registration.last_error_code || "-")}</td>
      <td>${escapeText(formatDateTime(registration.updated_at))}</td>
    </tr>
  `).join("");
};

const registrationQueryParams = () => {
  const params = new URLSearchParams({
    limit: String(REGISTRATIONS_LIMIT),
    offset: String(registrationsOffset)
  });
  const clientType = registrationClientTypeInput.value;
  const apnsEnvironment = registrationApnsEnvironmentInput.value;
  const installFilter = registrationInstallFilterInput.value.trim();
  const statusFilter = registrationStatusFilterInput.value;

  if (clientType) params.set("client_type", clientType);
  if (apnsEnvironment) params.set("apns_environment", apnsEnvironment);
  if (installFilter) params.set("ha_install_id", installFilter);
  if (statusFilter === "active") params.set("disabled", "false");
  if (statusFilter === "disabled") params.set("disabled", "true");
  if (statusFilter === "invalid") params.set("invalid", "true");
  return params;
};

const loadRegistrations = async (event) => {
  if (event) {
    event.preventDefault();
    registrationsOffset = 0;
  }

  loadRegistrationsButton.disabled = true;
  previousRegistrationsButton.disabled = true;
  nextRegistrationsButton.disabled = true;
  setRegistrationsStatus("Loading APNs registrations...");

  try {
    const response = await fetch(`${REGISTRATIONS_ENDPOINT}?${registrationQueryParams()}`, {
      cache: "no-store"
    });

    let body = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }

    if (!response.ok || body.ok !== true) {
      throw new Error(sanitizeError(body.error || `registrations_failed_${response.status}`));
    }

    const registrations = body.registrations || [];
    registrationsNextOffset = body.next_offset ?? null;
    renderRegistrations(registrations);
    registrationsPageLabel.textContent = `Page ${Math.floor(registrationsOffset / REGISTRATIONS_LIMIT) + 1}`;
    previousRegistrationsButton.disabled = registrationsOffset === 0;
    nextRegistrationsButton.disabled = registrationsNextOffset === null;
    setRegistrationsStatus(`Loaded ${formatNumber(registrations.length)} APNs registrations.`, "success");
  } catch (error) {
    setRegistrationsStatus(sanitizeError(error.message), "error");
    renderEmptyRow(registrationRowsEl, 8, "Could not load APNs registrations.");
  } finally {
    loadRegistrationsButton.disabled = false;
  }
};

const moveRegistrationsPage = (direction) => {
  if (direction < 0) {
    registrationsOffset = Math.max(0, registrationsOffset - REGISTRATIONS_LIMIT);
  } else if (registrationsNextOffset !== null) {
    registrationsOffset = registrationsNextOffset;
  }
  loadRegistrations();
};

const resetRevokeConfirm = () => {
  preparedRevoke = null;
  revokeConfirm.hidden = true;
  confirmRevokeCheck.checked = false;
  executeRevokeButton.disabled = true;
};

const prepareRevoke = (event) => {
  event.preventDefault();
  const haInstallId = revokeInstallIdInput.value.trim();
  const tokenId = revokeTokenIdInput.value.trim();
  const reason = revokeReasonInput.value;

  if (!haInstallId || !tokenId || !REVOKE_REASONS.has(reason)) {
    resetRevokeConfirm();
    setRevokeStatus("Install ID, token ID and reason are required.", "error");
    return;
  }

  preparedRevoke = { ha_install_id: haInstallId, token_id: tokenId, reason };
  confirmInstallId.textContent = haInstallId;
  confirmTokenId.textContent = tokenId;
  confirmReason.textContent = reason;
  revokeConfirm.hidden = false;
  confirmRevokeCheck.checked = false;
  executeRevokeButton.disabled = true;
  setRevokeStatus("Review the target and confirm before revoking.");
};

const sanitizeError = (value) => {
  const text = String(value || "request_failed");
  return text
    .replace(/djci_[a-z0-9_-]+/gi, "djci_[redacted]")
    .replace(/Bearer\s+[a-z0-9._~+/=-]+/gi, "Bearer [redacted]")
    .slice(0, 160);
};

const revokeInstallToken = async () => {
  if (!preparedRevoke || !confirmRevokeCheck.checked) {
    setRevokeStatus("Explicit confirmation is required before revoking.", "error");
    return;
  }

  executeRevokeButton.disabled = true;
  setRevokeStatus("Revoking install token...");

  try {
    const response = await fetch(REVOKE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preparedRevoke),
      cache: "no-store"
    });

    let body = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }

    if (!response.ok) {
      throw new Error(sanitizeError(body.error || `revoke_failed_${response.status}`));
    }

    if (body.ok === true && Number(body.revoked) === 1) {
      setRevokeStatus("Token disabled. Provisioning a new token is a separate operator action.", "success");
      resetRevokeConfirm();
      return;
    }

    if (body.ok === true && Number(body.revoked) === 0) {
      setRevokeStatus("Token was already disabled or no active token matched that install ID and token ID.", "success");
      resetRevokeConfirm();
      return;
    }

    throw new Error(sanitizeError(body.error || "unexpected_revoke_response"));
  } catch (error) {
    setRevokeStatus(sanitizeError(error.message), "error");
    executeRevokeButton.disabled = !confirmRevokeCheck.checked;
  }
};

const loadStats = async () => {
  const token = tokenInput.value.trim();
  const days = daysInput.value;
  if (!token) {
    setStatus("Enter the stats token to load aggregate data.", true);
    tokenInput.focus();
    return;
  }

  sessionStorage.setItem(TOKEN_KEY, token);
  loadButton.disabled = true;
  setStatus("Loading D1 and GitHub stats...");

  try {
    const response = await fetch(`/api/stats?days=${encodeURIComponent(days)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(response.status === 404 ? "Token rejected or endpoint unavailable." : `Stats request failed with ${response.status}.`);
    }

    const stats = await response.json();
    const totals = stats.redirectClicks?.totals || [];
    const daily = stats.redirectClicks?.daily || [];
    const downloads = stats.githubDownloads || [];
    const clickCount = totals.reduce((sum, row) => sum + Number(row.count || 0), 0);
    const downloadCount = downloads.reduce((sum, group) => sum + Number(group.totalDownloads || 0), 0);

    metricClicks.textContent = formatNumber(clickCount);
    metricDownloads.textContent = formatNumber(downloadCount);
    metricRows.textContent = formatNumber(daily.length);
    renderClickTotals(totals);
    renderDailyRows(daily);
    renderGithubDownloads(downloads);
    setStatus(stats.privacy || "Aggregate-only stats loaded.");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    loadButton.disabled = false;
  }
};

tokenInput.value = sessionStorage.getItem(TOKEN_KEY) || "";
loadButton.addEventListener("click", loadStats);
daysInput.addEventListener("change", () => {
  if (tokenInput.value.trim()) loadStats();
});
tokenInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadStats();
});
registrationsForm.addEventListener("submit", loadRegistrations);
previousRegistrationsButton.addEventListener("click", () => moveRegistrationsPage(-1));
nextRegistrationsButton.addEventListener("click", () => moveRegistrationsPage(1));
revokeForm.addEventListener("submit", prepareRevoke);
confirmRevokeCheck.addEventListener("change", () => {
  executeRevokeButton.disabled = !confirmRevokeCheck.checked;
});
executeRevokeButton.addEventListener("click", revokeInstallToken);
