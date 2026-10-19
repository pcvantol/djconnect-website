import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {buildIdentity} from '../scripts/build-identity.mjs';
test('release identity comes from actual checkout despite unrelated workflow-event SHA; mismatch and dirty source fail closed',async()=>{
 const cwd=await mkdtemp(path.join(tmpdir(),'djc-identity-'));const git=(...args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();const old=process.env.GITHUB_SHA;
 try{
  git('init','-q');await writeFile(path.join(cwd,'source.txt'),'qualified');git('add','source.txt');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm','fixture');const sha=git('rev-parse','HEAD');process.env.GITHUB_SHA='f'.repeat(40);
  assert.deepEqual(buildIdentity({cwd,expectedSha:sha,ci:true}),{commit:sha,source_dirty:false});assert.throws(()=>buildIdentity({cwd,expectedSha:'0'.repeat(40),ci:true}));
  await writeFile(path.join(cwd,'source.txt'),'uncommitted');assert.throws(()=>buildIdentity({cwd,expectedSha:sha,ci:true}));assert.equal(buildIdentity({cwd,ci:false}).source_dirty,true);
 }finally{if(old===undefined)delete process.env.GITHUB_SHA;else process.env.GITHUB_SHA=old;await rm(cwd,{recursive:true,force:true});}
});
test('source export without Git cannot masquerade as a qualified CI build',async()=>{
 const cwd=await mkdtemp(path.join(tmpdir(),'djc-no-git-'));try{assert.deepEqual(buildIdentity({cwd,ci:false}),{commit:null,source_dirty:null});assert.throws(()=>buildIdentity({cwd,ci:true}));}finally{await rm(cwd,{recursive:true,force:true});}
});
