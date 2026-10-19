import { jsonResponse } from "./_shared/analytics.js";

const PROTECTED_OPERATOR_PATHS = [
  "/operator",
  "/operator.html",
  "/api/operator/"
];

const ACCESS_HEADER = "Cf-Access-Jwt-Assertion";

const textEncoder = new TextEncoder();

const isProtectedOperatorPath = (pathname) => PROTECTED_OPERATOR_PATHS.some((path) => (
  path.endsWith("/") ? pathname.startsWith(path) : pathname === path
));

const base64UrlToBytes = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const parseJwtPart = (value) => JSON.parse(new TextDecoder().decode(base64UrlToBytes(value)));

const accessCertsUrl = (teamDomain) => {
  const cleanDomain = String(teamDomain || "").trim().replace(/^https?:\/\//u, "").replace(/\/+$/u, "");
  return `https://${cleanDomain}/cdn-cgi/access/certs`;
};

const fetchAccessJwks = async (teamDomain) => {
  const response = await fetch(accessCertsUrl(teamDomain), {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`access_certs_${response.status}`);
  }
  return response.json();
};

const audMatches = (claim, expectedAud) => {
  if (Array.isArray(claim)) return claim.includes(expectedAud);
  return claim === expectedAud;
};

const verifyAccessJwt = async (jwt, env) => {
  const parts = String(jwt || "").split(".");
  if (parts.length !== 3) return false;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJwtPart(encodedHeader);
  const payload = parseJwtPart(encodedPayload);
  if (header.alg !== "RS256" || !header.kid) return false;

  const now = Math.floor(Date.now() / 1000);
  if (!audMatches(payload.aud, env.CLOUDFLARE_ACCESS_AUD)) return false;
  if (typeof payload.exp !== "number" || payload.exp <= now) return false;
  if (typeof payload.nbf === "number" && payload.nbf > now) return false;

  const jwks = await fetchAccessJwks(env.CLOUDFLARE_ACCESS_TEAM_DOMAIN);
  const jwk = (jwks.keys || []).find((key) => key.kid === header.kid);
  if (!jwk) return false;

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  return crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(encodedSignature),
    textEncoder.encode(`${encodedHeader}.${encodedPayload}`)
  );
};

const accessDenied = (status, error) => jsonResponse({ ok: false, error }, status);

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (!isProtectedOperatorPath(url.pathname)) {
    return context.next();
  }

  if (!context.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN || !context.env.CLOUDFLARE_ACCESS_AUD) {
    return accessDenied(403, "operator_access_not_configured");
  }

  const jwt = context.request.headers.get(ACCESS_HEADER);
  if (!jwt) {
    return accessDenied(401, "operator_access_required");
  }

  try {
    if (await verifyAccessJwt(jwt, context.env)) {
      return context.next();
    }
  } catch {
    return accessDenied(403, "operator_access_invalid");
  }

  return accessDenied(403, "operator_access_invalid");
}
