import {test,expect} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';
for(const locale of ['nl','en','de','fr','es'])test(`WCAG AA ${locale}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(locale==='nl'?'/':`/${locale}/`);
 for(const state of ['page','language','menu']){
  if(state==='language')await page.locator('.languages summary').click();
  if(state==='menu')await page.locator('[data-menu-open]').click();
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations,JSON.stringify(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([]);
 }
});
test('central accent and font propagate in real browser; transparent fallback',async({page})=>{
 await page.goto('/');const before=await page.locator('.hero h1').evaluate(e=>getComputedStyle(e).fontFamily);
 await page.addStyleTag({content:':root { --color-primary: #ffe38d; --font-display: Georgia, serif; }'});
 expect(await page.locator('.hero h1').evaluate(e=>getComputedStyle(e).fontFamily)).not.toBe(before);
 expect(await page.locator('#vibe h2').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Georgia');
 expect(await page.locator('.hero .button').evaluate(e=>getComputedStyle(e).backgroundImage)).toContain('rgb(255, 227, 141)');
 // Fresh navigation restores approved tokens; test-only palette is never persisted.
 await page.reload();expect(await page.locator('.hero h1').evaluate(e=>getComputedStyle(e).fontFamily)).toBe(before);
});
test('reduced transparency uses opaque readable surfaces',async({page,browserName})=>{
 test.skip(browserName!=='chromium','CDP media emulation is Chromium-only; CSS fallback is shared');
 const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]});await page.goto('/');
 expect(await page.locator('.languages').evaluate(e=>getComputedStyle(e).backdropFilter)).toBe('none');expect(await page.locator('.languages').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(25, 32, 57)');
});
