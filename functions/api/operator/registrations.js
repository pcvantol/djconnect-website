import { jsonResponse } from "../../_shared/analytics.js";

const API_REGISTRATIONS_PATH = "/v1/admin/registrations";
const VALID_CLIENT_TYPES = new Set(["ios", "macos", "watchos"]);
const VALID_APNS_ENVIRONMENTS = new Set(["sandbox", "production"]);
const BOOLEAN_VALUES = new Set(["true", "false", "1", "0"]);

const sanitizeError = (value) => String(value || "request_failed")
  .replace(/djci_[a-z0-9_-]+/gi, "djci_[redacted]")
  .replace(/Bearer\s+[a-z0-9._~+/=-]+/gi, "Bearer [redacted]")
  .slice(0, 160);

const apiBaseUrl = (env) => String(env.DJCONNECT_API_BASE_URL || "https://api.djconnect.dev").replace(/\/+$/u, "");

const appendIfPresent = (source, target, key, validator = () => true) => {
  const value = source.get(key);
  if (!value) return true;
  if (!validator(value)) return false;
  target.set(key, value);
  return true;
};

export async function onRequestGet({ request, env }) {
  if (!env.DJCONNECT_RELAY_SECRET) {
    return jsonResponse({ ok: false, error: "operator_secret_not_configured" }, 500);
  }

  const input = new URL(request.url).searchParams;
  const params = new URLSearchParams();

  const limit = Number(input.get("limit") || 25);
  const offset = Number(input.get("offset") || 0);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0) {
    return jsonResponse({ ok: false, error: "invalid_registration_query" }, 400);
  }
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const valid = [
    appendIfPresent(input, params, "client_type", (value) => VALID_CLIENT_TYPES.has(value)),
    appendIfPresent(input, params, "apns_environment", (value) => VALID_APNS_ENVIRONMENTS.has(value)),
    appendIfPresent(input, params, "disabled", (value) => BOOLEAN_VALUES.has(value)),
    appendIfPresent(input, params, "invalid", (value) => BOOLEAN_VALUES.has(value)),
    appendIfPresent(input, params, "ha_install_id", (value) => value.length <= 160 && !/^djci_/i.test(value))
  ].every(Boolean);

  if (!valid) {
    return jsonResponse({ ok: false, error: "invalid_registration_query" }, 400);
  }

  const response = await fetch(`${apiBaseUrl(env)}${API_REGISTRATIONS_PATH}?${params}`, {
    headers: {
      Authorization: `Bearer ${env.DJCONNECT_RELAY_SECRET}`,
      Accept: "application/json"
    }
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
      error: sanitizeError(body.error || `operator_registrations_failed_${response.status}`)
    }, response.status);
  }

  return jsonResponse({
    ok: body.ok === true,
    registrations: Array.isArray(body.registrations) ? body.registrations : [],
    next_offset: body.next_offset ?? null
  }, response.status);
}
