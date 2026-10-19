import {readFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';
const version=readFileSync(new URL('../VERSION',import.meta.url),'utf8').trim();
const locales=['nl','en','de','fr','es'];const prefix=l=>l==='nl'?'':`/${l}`;
for(const locale of locales){
 test(`${locale}: static routes, SEO, language and destinations`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const slug of ['','start','privacy','support']){
   const url=prefix(locale)+'/'+slug;await page.goto(url);await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('main h1')).toHaveCount(1);await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://djconnect.dev'+url);await expect(page.locator('link[hreflang]')).toHaveCount(6);await expect(page.locator('.site-footer a')).toHaveCount(2);await expect(page.locator('.site-footer')).toContainText(version);
   await page.locator('.languages summary').click();await expect(page.locator('.language-options a')).toHaveCount(5);await expect(page.locator('.language-options a[aria-current]')).toHaveAttribute('lang',locale);await page.keyboard.press('Escape');await expect(page.locator('.languages')).not.toHaveAttribute('open','');
  }
  await page.goto(prefix(locale)+'/');await expect(page.locator('main section')).toHaveCount(4);await expect(page.locator('a[href="https://vibecast.tv"]')).toBeVisible();await expect(page.locator('.hero .button')).toHaveAttribute('href',prefix(locale)+'/start');expect(errors).toEqual([]);
 });
}
for(const width of [320,375,390,430,768,1280]){
 test(`${width}px: layout, menu keyboard and mood`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await expect(page.locator('.hero h1')).toBeVisible();await expect(page.locator('.languages summary')).toBeInViewport();
  const button=page.locator('[data-menu-open]');await button.click();await expect(page.locator('dialog')).toBeVisible();await expect(button).toHaveAttribute('aria-expanded','true');
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement))).toBeTruthy();}
  await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();await expect(button).toBeFocused();
  await button.click();await page.mouse.click(2,800);await expect(page.locator('dialog')).not.toBeVisible();await expect(button).toBeFocused();
  await page.getByRole('button',{name:'Kies de sfeer Party'}).click();await expect(page.locator('[data-mood]')).toHaveAttribute('data-mood','party');await expect(page.locator('[aria-pressed=true]')).toHaveCount(1);
  await page.locator('.languages summary').click();await page.getByRole('link',{name:'English',exact:true}).click();await expect(page).toHaveURL(/\/en\/$/);await expect(page.locator('h1')).toHaveText('Your music. Your DJ.');
 });
}
test('reduced motion, touch targets, archive exclusion and 404',async({page,request})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
 for(const item of await page.locator('.site-header button,.site-header summary,.hero .button,.site-footer a').all()){const b=await item.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);}
 for(const url of ['/archive/legacy-website-2026-10-19/wwwroot/index.html','/archive/legacy-website-2026-10-19/ARCHIVE_MANIFEST.md','/developers','/assets/artwork/hero-original.png','/src/locales/catalog.mjs'])expect((await request.get(url)).status()).toBe(404);
 await page.goto('/missing');await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, follow');
});
