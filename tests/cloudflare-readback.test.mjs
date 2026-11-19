import test from 'node:test';import assert from 'node:assert/strict';
import {redactProject,requireProduction,requireManualPublishing} from '../scripts/cloudflare-readback.mjs';
const sha='a'.repeat(40);
const project=()=>({name:'djconnect',production_branch:'main',env_vars:{TOKEN:{value:'PRIVATE_SECRET'}},canonical_deployment:{id:'production-id',url:'https://production.djconnect.pages.dev',environment:'production',created_on:'2026-10-19',env_vars:{KEY:'PRIVATE_SECRET'},build_config:{web_analytics_token:'PRIVATE_SECRET'},deployment_trigger:{metadata:{branch:'main',commit_hash:sha,commit_message:'PRIVATE_SECRET'}},latest_stage:{status:'success'}},latest_deployment:{id:'preview-id',environment:'preview'}});
test('Pages receipt whitelists identity and never serializes configuration, credentials or commit text',()=>{
 const receipt=redactProject(project());assert.equal(receipt.deployment.id,'production-id');assert.ok(!JSON.stringify(receipt).includes('PRIVATE_SECRET'));assert.deepEqual(Object.keys(receipt.deployment),['id','url','environment','branch','commit_hash','status','created_on']);assert.equal(requireProduction(receipt,sha),receipt);
});
test('Canonical production identity rejects preview, failed, missing, wrong project/branch/SHA instead of accepting latest preview',()=>{
 for(const mutate of [p=>p.name='other',p=>p.production_branch='other',p=>p.canonical_deployment=null,p=>p.canonical_deployment.environment='preview',p=>p.canonical_deployment.latest_stage.status='failure',p=>p.canonical_deployment.deployment_trigger.metadata.branch='other',p=>p.canonical_deployment.deployment_trigger.metadata.commit_hash='b'.repeat(40)]){const p=project();mutate(p);assert.throws(()=>requireProduction(redactProject(p),sha));}
 assert.throws(()=>requireProduction(redactProject(project()),'not-a-sha'));
 // Legacy live deployment may have no Git metadata; it remains an explicit rollback identity, never the new candidate.
 const p=project();p.canonical_deployment.deployment_trigger={};assert.equal(requireProduction(redactProject(p)).deployment.id,'production-id');assert.throws(()=>requireProduction(redactProject(p),sha));
});

 test('automatic production publication fails closed without exposing project configuration',()=>{
  assert.doesNotThrow(()=>requireManualPublishing(redactProject(project())));
  for(const source of [{},{type:null},{type:'unknown',config:{production_deployments_enabled:false}}])assert.throws(()=>requireManualPublishing(redactProject({...project(),source})));
  for(const config of [{production_deployments_enabled:true},{}, {production_deployments_enabled:null}]){
   assert.throws(()=>requireManualPublishing(redactProject({...project(),source:{type:'github',config}})));
  }
  for(const config of [{production_deployments_enabled:false},{deployments_enabled:false}]){
   assert.doesNotThrow(()=>requireManualPublishing(redactProject({...project(),source:{type:'github',config}})));
  }
 });
