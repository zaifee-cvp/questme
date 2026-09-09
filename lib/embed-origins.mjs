/**
 * The origins allowed to frame the public chat widget — the portfolio's own
 * product domains, apex and www.
 *
 * Single source of truth. next.config.mjs turns this into the
 * `frame-ancestors` directive for /chat/*; nothing else should hardcode a
 * framing origin. `.mjs` rather than `.ts` because next.config.mjs has to
 * import it at config-load time and Next 14 cannot load TypeScript there
 * (next.config.ts landed in Next 15). tsconfig has allowJs, so app code can
 * import this module too if it ever needs the list.
 *
 * Each entry is a full origin: scheme + host, no path, no trailing slash, no
 * wildcards. A bare host would be read as a scheme-relative source and an
 * apex entry does NOT cover its www subdomain, which is why both are listed.
 */
export const EMBED_ALLOWED_ORIGINS = [
  'https://fieldsign.io',
  'https://www.fieldsign.io',
  'https://dentalys.ai',
  'https://www.dentalys.ai',
  'https://receptys.ai',
  'https://www.receptys.ai',
  'https://callys.ai',
  'https://www.callys.ai',
  'https://jurisly.ai',
  'https://www.jurisly.ai',
  'https://replily.ai',
  'https://www.replily.ai',
  'https://watchpage.ai',
  'https://www.watchpage.ai',
  'https://cvidspro.com',
  'https://www.cvidspro.com',
  'https://questme.ai',
]
