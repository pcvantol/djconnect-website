import {test,expect} from '@playwright/test';

const examples=[
 ['chill','rgb(180, 162, 255)','Soft Focus','Mira Fallow'],
 ['groove','rgb(113, 228, 210)','Afterglow Avenue','The Amber Weft'],
 ['energy','rgb(214, 247, 91)','Signal Bloom','Kinetic Juniper'],
 ['party','rgb(255, 138, 182)','Midnight Confetti','Neon Tern Club'],
];

test('Horizon shows a still panoramic preview and a fictional queue for each mood',async({page},testInfo)=>{
 await page.goto('/en/');
 const preview=page.getByRole('region',{name:/Horizon/});
 const art=preview.locator('picture');
 const wave=art.locator('img');
 await expect(preview.getByText('Fictional preview')).toBeVisible();
 for(const [width,reducedMotion] of [[1280,'no-preference'],[320,'reduce']]){
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion});
  const bounds=await preview.evaluate(el=>{
   const frame=el.querySelector('picture');
   return {gap:el.querySelector('.mood-controls').getBoundingClientRect().top-frame.getBoundingClientRect().bottom,radius:parseFloat(getComputedStyle(frame).borderBottomLeftRadius)};
  });
  expect(bounds.gap).toBeGreaterThan(0);
  expect(bounds.radius).toBeGreaterThan(0);
  const gradients=new Set();
  for(const [mood,colour,title,artist] of examples){
   const button=preview.locator(`[data-mood-choice="${mood}"]`);
   await button.click();
   await expect(button).toHaveAttribute('aria-pressed','true');
   await expect(art).toHaveCSS('border-bottom-color',colour);
   gradients.add(await art.evaluate(el=>getComputedStyle(el,'::after').backgroundImage));
   const queue=preview.getByRole('list');
   await expect(queue).toHaveCount(1);
   await expect(queue.getByRole('listitem')).toHaveCount(2);
   await expect(queue.getByRole('listitem').first()).toContainText(title);
   await expect(queue.getByRole('listitem').first()).toContainText(artist);
   await expect(wave).toHaveCSS('animation-name','none');
   await expect(wave).toHaveCSS('transform','none');
  }
  expect(gradients.size).toBe(4);
  await wave.evaluate(img=>img.decode());
  await testInfo.attach(`horizon-party-${width}`,{body:await preview.screenshot(),contentType:'image/png'});
 }
});
