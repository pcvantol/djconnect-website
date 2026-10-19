import {readFile,readdir,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
export const archiveRoot='archive/legacy-website-2026-10-19';
export const originSHA='3133cb833c846395ac37dae804ba96848650bb7c';
export async function verifyArchive(){
 const inventory=JSON.parse(await readFile(archiveRoot+'/FILE_INVENTORY.json','utf8'));
 const paths=execFileSync('git',['ls-tree','-r','--name-only',originSHA],{encoding:'utf8'}).trim().split('\n').sort();
 if(JSON.stringify(paths)!==JSON.stringify(inventory.map(x=>x.path).sort()))throw Error('Archive coverage does not equal original Git tree');
 for(const f of inventory){
  if(f.path.startsWith('/')||f.path.split('/').includes('..'))throw Error('Unsafe archive path');
  const data=await readFile(archiveRoot+'/'+f.path);
  if(data.length!==f.bytes||createHash('sha256').update(data).digest('hex')!==f.sha256)throw Error('Archive mismatch: '+f.path);
 }
 console.log(`Archive PASS: ${inventory.length} files, exact pinned-tree coverage and SHA-256 bytes`);return inventory;
}
if(process.argv[1]?.endsWith('verify-archive.mjs'))await verifyArchive();
