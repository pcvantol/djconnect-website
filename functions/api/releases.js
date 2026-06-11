export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const owner = url.searchParams.get("owner") || "pcvantol";
  const repo = url.searchParams.get("repo") || "djconnect-website";
  const limit = Math.min(Number(url.searchParams.get("limit") || 3), 10);

  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "djconnect-website"
  };
  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, { headers });
  const body = await response.text();
  const responseBody = response.ok ? JSON.stringify(JSON.parse(body).slice(0, limit)) : body;

  return new Response(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": response.ok ? "public, max-age=300" : "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Release-Limit": String(limit)
    }
  });
}
