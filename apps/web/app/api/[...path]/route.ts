/**
 * Proxy same-origin vers l'API Laravel : le navigateur n'appelle que `/api/*`
 * (pas de CORS) et l'URL du backend est lue À L'EXÉCUTION (`API_URL`), ce qui
 * permet d'utiliser la même image Docker dans tous les environnements.
 */
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const FORWARDED_REQUEST_HEADERS = ['authorization', 'content-type', 'accept', 'user-agent'];

function backendUrl(): string {
  return (process.env.API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
}

async function forward(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const target = `${backendUrl()}/api/${path.map(encodeURIComponent).join('/')}${req.nextUrl.search}`;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('accept', 'application/json');
  const clientIp = req.headers.get('x-forwarded-for');
  if (clientIp) headers.set('x-forwarded-for', clientIp);

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: 'no-store',
      redirect: 'manual',
    });
  } catch {
    return Response.json(
      { type: 'about:blank', title: 'service indisponible', status: 502, code: 'ERR_UPSTREAM' },
      { status: 502 },
    );
  }

  const out = new Headers();
  for (const name of ['content-type', 'retry-after']) {
    const value = upstream.headers.get(name);
    if (value) out.set(name, value);
  }
  out.set('cache-control', 'no-store');
  const body = upstream.status === 204 ? null : await upstream.arrayBuffer();
  return new Response(body, { status: upstream.status, headers: out });
}

export { forward as GET, forward as POST, forward as PATCH, forward as PUT, forward as DELETE };
