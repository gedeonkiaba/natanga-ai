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
  // La documentation Swagger de l'API n'est pas publiée par le client web.
  if (path[0] === 'documentation' || path[0] === 'docs') {
    return Response.json(
      { type: 'about:blank', title: 'ressource introuvable', status: 404, code: 'ERR_NOT_FOUND' },
      { status: 404 },
    );
  }
  const target = `${backendUrl()}/api/${path.map(encodeURIComponent).join('/')}${req.nextUrl.search}`;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('accept', 'application/json');
  // IP du parent pour le throttle de l'API. Jamais l'X-Forwarded-For reçu (falsifiable
  // par le navigateur) : uniquement l'en-tête posé — et écrasé — par NOTRE reverse proxy
  // (Caddy : X-Real-IP, cf. deploy/Caddyfile), désigné par CLIENT_IP_HEADER.
  const ipHeader = process.env.CLIENT_IP_HEADER?.toLowerCase();
  const clientIp = ipHeader ? req.headers.get(ipHeader)?.split(',')[0]?.trim() : undefined;
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
