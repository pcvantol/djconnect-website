import {test,expect} from '@playwright/test';
// Run against the actual local workerd bundle or non-destructive live routes.
test('compiled Pages worker preserves protected operator/API and download routes',async({request})=>{
 const base=process.env.OPERATIONAL_BASE_URL;if(!base){test.skip(true,'Operational bundle is tested in the dedicated workerd CI/local step');return;}
 for(const url of ['/operator','/operator.html','/api/operator/registrations']){
  const response=await request.get(base+url);expect([401,403]).toContain(response.status());
 }
 expect((await request.get(base+'/api/stats')).status()).toBe(404);
 expect((await request.get(base+'/go/unknown-target')).status()).toBe(404);
 const download=await request.get(base+'/go/download?repo=foreign&url=https://evil.example/file');expect(download.status()).toBe(400);
 const hacs=await request.get(base+'/go/hacs',{maxRedirects:0});expect(hacs.status()).toBe(302);expect(hacs.headers().location).toContain('my.home-assistant.io/redirect/hacs_repository/');
 const feed=await request.get(base+'/release-notes/ios/latest.json');expect(feed.status()).toBe(200);expect(await feed.json()).toHaveProperty('version');
 expect((await request.get(base+'/archive/legacy-website-2026-10-19/wwwroot/index.html')).status()).toBe(404);
});
