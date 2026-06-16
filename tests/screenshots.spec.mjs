import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { test, expect } from "@playwright/test";

const baseURL = process.env.SCREENSHOT_BASE_URL || "https://djconnect.dev";
const outputDir = process.env.SCREENSHOT_OUTPUT_DIR || "screenshots/live-laptop";
const viewport = {
  width: Number(process.env.SCREENSHOT_WIDTH || 1440),
  height: Number(process.env.SCREENSHOT_HEIGHT || 900)
};

const pages = [
  { path: "/", name: "home" },
  { path: "/start", name: "start" },
  { path: "/features", name: "features" },
  { path: "/voice-commands", name: "voice-commands" },
  { path: "/blog", name: "blog" },
  { path: "/blog-djconnect-project", name: "blog-djconnect-project" },
  { path: "/ios", name: "ios" },
  { path: "/macos", name: "macos" },
  { path: "/raspberry-pi", name: "raspberry-pi" },
  { path: "/embedded", name: "embedded" }
];

test.describe("Live laptop screenshots", () => {
  test.use({
    viewport,
    colorScheme: "dark",
    reducedMotion: "reduce"
  });

  test("capture public pages", async ({ page }) => {
    await mkdir(outputDir, { recursive: true });

    const captured = [];
    for (const entry of pages) {
      const url = new URL(entry.path, baseURL).toString();
      await page.goto(url, { waitUntil: "networkidle" });
      await expect(page.locator("body")).toBeVisible();

      const fileName = `${String(captured.length + 1).padStart(2, "0")}-${entry.name}-${viewport.width}x${viewport.height}.png`;
      const filePath = path.join(outputDir, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      captured.push({ ...entry, url, file: fileName });
    }

    await writeFile(
      path.join(outputDir, "manifest.json"),
      JSON.stringify({
        baseURL,
        viewport,
        capturedAt: new Date().toISOString(),
        pages: captured
      }, null, 2)
    );
  });
});
