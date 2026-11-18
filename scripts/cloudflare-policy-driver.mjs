import {inspectPolicy} from './cloudflare-policy-readback.mjs';
import {reportPolicy} from './cloudflare-policy-output.mjs';

await reportPolicy(inspectPolicy, process.env, value => console.log(value));
