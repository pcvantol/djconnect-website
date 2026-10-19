#!/usr/bin/env node

const token = process.env.STATS_TOKEN;
const days = process.env.STATS_DAYS || process.argv[2] || "30";
const endpoint = process.env.STATS_URL || "https://djconnect.dev/api/stats";

if (!token) {
  console.error("STATS_TOKEN is required. Example: STATS_TOKEN=... npm run stats:check");
  process.exit(1);
}

const url = new URL(endpoint);
if (!url.searchParams.has("days")) {
  url.searchParams.set("days", days);
}

const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  }
});

if (!response.ok) {
  console.error(`Stats endpoint returned ${response.status}`);
  process.exit(1);
}

const stats = await response.json();
const clickTotals = stats.redirectClicks?.totals || [];
const githubDownloads = stats.githubDownloads || [];

console.log(`DJConnect stats for ${url.searchParams.get("days")} days`);
console.log("");
console.log("Redirect clicks");
if (!clickTotals.length) {
  console.log("- No redirect clicks recorded.");
} else {
  for (const row of clickTotals) {
    console.log(`- ${row.target} (${row.source}): ${row.count}`);
  }
}

console.log("");
console.log("GitHub downloads");
for (const repo of githubDownloads) {
  if (!repo.ok) {
    console.log(`- ${repo.repo}: unavailable (${repo.status})`);
    continue;
  }
  console.log(`- ${repo.repo}: ${repo.totalDownloads}`);
  for (const asset of repo.assets || []) {
    console.log(`  - ${asset.release} / ${asset.asset}: ${asset.downloads}`);
  }
}
