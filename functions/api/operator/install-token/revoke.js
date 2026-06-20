import { jsonResponse } from "../../../_shared/analytics.js";

const API_REVOKE_PATH = "/v1/operator/install-token/revoke";
const VALID_REASONS = new Set([
  "operator-disabled-compromised-install",
  "operator-disabled-requested",
  "operator-disabled-cleanup",
  "operator-disabled-other"
]);

const sanitizeError = (value) => String(value || "request_failed")
  .replace(/djci_[a-z0-9_-]+/gi, "djci_[redacted]")
  .replace(/Bearer\s+[a-z0-9._~+/=-]+/gi, "Bearer [redacted]")
  .slice(0, 160);

const requireString = (value) => typeof value === "string" && value.trim() !== "";

const apiBaseUrl = (env) => String(env.DJCONNECT_API_BASE_URL || "https://api.djconnect.dev").replace(/\/+$/u, "");

export async function onRequestPost({ request, env }) {
  if (!env.DJCONNECT_RELAY_SECRET) {
    return jsonResponse({ ok: false, error: "operator_secret_not_configured" }, 500);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  const payload = {
    ha_install_id: String(input?.ha_install_id || "").trim(),
    token_id: String(input?.token_id || "").trim(),
    reason: String(input?.reason || "").trim()
  };

  if (!requireString(payload.ha_install_id) || !requireString(payload.token_id) || !VALID_REASONS.has(payload.reason)) {
    return jsonResponse({ ok: false, error: "invalid_revoke_request" }, 400);
  }

  const response = await fetch(`${apiBaseUrl(env)}${API_REVOKE_PATH}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DJCONNECT_RELAY_SECRET}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok) {
    return jsonResponse({
      ok: false,
      error: sanitizeError(body.error || `operator_revoke_failed_${response.status}`)
    }, response.status);
  }

  return jsonResponse({
    ok: body.ok === true,
    revoked: Number(body.revoked || 0) === 1 ? 1 : 0
  }, response.status);
}
