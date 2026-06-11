# Tests

## Manual Checks

- Open `wwwroot/index.html`.
- Verify the homepage navigation scrolls to Platform, Essentials and Apps & devices.
- Verify the Embedded device navigation link opens `wwwroot/embedded.html`.
- Open `wwwroot/embedded.html`.
- Verify Dutch and English language toggles update all visible embedded-page text.
- Verify the embedded page navigation can return to `wwwroot/index.html`.
- Verify the page renders at desktop width, tablet width and mobile width.

## Release Checks

Run before deploying:

```bash
git status --short
test -f wwwroot/index.html
test -f wwwroot/assets/djconnect/site.webmanifest
```

After deployment:

```bash
curl -I https://djconnect.pages.dev
```

Expected result: `HTTP/2 200`.

## Future Automation

- Add Playwright smoke tests for language switching and carousel behavior.
- Add a link checker for external URLs.
- Add HTML validation in CI.
