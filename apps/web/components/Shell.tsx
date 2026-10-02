'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { isParentUnlocked, lockParent, newChallenge, unlockParent } from '@/lib/parentGate';
import { clearToken, getToken } from '@/lib/session';

/** Question posée avant l'espace parent (l'enfant utilise le même appareil). */
function ParentGate({ onUnlock }: { onUnlock: () => void }) {
  const [challenge, setChallenge] = useState<ReturnType<typeof newChallenge> | null>(null);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  useEffect(() => setChallenge(newChallenge()), []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (challenge && Number(value) === challenge.answer) {
      unlockParent();
      onUnlock();
    } else {
      setWrong(true);
      setValue('');
      setChallenge(newChallenge());
    }
  }

  if (!challenge) return null;
  return (
    <div className="narrow stack">
      <h1>Espace réservé aux parents</h1>
      <form className="card stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="gate">
            Combien font {challenge.a} × {challenge.b} ?
          </label>
          <input
            id="gate"
            inputMode="numeric"
            autoComplete="off"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        {wrong && <p role="alert">Ce n&apos;est pas la bonne réponse. Voici une autre question.</p>}
        <button type="submit" className="btn btn-primary">
          Entrer
        </button>
      </form>
    </div>
  );
}

/**
 * En-tête + zone principale. `requireAuth` renvoie vers /connexion sans jeton ;
 * `parentOnly` exige la barrière parentale ; `childMode` la reverrouille (écrans enfant).
 */
export function Shell({
  children,
  requireAuth = false,
  parentOnly = false,
  childMode = false,
}: {
  children: ReactNode;
  requireAuth?: boolean;
  parentOnly?: boolean;
  childMode?: boolean;
}) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const has = getToken() !== null;
    setAuthed(has);
    if (requireAuth && !has) router.replace('/connexion');
    if (childMode) lockParent();
    setUnlocked(isParentUnlocked());
  }, [requireAuth, childMode, router]);

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
              {!childMode && (
                <button type="button" className="btn btn-ghost" onClick={logout}>
                  Se déconnecter
                </button>
              )}
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
        {requireAuth && !authed ? (
          <p className="muted">Chargement…</p>
        ) : parentOnly && !unlocked ? (
          <ParentGate onUnlock={() => setUnlocked(true)} />
        ) : (
          children
        )}
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
