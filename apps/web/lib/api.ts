import { messageFor } from './errors';
import { clearToken, getToken } from './session';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | undefined,
    message: string,
  ) {
    super(message);
  }
}

interface Options {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** false pour les routes publiques (inscription, connexion…). */
  auth?: boolean;
  /** Appel d'arrière-plan (événements) : un 401 ne redirige pas l'enfant hors de sa lecture. */
  silent?: boolean;
}

export async function api<T>(
  path: string,
  { method = 'GET', body, auth = true, silent = false }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = { accept: 'application/json' };
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'NETWORK', messageFor('NETWORK'));
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (res.ok) return data as T;

  const problem = (data ?? {}) as {
    code?: string;
    title?: string;
    errors?: Record<string, string[]>;
  };
  if (res.status === 401 && auth && !silent) {
    clearToken();
    if (!window.location.pathname.startsWith('/connexion')) {
      window.location.assign('/connexion?expire=1');
    }
  }
  if (res.status === 429) throw new ApiError(429, 'RATE_LIMITED', messageFor('RATE_LIMITED'));
  if (res.status === 422 && problem.errors) {
    const first = Object.values(problem.errors)[0]?.[0];
    throw new ApiError(422, 'VALIDATION', first ?? messageFor('VALIDATION'));
  }
  throw new ApiError(res.status, problem.code, messageFor(problem.code, problem.title));
}

export function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : messageFor(undefined);
}
