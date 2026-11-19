import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const png=await readFile(new URL('../src/assets/brand/mark-32.png',import.meta.url));
async function openReceiver(page){
 let socket;const sent=[];
 await page.routeWebSocket('wss://receiver.invalid/stream**',s=>{socket=s;s.onMessage(message=>sent.push(JSON.parse(message)));});
 await page.route('https://artwork.invalid/**',r=>r.fulfill({contentType:'image/png',body:png}));
 await page.goto('/session-receiver.html?broadcast_url=wss%3A%2F%2Freceiver.invalid%2Fstream&broadcast_token=fixture-only&session_id=fixture-session');
 await expect.poll(()=>Boolean(socket)).toBeTruthy();
 const update=artwork_url=>socket.send(JSON.stringify({type:'snapshot',capabilities:{audience_signals:true},snapshot:{session:{title:'Fixture session',selected_mood:'chill'},playback:{current_track:{title:'Fixture track',artist:'Fixture artist',artwork_url}},planner:{},session_flow:{items:[]},audience:{}}}));
 return {update,sent};
}
test('receiver rejects executable and malformed artwork without breaking Broadcast rendering',async({page})=>{
 const {update}=await openReceiver(page);
 for(const value of ['javascript:alert(1)','data:image/svg+xml,<svg onload="alert(1)"/>','vbscript:msgbox(1)','file:///private/fixture','http://[invalid]',{url:'https://artwork.invalid/image.png'},'https://user:password@artwork.invalid/image.png']){
  update(value);await expect(page.locator('#track')).toHaveText('Fixture track');await expect(page.locator('#art')).toBeHidden();expect(await page.locator('#art').getAttribute('src')).toBeNull();
 }
 update('https://artwork.invalid/image.png');await expect(page.locator('#art')).toHaveAttribute('src','https://artwork.invalid/image.png');await expect(page.locator('#art')).toBeVisible();
 update('javascript:alert(2)');await expect(page.locator('#art')).toBeHidden();expect(await page.locator('#art').getAttribute('src')).toBeNull();
});
test('receiver retains ordinary relative artwork and audience signal contract',async({page})=>{
 const {update,sent}=await openReceiver(page);update('/assets/brand/mark-32.png');
 await expect(page.locator('#art')).toBeVisible();await expect(page.locator('#art')).toHaveAttribute('src',/\/assets\/brand\/mark-32\.png$/);
 await page.getByRole('button',{name:'More Energy',exact:true}).click();await expect.poll(()=>sent).toEqual([{type:'audience_signal',signal:'more_energy'}]);
 await expect(page.locator('#title')).toHaveText('Fixture session');
});
