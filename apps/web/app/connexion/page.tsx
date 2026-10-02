'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { Alert, Shell } from '@/components/Shell';
import { api, errorMessage } from '@/lib/api';
import { setToken } from '@/lib/session';

function LoginForm() {
  const router = useRouter();
  const expired = useSearchParams().get('expire') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: { email, password, deviceName: 'natanga-web' },
        auth: false,
      });
      setToken(res.token);
      router.push('/parent');
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <form className="card stack" onSubmit={submit}>
      {expired && <Alert>Votre session a expiré. Merci de vous reconnecter.</Alert>}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" autoComplete="current-password" required value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <Alert>{error}</Alert>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Shell>
      <div className="narrow stack">
        <h1>Connexion parent</h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p>
          Pas encore de compte ? <Link href="/inscription">Créer un compte</Link>
        </p>
      </div>
    </Shell>
  );
}
