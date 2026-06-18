import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { test, expect } from "@playwright/test";

const baseURL = process.env.SCREENSHOT_BASE_URL || "https://djconnect.dev";
const outputDir = process.env.SCREENSHOT_OUTPUT_DIR || "screenshots/live-laptop";
const language = process.env.SCREENSHOT_LANG || "nl";
const viewport = {
  width: Number(process.env.SCREENSHOT_WIDTH || 1440),
  height: Number(process.env.SCREENSHOT_HEIGHT || 900)
};

const pages = [
  { path: "/", name: "home" },
  { path: "/start", name: "start" },
  { path: "/features", name: "features" },
  { path: "/platform", name: "platform" },
  { path: "/voice-commands", name: "voice-commands" },
  { path: "/voice-assistant", name: "voice-assistant" },
  { path: "/blog", name: "blog" },
  { path: "/blog-djconnect-project", name: "blog-djconnect-project" },
  { path: "/support", name: "support" },
  { path: "/ios", name: "ios" },
  { path: "/testflight-macos", name: "testflight-macos" },
  { path: "/macos", name: "macos" },
  { path: "/raspberry-pi", name: "raspberry-pi" },
  { path: "/embedded", name: "embedded" }
];

const pageURL = (entry) => {
  const url = new URL(entry.path, baseURL);
  if ((url.hostname === "127.0.0.1" || url.hostname === "localhost") && entry.path !== "/") {
    url.pathname = `${entry.path}.html`;
  }
  return url.toString();
};

test.describe("Live laptop screenshots", () => {
  test.use({
    viewport,
    locale: language === "nl" ? "nl-NL" : "en-US",
    colorScheme: "dark",
    reducedMotion: "reduce"
  });

  test("capture public pages", async ({ page }) => {
    await mkdir(outputDir, { recursive: true });

    const captured = [];
    for (const entry of pages) {
      const url = pageURL(entry);
      await page.addInitScript((lang) => {
        localStorage.setItem("djconnect-language", lang);
      }, language);
      await page.goto(url, { waitUntil: "networkidle" });
      await expect(page.locator("body")).toBeVisible();
      if (await page.locator("html").getAttribute("lang") !== language) {
        await page.locator(`[data-lang="${language}"]`).click();
      }
      await expect(page.locator("html")).toHaveAttribute("lang", language);

      const fileName = `${String(captured.length + 1).padStart(2, "0")}-${entry.name}-${viewport.width}x${viewport.height}.png`;
      const filePath = path.join(outputDir, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      captured.push({ ...entry, url, file: fileName });
    }

    await writeFile(
      path.join(outputDir, "manifest.json"),
      JSON.stringify({
        baseURL,
        language,
        viewport,
        capturedAt: new Date().toISOString(),
        pages: captured
      }, null, 2)
    );
  });
});
