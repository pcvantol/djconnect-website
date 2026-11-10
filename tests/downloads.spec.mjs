import { test, expect } from '@playwright/test';

test('localized downloads show the current binary and keep GitHub as fallback', async ({ page }) => {
  const binary = 'https://github.com/pcvantol/djconnect-app-releases/releases/download/macos/v4.1.0/DJConnect-macOS-4.1.0-unsigned.zip';
  const endpoint = '**/api/downloads/macos';
  await page.route(endpoint, route => route.fulfill({ json: {
    version: '4.1.0', prerelease: true, unsigned: true, downloadUrl: binary
  }}));
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/start');
  await page.getByRole('link', { name: 'Downloads', exact: true }).click();
  await expect(page).toHaveURL(/\/downloads$/);
  await expect(page.locator('[data-release-details]')).toContainText('Versie 4.1.0 · Previewrelease');
  await expect(page.locator('[data-release-unsigned]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download voor macOS' })).toHaveAttribute('href', binary);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

  await page.unroute(endpoint);
  await page.route(endpoint, route => route.fulfill({ status: 502 }));
  await page.locator('.languages summary').click();
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/downloads$/);
  await expect(page.locator('[data-release-unavailable]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download for macOS' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'View releases on GitHub' })).toHaveAttribute(
    'href', 'https://github.com/pcvantol/djconnect-app-releases/releases'
  );
});
