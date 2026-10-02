'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Alert, Shell } from '@/components/Shell';
import { api, errorMessage } from '@/lib/api';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api('/auth/register', { method: 'POST', body: { email, password }, auth: false });
      setSentTo(email);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!sentTo) return;
    setInfo(null);
    try {
      await api('/auth/resend-verification', {
        method: 'POST',
        body: { email: sentTo },
        auth: false,
      });
      setInfo('Un nouveau lien vient de vous être envoyé.');
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <Shell>
      <div className="narrow stack">
        {sentTo ? (
          <>
            <h1>Vérifiez votre boîte email</h1>
            <p>
              Nous avons envoyé un lien de confirmation à <strong>{sentTo}</strong>. Cliquez dessus
              pour activer votre compte (pensez à regarder dans les spams).
            </p>
            {info && <Alert ok>{info}</Alert>}
            {error && <Alert>{error}</Alert>}
            <button type="button" className="btn btn-ghost" onClick={resend}>
              Renvoyer le lien
            </button>
          </>
        ) : (
          <>
            <h1>Créer un compte parent</h1>
            <p className="muted">
              Le compte est celui du parent. Vous ajouterez ensuite le profil de votre enfant.
            </p>
            <form className="card stack" onSubmit={submit} noValidate={false}>
              <div className="field">
                <label htmlFor="email">Votre email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  aria-describedby="password-hint"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p id="password-hint" className="hint">
                  8 caractères minimum.
                </p>
              </div>
              {error && <Alert>{error}</Alert>}
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Création…' : 'Créer mon compte'}
              </button>
            </form>
            <p>
              Déjà inscrit ? <Link href="/connexion">Se connecter</Link>
            </p>
          </>
        )}
      </div>
    </Shell>
  );
}
