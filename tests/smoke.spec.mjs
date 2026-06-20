import { test, expect } from "@playwright/test";

const baseURL = process.env.SMOKE_BASE_URL || "https://djconnect.dev";

test.describe("DJConnect smoke", () => {
  test("core pages render and expose language toggle", async ({ page }) => {
    for (const path of ["/", "/start", "/features", "/macos", "/ios", "/raspberry-pi", "/embedded"]) {
      await page.goto(`${baseURL}${path}`);
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator(".site-version")).toContainText("DJConnect website v");
      await expect(page.locator(".lang-toggle")).toBeVisible();
    }
  });

  test("homepage mobile navigation and setup CTA remain reachable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL);
    await expect(page.getByRole("button", { name: /Menu/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Aan de slag|How to start/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Features/ })).toBeVisible();
  });

  test("download pages expose latest release containers", async ({ page }) => {
    for (const path of ["/macos", "/raspberry-pi", "/embedded"]) {
      await page.goto(`${baseURL}${path}`);
      await expect(page.locator("[data-github-downloads]")).toBeVisible();
    }
  });
});
