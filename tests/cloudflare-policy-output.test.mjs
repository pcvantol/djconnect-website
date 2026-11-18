import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reportPolicy} from '../scripts/cloudflare-policy-output.mjs';

test('mock output never reveals token, response or exception', async () => {
  const canary = 'CANARY_SECRET_NOT_FOR_OUTPUT';
  const env = {CLOUDFLARE_API_TOKEN: canary, CLOUDFLARE_ACCOUNT_ID: canary};
  for (const inspector of [async () => canary, async () => {throw Error(canary);}, async () => 'PAGES_WRITE_GROUP_PRESENT_SCOPE_UNVERIFIED']) {
    const out = [];
    await reportPolicy(inspector, env, value => out.push(value));
    assert.equal(out.length, 1);
    assert.equal(out[0].includes(canary), false);
    assert.ok(['POLICY_UNAVAILABLE', 'PAGES_WRITE_GROUP_PRESENT_SCOPE_UNVERIFIED'].includes(out[0]));
  }
});
