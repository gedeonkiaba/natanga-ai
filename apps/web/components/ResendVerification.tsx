'use client';

import { useState, type FormEvent } from 'react';
import { api, errorMessage } from '@/lib/api';

/** Redemander le lien de confirmation (lien expiré, autre appareil, email perdu). */
export function ResendVerification({ initialEmail = '' }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/auth/resend-verification', { method: 'POST', body: { email }, auth: false });
      setStatus(
        "Si un compte en attente existe pour cette adresse, un nouveau lien vient d'être envoyé.",
      );
    } catch (err) {
      setStatus(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card stack" onSubmit={submit} aria-label="Recevoir un nouveau lien">
      <div className="field">
        <label htmlFor="resend-email">Recevoir un nouveau lien de confirmation</label>
        <input
          id="resend-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-ghost" disabled={busy}>
        Renvoyer le lien
      </button>
      {status && <p role="status">{status}</p>}
    </form>
  );
}
