import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inspectPolicy} from '../scripts/cloudflare-policy-readback.mjs';
const account='a'.repeat(32), token='SECRET_CANARY', id='b'.repeat(32);
const good = result => ({ok:true,json:async()=>({success:true,result})});
const denied = {ok:false,json:async()=>{throw Error(token)}};
function fake(sequence, calls) { return async (url, options) => { calls.push({url,options}); const item=sequence.shift(); if(item instanceof Error) throw item; return item ?? denied; }; }
test('read-only requests and bounded result',async()=>{
 const calls=[]; const result=await inspectPolicy({account,token,fetchImpl:fake([good({id,status:'active'}),good({policies:[{effect:'allow',permission_groups:[{name:'Pages Write'}]}]})],calls)});
 assert.equal(result,'PAGES_WRITE_GROUP_PRESENT_SCOPE_UNVERIFIED'); assert.ok(calls.every(c=>c.options.method==='GET' && c.options.redirect==='error')); assert.ok(!JSON.stringify(result).includes(token));
});
test('denied and thrown errors expose no secrets',async()=>{
 const result=await inspectPolicy({account,token,fetchImpl:fake([denied,new Error(token)],[])});
 assert.equal(result,'POLICY_UNAVAILABLE'); assert.ok(!JSON.stringify(result).includes(token));
});
test('malformed, inactive and invalid identifiers fail closed',async()=>{
 for(const x of [{id:'bad',status:'active'},{id,status:'disabled'},null]) {
  assert.equal(await inspectPolicy({account,token,fetchImpl:fake([good(x),denied],[])}),'POLICY_UNAVAILABLE');
 }
});
test('deny and missing permission do not establish write',async()=>{
 for(const p of [[{effect:'deny',permission_groups:[{name:'Pages Write'}]}],[]]) {
  assert.equal(await inspectPolicy({account,token,fetchImpl:fake([good({id,status:'active'}),good({policies:p})],[])}),'PAGES_WRITE_NOT_ESTABLISHED');
 }
});
test('scope or conflicting deny never produces effective-access claim',async()=>{
 const policies=[{effect:'allow',resources:{'wrong-account':'*'},permission_groups:[{name:'Pages Write'}]},{effect:'deny',resources:{'*':'*'},permission_groups:[{name:'Pages Write'}]}];
 assert.equal(await inspectPolicy({account,token,fetchImpl:fake([good({id,status:'active'}),good({policies})],[])}),'PAGES_WRITE_GROUP_PRESENT_SCOPE_UNVERIFIED');
});
