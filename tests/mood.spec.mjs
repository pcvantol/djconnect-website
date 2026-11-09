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

test('DJ character previews switch the artwork and explanation independently of Horizon',async({page},testInfo)=>{
 await page.setViewportSize({width:320,height:900});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 const horizon=page.getByRole('region',{name:/Horizon ·/});
 const card=page.getByRole('region',{name:'DJ karakter'});
 expect((await card.boundingBox()).y).toBeGreaterThan((await horizon.boundingBox()).y+(await horizon.boundingBox()).height);
 await expect(card.getByRole('button',{name:'Thuis-dj'})).toHaveAttribute('aria-pressed','true');

 const examples=[
  ['Radio-dj','radio','Helder en nieuwsgierig'],
  ['Club-dj','club','Direct en ritmisch'],
  ['Festival-dj','festival','Uitbundig en meeslepend'],
  ['Thuis-dj','home','Warm en ontspannen'],
 ];
 for(const [name,id,description] of examples){
  const button=card.getByRole('button',{name});
  const art=card.locator('[data-character-art]:visible img');
  expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await button.press('Enter');
  await expect(button).toBeFocused();
  await expect(card.getByRole('button',{pressed:true})).toHaveText(name);
  await expect(art).toHaveAttribute('src',new RegExp(`character-${id}-800\\.webp$`));
  await expect(card.locator('[aria-live] p:visible')).toContainText(description);
  await art.evaluate(img=>img.decode());
  await expect(art).toHaveCSS('animation-name','none');
 }
 await expect(horizon.getByRole('button',{pressed:true})).toContainText('Chill');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await testInfo.attach('dj-karakter-320',{body:await card.screenshot(),contentType:'image/png'});
});
