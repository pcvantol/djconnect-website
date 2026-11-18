// Prototype: never emit response bodies, identifiers, exception text, or credentials.
const BASE = 'https://api.cloudflare.com/client/v4';
const UNAVAILABLE = 'POLICY_UNAVAILABLE';
export async function inspectPolicy({account, token, fetchImpl = fetch}) {
  if (!/^[a-f0-9]{32}$/.test(account ?? '') || !token) return UNAVAILABLE;
  const get = async path => {
    try {
      const response = await fetchImpl(BASE + path, {
        method: 'GET', headers: {Authorization: `Bearer ${token}`},
        redirect: 'error', signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data?.success === true && data.result && typeof data.result === 'object' ? data.result : null;
    } catch { return null; }
  };
  const routes = [
    [`/accounts/${account}/tokens/verify`, id => `/accounts/${account}/tokens/${id}`],
    ['/user/tokens/verify', id => `/user/tokens/${id}`]
  ];
  for (const [verify, detail] of routes) {
    const identity = await get(verify);
    if (identity?.status !== 'active' || !/^[a-f0-9]{32}$/.test(identity?.id ?? '')) continue;
    const policy = await get(detail(identity.id));
    if (!policy || !Array.isArray(policy.policies)) continue;
    // Presence alone cannot prove effective access: scope, denies and conditions matter.
    const present = policy.policies.some(p => p?.effect === 'allow' && Array.isArray(p.permission_groups) &&
      p.permission_groups.some(g => g?.name === 'Pages Write'));
    return present ? 'PAGES_WRITE_GROUP_PRESENT_SCOPE_UNVERIFIED' : 'PAGES_WRITE_NOT_ESTABLISHED';
  }
  return UNAVAILABLE;
}
