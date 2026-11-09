import {test,expect} from '@playwright/test';

const moods=[
 ['chill','rgb(113, 228, 210)'],
 ['groove','rgb(196, 161, 255)'],
 ['energy','rgb(141, 187, 255)'],
 ['party','rgb(255, 155, 184)'],
];

test('the wave changes colour and motion with each mood',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/en/');
 const preview=page.locator('.mood-preview');
 const art=preview.locator('picture');
 const wave=art.locator('img');
 // Initial Chill also animates when the art is first brought into view.
 await art.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
 await expect(wave).toHaveCSS('animation-name','mood-chill-flow');
 for(const reducedMotion of ['no-preference','reduce']){
  await page.emulateMedia({reducedMotion});
  for(const [mood,colour] of moods){
   const button=preview.locator(`[data-mood-choice="${mood}"]`);
   await button.click();
   await expect(button).toHaveAttribute('aria-pressed','true');
   await expect.poll(()=>art.evaluate(el=>getComputedStyle(el,'::after').backgroundColor)).toBe(colour);
   if(reducedMotion==='reduce'){
    await expect(wave).toHaveCSS('animation-name','none');
    await expect(wave).toHaveCSS('transform','none');
    await testInfo.attach(`mood-${mood}`,{body:await art.screenshot(),contentType:'image/png'});
   }else{
    await expect(wave).toHaveCSS('animation-name',`mood-${mood}-flow`);
    await expect(wave).not.toHaveCSS('transform','none');
   }
  }
 }
});
