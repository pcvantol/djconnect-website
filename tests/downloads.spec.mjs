import { test, expect } from '@playwright/test';

test('localized downloads show the current binary only when it is available', async ({ page }) => {
  const binary = 'https://github.com/pcvantol/djconnect-app-releases/releases/download/macos/v4.1.0/DJConnect-macOS-4.1.0.zip';
  const endpoint = '**/api/downloads/macos';
  await page.route(endpoint, route => route.fulfill({ json: {
    version: '4.1.0', prerelease: true, downloadUrl: binary
  }}));
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/start');
  await page.getByRole('link', { name: 'Downloads', exact: true }).click();
  await expect(page).toHaveURL(/\/downloads$/);
  await expect(page.locator('[data-release-details]')).toContainText('Versie 4.1.0 · Previewrelease');
  await expect(page.getByRole('link', { name: 'Download voor macOS' })).toHaveAttribute('href', binary);
  await expect(page.locator('[data-release-actions] a')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Download ESP32-firmware' })).toHaveAttribute('href', '/go/device/esp32');
  const pi = page.locator('#raspberry-pi');
  const pi5 = pi.getByRole('radio', { name: 'Pi 5' });
  await expect(pi5).toBeChecked();
  await expect(pi.getByRole('link')).toHaveCount(1);
  await expect(pi.getByRole('link')).toHaveAttribute('href', '/go/device/pi5');
  await pi5.focus();
  await page.keyboard.press('ArrowRight');
  await expect(pi.getByRole('radio', { name: 'Zero 2 W' })).toBeChecked();
  await expect(pi.getByRole('link')).toHaveCount(1);
  await expect(pi.getByRole('link')).toHaveAttribute('href', '/go/device/pi-zero-2w');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

  await page.unroute(endpoint);
  await page.route(endpoint, route => route.fulfill({ status: 502 }));
  await page.locator('.languages summary').click();
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/downloads$/);
  await expect(page.locator('[data-release-unavailable]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download for macOS' })).toHaveCount(0);
});
