// Read-only Pages identity receipt. Never persist the project response: it can contain secrets.
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
export function redactProject(project){
 const d=project.canonical_deployment, m=d?.deployment_trigger?.metadata;
 return {schema_version:1,project:project.name,production_branch:project.production_branch,
  publishing:{source_type:project.source==null?'direct_upload':(project.source.type??'unknown'),production_deployments_enabled:project.source?.config?.production_deployments_enabled??null,deployments_enabled:project.source?.config?.deployments_enabled??null},
  deployment:d?{id:d.id,url:d.url,environment:d.environment,branch:m?.branch??null,
   commit_hash:m?.commit_hash??null,status:d.latest_stage?.status??null,created_on:d.created_on}:null};
}
export function requireManualPublishing(snapshot){
 const p=snapshot.publishing;
 if(!p||!['direct_upload','github','gitlab'].includes(p.source_type)||(p.source_type!=='direct_upload'&&p.production_deployments_enabled!==false&&p.deployments_enabled!==false))throw Error('Automatic production publication is not demonstrably disabled');
 return snapshot;
}
export function requireProduction(snapshot,expectedSha){
 const d=snapshot.deployment;
 if(snapshot.project!=='djconnect'||snapshot.production_branch!=='main'||!d?.id||d.environment!=='production'||d.status!=='success')throw Error('Canonical production deployment identity unavailable');
 if(expectedSha&&(!/^[0-9a-f]{40}$/.test(expectedSha)||d.commit_hash!==expectedSha||d.branch!=='main'))throw Error('Canonical production SHA does not match qualified candidate');
 return snapshot;
}
async function main(){
 const [output,expectedSha]=process.argv.slice(2);
 if(!output)throw Error('Receipt output path required');
 const account=process.env.CLOUDFLARE_ACCOUNT_ID,token=process.env.CLOUDFLARE_API_TOKEN;
 if(!account||!token)throw Error('Cloudflare configuration unavailable');
 const attempts=expectedSha?12:1;
 for(let attempt=0;attempt<attempts;attempt++){
  const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/pages/projects/djconnect`,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error(`Cloudflare project identity request failed: HTTP ${response.status}`);
  const payload=await response.json();
  if(payload.success!==true||!payload.result)throw Error('Cloudflare project identity response invalid');
  const snapshot=redactProject(payload.result);
  try{requireProduction(snapshot,expectedSha);}catch(error){
   if(attempt===attempts-1)throw error;
   await new Promise(resolve=>setTimeout(resolve,5000));continue;
  }
  await writeFile(output,JSON.stringify({...snapshot,observed_at:new Date().toISOString()},null,2)+'\n');
  requireManualPublishing(snapshot);
  console.log('Redacted canonical Cloudflare production identity and manual publication boundary recorded');return;
 }
}
if(import.meta.url===pathToFileURL(resolve(process.argv[1]??'')).href)await main().catch(()=>{console.error('Cloudflare production identity verification failed; no secret response retained');process.exitCode=1;});
