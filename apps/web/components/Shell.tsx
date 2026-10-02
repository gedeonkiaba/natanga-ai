'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { clearToken, getToken } from '@/lib/session';

/** En-tête + zone principale. `requireAuth` renvoie vers /connexion sans jeton. */
export function Shell({ children, requireAuth = false }: { children: ReactNode; requireAuth?: boolean }) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const has = getToken() !== null;
    setAuthed(has);
    if (requireAuth && !has) router.replace('/connexion');
  }, [requireAuth, router]);

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      /* le jeton local est effacé quoi qu'il arrive */
    }
    clearToken();
    router.push('/');
  }

  return (
    <>
      <header className="topbar">
        <nav className="topbar-inner" aria-label="Navigation principale">
          <Link href={authed ? '/parent' : '/'} className="brand">
            Natanga
          </Link>
          {authed ? (
            <>
              <Link href="/parent">Espace parent</Link>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Se déconnecter
              </button>
            </>
          ) : (
            authed === false && (
              <>
                <Link href="/connexion">Se connecter</Link>
                <Link href="/inscription" className="btn btn-primary">
                  Créer un compte
                </Link>
              </>
            )
          )}
        </nav>
      </header>
      <main id="contenu" className="container">
        {requireAuth && !authed ? <p className="muted">Chargement…</p> : children}
      </main>
    </>
  );
}

export function Alert({ children, ok = false }: { children: ReactNode; ok?: boolean }) {
  return (
    <div className={ok ? 'alert alert-ok' : 'alert'} role={ok ? 'status' : 'alert'}>
      {children}
    </div>
  );
}
