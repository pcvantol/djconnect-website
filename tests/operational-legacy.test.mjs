import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const read=p=>readFile(new URL("../"+p,import.meta.url),"utf8");
test("release proxy function is present", async () => {
  const [proxy, analytics] = await Promise.all([
    read("functions/api/releases.js"),
    read("functions/_shared/analytics.js")
  ]);
  assert.match(proxy, /githubHeaders\(env\)/);
  assert.match(proxy, /jsonResponse/);
  assert.match(analytics, /env\.GITHUB_TOKEN/);
  assert.match(proxy, /api\.github\.com\/repos/);
});

test("redirect endpoints expose only current public targets", async () => {
  const [analytics, targetRedirect, downloadRedirect] = await Promise.all([
    read("functions/_shared/analytics.js"),
    read("functions/go/[target].js"),
    read("functions/go/download.js")
  ]);

  assert.match(analytics, /djconnect-app-releases/);
  assert.match(analytics, /djconnect-firmware/);
  assert.match(analytics, /djconnect-pi-releases/);
  assert.match(analytics, /github-firmware-releases": "https:\/\/github\.com\/pcvantol\/djconnect-firmware\/releases"/);
  assert.match(analytics, /github-linux-releases": "https:\/\/github\.com\/pcvantol\/djconnect-pi-releases\/releases"/);
  assert.doesNotMatch(analytics, /djconnect-website\/releases/);

  assert.match(targetRedirect, /"linux-install"/);
  assert.match(targetRedirect, /fetchLatestRelease\(context\.env, config\.repo\)/);
  assert.match(targetRedirect, /trackedRedirect\(context, target, asset\.browser_download_url\)/);
  assert.match(downloadRedirect, /isAllowedGithubDownload\(destination, repo\)/);
  assert.match(downloadRedirect, /trackedRedirect\(context, target, destination\)/);
});

test("operator page lists APNs registrations through a server-side proxy", async () => {
  const [operatorHtml, adminJs, proxy] = await Promise.all([
    read("wwwroot/operator.html"),
    read("wwwroot/assets/admin.js"),
    read("functions/api/operator/registrations.js")
  ]);
  const registrationsSection = operatorHtml.slice(
    operatorHtml.indexOf('<section class="panel" aria-labelledby="registrations-title">'),
    operatorHtml.indexOf('<section class="panel danger-zone"')
  );
  const registrationsRenderer = adminJs.slice(
    adminJs.indexOf("const renderRegistrations"),
    adminJs.indexOf("const registrationQueryParams")
  );
  const registrationQueryBuilder = adminJs.slice(
    adminJs.indexOf("const registrationQueryParams"),
    adminJs.indexOf("const loadRegistrations =")
  );
  const sensitiveRegistrationFields = [
    "apns_token",
    "apns_token_ciphertext",
    "apns_token_nonce",
    "apns_token_key_version",
    "install_token",
    "djci_"
  ];

  assert.match(operatorHtml, /Apple device registrations/);
  assert.match(registrationsSection, /Privacy-safe APNs registration metadata/);
  assert.match(registrationsSection, /id="registrations-form"/);
  assert.match(operatorHtml, /id="registration-rows"/);
  assert.match(operatorHtml, /id="registrations-status"/);
  assert.match(adminJs, /\/api\/operator\/registrations/);
  assert.doesNotMatch(adminJs, /https:\/\/api\.djconnect\.dev\/v1\/admin\/registrations/);
  assert.doesNotMatch(adminJs, /DJCONNECT_RELAY_SECRET/);
  assert.match(adminJs, /ha_install_id_hash/);
  assert.match(adminJs, /device_id_hash/);
  assert.match(adminJs, /apns_environment/);
  assert.match(adminJs, /client_type/);
  assert.match(adminJs, /last_success_at/);
  assert.match(adminJs, /last_error_code/);
  assert.match(registrationsSection, /id="registration-client-type"/);
  assert.match(registrationsSection, /id="registration-apns-environment"/);
  assert.match(registrationsSection, /id="registration-status-filter"/);
  assert.match(registrationsSection, /id="registration-install-filter"/);
  assert.match(registrationsSection, /id="previous-registrations"/);
  assert.match(registrationsSection, /id="registrations-page-label"/);
  assert.match(registrationsSection, /id="next-registrations"/);
  assert.match(registrationQueryBuilder, /client_type/);
  assert.match(registrationQueryBuilder, /apns_environment/);
  assert.match(registrationQueryBuilder, /disabled/);
  assert.match(registrationQueryBuilder, /invalid/);
  assert.match(registrationQueryBuilder, /ha_install_id/);
  for (const field of sensitiveRegistrationFields) {
    assert.doesNotMatch(registrationsSection, new RegExp(field));
    assert.doesNotMatch(registrationsRenderer, new RegExp(field));
  }

  assert.match(proxy, /\/v1\/admin\/registrations/);
  assert.match(proxy, /DJCONNECT_RELAY_SECRET/);
  assert.match(proxy, /Authorization: `Bearer \$\{env\.DJCONNECT_RELAY_SECRET\}`/);
  assert.match(proxy, /apiBaseUrl\(env\)\}\$\{API_REGISTRATIONS_PATH\}\?\$\{params\}/);
  assert.match(proxy, /const limit = Number\(input\.get\("limit"\) \|\| 25\)/);
  assert.match(proxy, /const offset = Number\(input\.get\("offset"\) \|\| 0\)/);
  assert.match(proxy, /limit < 1 \|\| limit > 100/);
  assert.match(proxy, /offset < 0/);
  assert.match(proxy, /VALID_CLIENT_TYPES = new Set\(\["ios", "macos", "watchos"\]\)/);
  assert.match(proxy, /VALID_APNS_ENVIRONMENTS = new Set\(\["sandbox", "production"\]\)/);
  assert.match(proxy, /BOOLEAN_VALUES = new Set\(\["true", "false", "1", "0"\]\)/);
  assert.match(proxy, /appendIfPresent\(input, params, "client_type"/);
  assert.match(proxy, /appendIfPresent\(input, params, "apns_environment"/);
  assert.match(proxy, /appendIfPresent\(input, params, "disabled"/);
  assert.match(proxy, /appendIfPresent\(input, params, "invalid"/);
  assert.match(proxy, /appendIfPresent\(input, params, "ha_install_id", \(value\) => value\.length <= 160 && !\/\^djci_\/i\.test\(value\)\)/);
  assert.match(proxy, /sanitizeError/);
  assert.match(proxy, /djci_\[redacted\]/);
  assert.match(proxy, /Bearer \[redacted\]/);
  assert.doesNotMatch(proxy, /console\./);
});
