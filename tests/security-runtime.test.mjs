import test from 'node:test';import assert from 'node:assert/strict';
import {onRequest} from '../functions/_middleware.js';
import {onRequestGet as stats} from '../functions/api/stats.js';
import {onRequestGet as registrations} from '../functions/api/operator/registrations.js';
import {onRequestPost as revoke} from '../functions/api/operator/install-token/revoke.js';
import {onRequestGet as download} from '../functions/go/download.js';
const ctx=(url,env={},headers={})=>({request:new Request('https://djconnect.dev'+url,{headers}),env,next:()=>new Response('next')});
test('operator middleware fails closed for every operator path',async()=>{
 for(const url of ['/operator','/operator.html','/api/operator/registrations','/api/operator/install-token/revoke']){
  assert.equal((await onRequest(ctx(url))).status,403);
  assert.equal((await onRequest(ctx(url,{CLOUDFLARE_ACCESS_TEAM_DOMAIN:'invalid.example',CLOUDFLARE_ACCESS_AUD:'test'}))).status,401);
  assert.equal((await onRequest(ctx(url,{CLOUDFLARE_ACCESS_TEAM_DOMAIN:'invalid.example',CLOUDFLARE_ACCESS_AUD:'test'},{'Cf-Access-Jwt-Assertion':'invalid'}))).status,403);
 }
 assert.equal(await (await onRequest(ctx('/'))).text(),'next');
});
test('stats is unavailable without configured and matching token',async()=>{assert.equal((await stats(ctx('/api/stats'))).status,404);assert.equal((await stats(ctx('/api/stats',{STATS_TOKEN:'fixture-only'}))).status,404);});
test('download redirects reject unapproved destinations and repositories',async()=>{for(const url of ['/go/download?url=https://evil.example/file','/go/download?repo=foreign&url=https://github.com/foreign/releases/file'])assert.equal((await download(ctx(url))).status,400);});
test('operator proxies validate inputs before any network operation',async()=>{
 assert.equal((await registrations(ctx('/api/operator/registrations'))).status,500);
 for(const query of ['limit=0','offset=-1','client_type=windows','ha_install_id=djci_fixture'])assert.equal((await registrations(ctx('/api/operator/registrations?'+query,{DJCONNECT_RELAY_SECRET:'fixture-only'}))).status,400);
 assert.equal((await revoke({request:new Request('https://djconnect.dev/api/operator/install-token/revoke',{method:'POST',body:'{}'}),env:{DJCONNECT_RELAY_SECRET:'fixture-only'}})).status,400);
});
test('revoke proxy preserves exact contract, revoked-0 and redacted API errors',async()=>{
 const old=globalThis.fetch;try{
  const make=()=>({request:new Request('https://djconnect.dev/api/operator/install-token/revoke',{method:'POST',body:JSON.stringify({ha_install_id:'fixture-install',token_id:'fixture-id',reason:'operator-disabled-requested'})}),env:{DJCONNECT_RELAY_SECRET:'fixture-only'}});
  globalThis.fetch=async(url,init)=>{assert.equal(url,'https://api.djconnect.dev/v1/operator/install-token/revoke');assert.equal(init.headers.Authorization,'Bearer fixture-only');return Response.json({ok:true,revoked:0});};
  assert.deepEqual(await (await revoke(make())).json(),{ok:true,revoked:0});
  for(const status of [401,403]){globalThis.fetch=async()=>Response.json({error:'djci_fixture_secret Bearer fixture_secret'},{status});const response=await revoke(make());assert.equal(response.status,status);const body=await response.text();assert.ok(!body.includes('fixture_secret'));assert.ok(body.includes('[redacted]'));}
 }finally{globalThis.fetch=old;}
});
