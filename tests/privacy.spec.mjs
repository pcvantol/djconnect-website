import {test,expect} from '@playwright/test';
import {languages} from '../src/locales/catalog.mjs';
import {privacy,privacyContact,privacySections,supervisoryAuthorityUrl} from '../src/locales/privacy.mjs';
import {route} from '../src/pages/registry.mjs';

test('all privacy translations share sections and are reachable from the footer and language selector on mobile',async({page},testInfo)=>{
 await page.setViewportSize({width:320,height:900});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await page.locator('.site-footer a[href="/privacy"]').click();

 for(const [index,locale] of languages.entries()){
  const url=route(locale,'privacy');
  await expect(page).toHaveURL(new RegExp(url+'$'));
  await expect(page.locator('html')).toHaveAttribute('lang',locale);
  await expect(page.getByRole('heading',{level:1})).toHaveText(privacy[locale].title);
  expect(await page.locator('.privacy-section').evaluateAll(sections=>sections.map(section=>section.id))).toEqual(privacySections);
  await expect(page.getByRole('link',{name:privacyContact})).toHaveAttribute('href','mailto:'+privacyContact);
  await expect(page.getByRole('link',{name:privacy[locale].complaint})).toHaveAttribute('href',supervisoryAuthorityUrl);
  await expect(page.locator(`.site-footer a[href="${url}"]`)).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),locale+' has no horizontal overflow').toBeTruthy();
  if(locale==='nl')await testInfo.attach('privacy-nl-320',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});

  const next=languages[index+1];
  if(next){
   await page.locator('.languages summary').click();
   await page.locator(`.language-options a[hreflang="${next}"]`).click();
  }
 }
});
