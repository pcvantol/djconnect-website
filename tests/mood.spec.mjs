import {test,expect} from '@playwright/test';

const moods=[
 ['chill','rgb(113, 228, 210)'],
 ['groove','rgb(196, 161, 255)'],
 ['energy','rgb(141, 187, 255)'],
 ['party','rgb(255, 155, 184)'],
];

test('moods tint a still wave and keep the rounded frame clear',async({page},testInfo)=>{
 await page.goto('/en/');
 const preview=page.locator('.mood-preview');
 const art=preview.locator('picture');
 const wave=art.locator('img');
 for(const [width,reducedMotion] of [[1280,'no-preference'],[320,'reduce']]){
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion});
  const bounds=await preview.evaluate(el=>{
   const frame=el.querySelector('picture');
   return {gap:el.querySelector('.mood-controls').getBoundingClientRect().top-frame.getBoundingClientRect().bottom,radius:parseFloat(getComputedStyle(frame).borderBottomLeftRadius)};
  });
  expect(bounds.gap).toBeGreaterThan(0);
  expect(bounds.radius).toBeGreaterThan(0);
  for(const [mood,colour] of moods){
   const button=preview.locator(`[data-mood-choice="${mood}"]`);
   await button.click();
   await expect(button).toHaveAttribute('aria-pressed','true');
   await expect.poll(()=>art.evaluate(el=>getComputedStyle(el,'::after').backgroundColor)).toBe(colour);
   await expect(art).toHaveCSS('border-bottom-color',colour);
   await expect(wave).toHaveCSS('animation-name','none');
   await expect(wave).toHaveCSS('transform','none');
  }
  await testInfo.attach(`party-frame-${width}`,{body:await preview.screenshot(),contentType:'image/png'});
 }
});
