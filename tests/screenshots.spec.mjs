import {test,expect} from '@playwright/test';
async function readyArt(page){
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>0)).toBeTruthy();}
 await page.evaluate(()=>scrollTo(0,0));
}
for(const width of [320,375,390,430,768,1280]){
 test(`homepage ${width}`,async({page},testInfo)=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await readyArt(page);
  await expect(page).toHaveScreenshot(`home-${width}.png`,{fullPage:true,animations:'disabled',maxDiffPixelRatio:.005});
  await page.locator('[data-menu-open]').click();await expect(page).toHaveScreenshot(`menu-${width}.png`,{animations:'disabled',maxDiffPixelRatio:.005});
 });
}
for(const locale of ['en','de','fr','es'])test(`localized visual ${locale}`,async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto(`/${locale}/`);await readyArt(page);await expect(page).toHaveScreenshot(`home-${locale}.png`,{fullPage:true,animations:'disabled',maxDiffPixelRatio:.005});});
