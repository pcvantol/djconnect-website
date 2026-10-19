import {mkdir,rm,copyFile,cp,readFile,writeFile,readdir,lstat} from 'node:fs/promises';
import path from 'node:path';
import {catalog,languages} from '../src/locales/catalog.mjs';
import {pages,route} from '../src/pages/registry.mjs';
import {sections} from '../src/layouts/sections.mjs';
import {SiteLayout} from '../src/layouts/SiteLayout.mjs';
import {Button,escape} from '../src/components/ui.mjs';
const version=(await readFile('VERSION','utf8')).trim();
if(!/^\d+\.\d+\.\d+$/.test(version))throw Error('Invalid VERSION');
const output='wwwroot';
// This tree is generated. Archive and working sources are never copied into it.
await rm(output,{recursive:true,force:true});await mkdir(output+'/assets/brand',{recursive:true});await mkdir(output+'/assets/artwork',{recursive:true});
const copy=(a,b)=>copyFile(a,output+'/'+b);
await copy('src/design/tokens.css','assets/tokens.css');await copy('src/design/site.css','assets/site.css');await copy('src/components/site.js','assets/site.js');
for(const name of await readdir('src/assets/brand'))if(/^mark-\d+\.png$/.test(name))await copy('src/assets/brand/'+name,'assets/brand/'+name);
for(const name of await readdir('src/assets/artwork'))if(/^(hero|vibe|moment|cast)-(480|800|1280)\.webp$/.test(name))await copy('src/assets/artwork/'+name,'assets/artwork/'+name);
for(const locale of languages){
 await copy(`src/assets/social-${locale}.png`,`assets/social-${locale}.png`);
 for(const page of Object.values(pages)){
  const c={locale,slug:page.slug,page,t:catalog[locale],version};
  const filename=page.slug?route(locale,page.slug)+'.html':route(locale)+'index.html';
  const out=path.join(output,filename);await mkdir(path.dirname(out),{recursive:true});
  await writeFile(out,SiteLayout(c,page.sections.map(name=>sections[name](c)).join(''))+'\n');
 }
}
// Operational contracts remain distinct from the marketing composition.
await cp('src/operational',output,{recursive:true});
const c={locale:'nl',slug:'',page:{title:'notFound.title',description:'notFound.description'},t:catalog.nl,version};
await writeFile(output+'/404.html',SiteLayout(c,`<article class="service-page"><h1>${escape(c.t['notFound.title'])}</h1><p class="lead">${escape(c.t['notFound.description'])}</p>${Button(c.t['notFound.cta'],'/')}</article>`,true));
const urls=languages.flatMap(l=>Object.values(pages).map(p=>'https://djconnect.dev'+route(l,p.slug)));
await writeFile(output+'/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>\n`);
await writeFile(output+'/robots.txt','User-agent: *\nAllow: /\nDisallow: /operator\nDisallow: /api/\nDisallow: /archive/\nSitemap: https://djconnect.dev/sitemap.xml\n');
// Preserve app-owned download entry URLs, replacing retired guides with brief onboarding.
const redirects=languages.flatMap(l=>['ios','macos','testflight','testflight-macos','platform','raspberry-pi','embedded'].flatMap(old=>[`${route(l,old)} ${route(l,'start')} 301`,`${route(l,old)}.html ${route(l,'start')} 301`]));
await writeFile(output+'/_redirects',redirects.join('\n')+'\n');
await writeFile(output+'/build.json',JSON.stringify({version,commit:process.env.GITHUB_SHA||null,locales:languages,pages:Object.keys(pages)},null,2)+'\n');
console.log(`Generated ${urls.length} static localized pages, version ${version}`);
