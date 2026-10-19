import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist/wwwroot');const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};
export const server=http.createServer((req,res)=>{try{
 const url=new URL(req.url,'http://localhost');let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(404).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)&&fs.existsSync(file+'.html'))file+='.html';
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,{'content-type':'text/html'});res.end(fs.readFileSync(root+'/404.html'));return;}
 res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400).end();}});server.listen(Number(process.env.PORT||4173),'127.0.0.1');
