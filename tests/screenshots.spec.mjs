import {test,expect} from '@playwright/test';
async function readyArt(page){
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>0)).toBeTruthy();}
 await page.evaluate(()=>scrollTo(0,0));
}
async function retainActual(page,testInfo,name,fullPage=false){await testInfo.attach(name,{body:await page.screenshot({fullPage,animations:'disabled'}),contentType:'image/png'});}
for(const width of [320,375,390,430,768,1280]){
 test(`homepage ${width}`,async({page},testInfo)=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await readyArt(page);
  await expect.soft(page).toHaveScreenshot(`home-${width}.png`,{fullPage:true,animations:'disabled',maxDiffPixels:100});await retainActual(page,testInfo,`actual-home-${width}`,true);
  await page.locator('[data-menu-open]').click();await expect.soft(page).toHaveScreenshot(`menu-${width}.png`,{animations:'disabled',maxDiffPixels:100});await retainActual(page,testInfo,`actual-menu-${width}`);
 });
}
for(const locale of ['en','de','fr','es'])test(`localized visual ${locale}`,async({page},testInfo)=>{await page.setViewportSize({width:390,height:844});await page.goto(`/${locale}/`);await readyArt(page);await expect.soft(page).toHaveScreenshot(`home-${locale}.png`,{fullPage:true,animations:'disabled',maxDiffPixels:100});await retainActual(page,testInfo,`actual-home-${locale}`,true);});
