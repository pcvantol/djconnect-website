// Pure adapter: inspector, environment and output are injected for tests.
export async function reportPolicy(inspector, env, emit) {
  const allowed = new Set(['POLICY_UNAVAILABLE', 'PAGES_WRITE_NOT_ESTABLISHED', 'PAGES_WRITE_GROUP_PRESENT_SCOPE_UNVERIFIED']);
  try {
    const result = await inspector({account: env.CLOUDFLARE_ACCOUNT_ID, token: env.CLOUDFLARE_API_TOKEN});
    emit(allowed.has(result) ? result : 'POLICY_UNAVAILABLE');
  } catch {
    emit('POLICY_UNAVAILABLE');
  }
}
