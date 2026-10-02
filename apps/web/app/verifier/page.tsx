'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Alert, Shell } from '@/components/Shell';
import { api, errorMessage } from '@/lib/api';

function Verify() {
  const token = useSearchParams().get('token');
  const [state, setState] = useState<'pending' | 'ok' | 'error'>('pending');
  const [error, setError] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // le token est à usage unique (StrictMode monte 2 fois)
    started.current = true;
    if (!token) {
      setState('error');
      setError('Lien incomplet. Ouvrez le lien reçu par email.');
      return;
    }
    api('/auth/verify-email', { method: 'POST', body: { token }, auth: false })
      .then(() => setState('ok'))
      .catch((err) => {
        setState('error');
        setError(errorMessage(err));
      });
  }, [token]);

  if (state === 'pending') return <p role="status">Vérification en cours…</p>;
  if (state === 'error')
    return (
      <>
        <Alert>{error}</Alert>
        <p>
          <Link href="/inscription">Recommencer l&apos;inscription</Link> ou{' '}
          <Link href="/connexion">se connecter</Link>.
        </p>
      </>
    );
  return (
    <>
      <Alert ok>Votre adresse est confirmée. Bienvenue !</Alert>
      <Link href="/connexion" className="btn btn-primary">
        Se connecter
      </Link>
    </>
  );
}

export default function VerifyPage() {
  return (
    <Shell>
      <div className="narrow stack">
        <h1>Confirmation de votre email</h1>
        <Suspense fallback={<p>Chargement…</p>}>
          <Verify />
        </Suspense>
      </div>
    </Shell>
  );
}
