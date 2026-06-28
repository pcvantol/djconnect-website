import { githubHeaders, jsonResponse } from "../_shared/analytics.js";

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const owner = url.searchParams.get("owner") || "pcvantol";
  const repo = url.searchParams.get("repo") || "djconnect-website";
  const limit = Math.min(Number(url.searchParams.get("limit") || 3), 10);

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    headers: githubHeaders(env)
  });
  const body = await response.text();
  const responseBody = response.ok ? JSON.parse(body).slice(0, limit) : { error: body };

  return jsonResponse(responseBody, response.status, {
    "Cache-Control": response.ok ? "public, max-age=300" : "no-store",
    "Access-Control-Allow-Origin": "*",
    "X-Release-Limit": String(limit)
  });
}
