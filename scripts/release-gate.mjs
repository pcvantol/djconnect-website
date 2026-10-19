import {readFile} from 'node:fs/promises';
const gates=JSON.parse(await readFile('docs/website-v2/release-gates.json','utf8'));
const open=Object.entries(gates).filter(([k,v])=>v.status!=='PASS');
if(open.length){for(const [key,v] of open)console.error(`${key}: ${v.status} — ${v.evidence}`);process.exitCode=1;}else console.log('All internal publication acceptance gates PASS');
