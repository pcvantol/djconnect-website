import {execFileSync} from 'node:child_process';
export function buildIdentity({cwd=process.cwd(),expectedSha=process.env.WEBSITE_BUILD_SHA,ci=Boolean(process.env.CI)}={}){
 let commit=null,source_dirty=null;
 try{
  commit=execFileSync('git',['rev-parse','HEAD'],{cwd,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
  source_dirty=Boolean(execFileSync('git',['status','--porcelain','--untracked-files=normal'],{cwd,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim());
 }catch{if(ci||expectedSha)throw Error('Qualified build requires actual Git checkout identity');}
 if(expectedSha&&(!/^[0-9a-f]{40}$/.test(expectedSha)||commit!==expectedSha))throw Error('Checked-out source does not match requested website build SHA');
 if(ci&&source_dirty!==false)throw Error('Qualified build requires clean source inputs');
 return {commit,source_dirty};
}
