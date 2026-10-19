import {execFileSync} from 'node:child_process';
import {cp,mkdir,rm,readdir,lstat,readFile} from 'node:fs/promises';
import {pages,route} from '../src/pages/registry.mjs';
import {languages} from '../src/locales/catalog.mjs';
const allowedPages=new Set(['404.html','operator.html','session-receiver.html',...languages.flatMap(l=>Object.values(pages).map(p=>(p.slug?route(l,p.slug)+'.html':route(l)+'index.html').slice(1)))]);
const source='wwwroot',dest='dist/wwwroot',lock=dest+'.lock';
await mkdir('dist',{recursive:true});await mkdir(lock);
try {
 const inspect=async(dir)=>{for(const e of await readdir(dir,{withFileTypes:true})){
  const p=dir+'/'+e.name;if((await lstat(p)).isSymbolicLink())throw Error(`Symlink forbidden: ${p}`);
  if(/archive|legacy|node_modules|\.git/.test(e.name))throw Error(`Private source in public tree: ${p}`);
  if(e.isDirectory())await inspect(p);else {const rel=p.slice(source.length+1);if(!allowedPages.has(rel)&&!['robots.txt','sitemap.xml','_headers','_redirects','build.json'].includes(rel)&&!/^release-notes\/(?:[^/]+\/)*(?:[^/]+)\.(json|md)$/.test(rel)&&!/^assets\/(?:brand\/(?:mark-\d+|wordmark-compact-dark)\.png|artwork\/(?:hero|vibe|moment|cast)-(?:480|800|1280)\.webp|social-(?:nl|en|de|fr|es)\.png|(?:tokens|site|admin)\.(?:css|js))$/.test(rel))throw Error('Unexpected public file: '+rel);}
 }};await inspect(source);
 await rm(dest,{recursive:true,force:true});await cp(source,dest,{recursive:true});
 execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','pages','functions','build','functions','--outdir',dest+'/_worker.js','--output-routes-path',dest+'/_routes.json','--minify'],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
 const a=JSON.parse(await readFile(dest+'/build.json'));console.log(`Built isolated website release ${a.version}: ${dest}`);
} finally {await rm(lock,{recursive:true,force:true});}
