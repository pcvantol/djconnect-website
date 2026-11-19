import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isProtectedOperatorResponse as denied} from './helpers/operational-access.mjs';
const production='https://djconnect.dev';
const challenge='https://pcvantol.cloudflareaccess.com/cdn-cgi/access/login/djconnect.dev?state=opaque-test-state';
test('actual Access boundary is observed without interpreting the subsequent login page as operator access',()=>{
 for(const base of [production,'http://127.0.0.1:4191'])for(const status of [401,403])assert.equal(denied(status,undefined,base),true);
 assert.equal(denied(302,challenge,production),true);
 assert.equal(denied(200,challenge,production),false);
 assert.equal(denied(302,challenge,'http://127.0.0.1:4191'),false);
});
test('unexpected successful responses and spoofed or malformed challenges fail closed',()=>{
 for(const location of [undefined,'not a URL','//pcvantol.cloudflareaccess.com/cdn-cgi/access/login/djconnect.dev',challenge.replace('https:','http:'),challenge.replace('.com/','.com.evil.example/'),challenge.replace('pcvantol.','other.'),challenge.replace('/cdn-cgi/access/login/djconnect.dev','/operator'),challenge.replace('djconnect.dev?','other.example?'),challenge.replace('https://','https://user:password@'),challenge.replace('.com/','.com:444/')])assert.equal(denied(302,location,production),false);
 for(const base of ['http://djconnect.dev','https://djconnect.dev.evil.example','https://user:password@djconnect.dev'])assert.equal(denied(302,challenge,base),false);
 for(const status of [200,201,301,303,307,308,404,500])assert.equal(denied(status,challenge,production),false);
});
