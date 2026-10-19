import test from 'node:test';import assert from 'node:assert/strict';import {readFile,readdir,access,mkdtemp,writeFile,rm,cp} from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';import {tmpdir} from 'node:os';import path from 'node:path';
import {verifyArchive,archiveRoot} from '../scripts/verify-archive.mjs';import {catalog,languages,keys} from '../src/locales/catalog.mjs';import {pages,route} from '../src/pages/registry.mjs';import {SiteLayout} from '../src/layouts/SiteLayout.mjs';import {sections} from '../src/layouts/sections.mjs';
const read=p=>readFile(p,'utf8');
test('archive has complete pinned-tree coverage, exact hashes and reconstructs',async()=>{const rows=await verifyArchive();const dir=await mkdtemp(path.join(tmpdir(),'djc-restore-'));try{for(const row of rows){const out=path.join(dir,row.path);await import('node:fs/promises').then(x=>x.mkdir(path.dirname(out),{recursive:true}));await cp(archiveRoot+'/'+row.path,out);}assert.equal(createHash('sha256').update(await readFile(dir+'/wwwroot/index.html')).digest('hex'),rows.find(x=>x.path==='wwwroot/index.html').sha256);assert.equal(JSON.parse(await read(dir+'/package.json')).version,'3.3.1');execFileSync(process.execPath,['scripts/build-release.mjs'],{cwd:dir,stdio:'pipe'});assert.ok((await read(dir+'/dist/wwwroot/index.html')).includes('DJConnect')); }finally{await rm(dir,{recursive:true,force:true});}});
test('five complete catalogs, static metadata and working internal links',async()=>{
 for(const locale of languages){assert.deepEqual(Object.keys(catalog[locale]),keys);for(const page of Object.values(pages)){
  const file='wwwroot'+(page.slug?route(locale,page.slug)+'.html':route(locale)+'index.html');const html=await read(file);assert.match(html,new RegExp(`<html lang="${locale}"`));assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.equal((html.match(/rel="alternate" hreflang=/g)||[]).length,6);assert.ok(html.includes('https://djconnect.dev'+route(locale,page.slug)));
  for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(!ref.startsWith('/')||ref.startsWith('/go/'))continue;const pathname=ref.split(/[?#]/)[0];let target='wwwroot'+pathname;if(pathname.endsWith('/'))target+='index.html';else if(!path.extname(pathname))target+='.html';await access(target);}
 }}
 const sitemap=await read('wwwroot/sitemap.xml');assert.equal((sitemap.match(/<loc>/g)||[]).length,20);
});
test('central tokens and page composition propagate without duplicated templates',async()=>{
 const css=await read('src/design/tokens.css'),style=await read('src/design/site.css');for(const key of ['--color-primary','--font-display','--glass-background','--glass-blur','--space-section','--radius-card'])assert.ok(css.includes(key)&&(style+css).includes(`var(${key})`));
 const t={...catalog.en,'support.title':'<probe & reusable>'};const c={locale:'en',t,slug:'support',page:pages.support,version:'3.3.1'};const html=SiteLayout(c,sections.support(c));assert.ok(html.includes('&lt;probe &amp; reusable&gt;'));assert.ok(!html.includes('<probe & reusable>'));assert.ok(html.includes('/en/privacy'));
 // Real alternate page from the shared registry uses the exact shell and tokens.
 assert.ok((await read('wwwroot/en/start.html')).includes('/assets/tokens.css'));
});
test('archive and originals never enter publication; operational sources remain byte identical',async()=>{
 const walk=async d=>{let out=[];for(const e of await readdir(d,{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())out.push(...await walk(p));else out.push(p);}return out;};
 const out=await walk('dist/wwwroot');assert.ok(out.length>20);assert.ok(!out.some(p=>/archive|legacy|original|manifest.json|package.json|node_modules/.test(p)));
 for(const p of (await walk('functions')).concat(await walk('migrations'))){assert.deepEqual(await readFile(p),await readFile(archiveRoot+'/'+p));}
 for(const p of await walk('src/operational/release-notes')){const rel=p.replace('src/operational/','');assert.deepEqual(await readFile('dist/wwwroot/'+rel),await readFile(archiveRoot+'/wwwroot/'+rel));}
});
test('brand master matches exact owner approved bytes',async()=>{assert.equal(createHash('sha256').update(await readFile('src/assets/brand/approved-master.png')).digest('hex'),'f05fcdf4602d9c63add7799469c64060a8f13e5efa66ad6c7b762fb8273ec89f');});
test('canonical imported brand variants match pinned producer manifest',async()=>{
 const manifest=JSON.parse(await read('src/assets/brand/core-manifest.json'));
 for(const name of ['glass-master.png','headset-master.png','mark-16.png','mark-32.png','mark-40.png','mark-64.png','mark-128.png','mark-256.png','mark-512.png','wordmark-compact-dark.png','wordmark-primary-dark.png']){
  const bytes=await readFile('src/assets/brand/'+name);assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.files['assets/djconnect/brand-v2/'+name].sha256);
 }
 const html=await read('wwwroot/index.html');assert.ok(html.includes('/assets/brand/wordmark-compact-dark.png'));assert.ok(html.includes('/assets/brand/mark-32.png'));assert.ok(!html.includes('approved-master.png'));
});
