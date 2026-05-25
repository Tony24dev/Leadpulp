// Zero-dependency Upstash Redis client via REST API.
// No npm package needed — uses native fetch (Node 18+).
const base  = () => process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
const token = () => process.env.UPSTASH_REDIS_REST_TOKEN;

async function cmd(...args) {
  const path = args.map(a => encodeURIComponent(String(a))).join('/');
  const res  = await fetch(`${base()}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}` },
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.result; // "OK" | string | null
}

export const redis = {
  get: (key)               => cmd('GET', key),
  set: (key, value, opts = {}) => {
    const args = ['SET', key, value];
    if (opts.nx) args.push('NX');
    if (opts.ex) args.push('EX', opts.ex);
    return cmd(...args);
  },
};
