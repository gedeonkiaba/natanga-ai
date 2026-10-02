'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Alert, Shell } from '@/components/Shell';
import { api, errorMessage } from '@/lib/api';
import { toChild, type Child } from '@/lib/types';

const THIS_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: 7 }, (_, i) => THIS_YEAR - 6 - i); // 6 à 12 ans

function ConsentBox({ child, onChange }: { child: Child; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const granted = child.status === 'ACTIVE';

  async function apply(action: 'grant' | 'revoke') {
    setBusy(true);
    setError(null);
    try {
      await api(`/children/${child.id}/consents`, { method: 'POST', body: { action } });
      onChange();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (granted) {
    return (
      <div className="stack">
        <p className="small muted">
          Accord parental donné. Vous pouvez le retirer à tout moment : la lecture sera suspendue, vos
          données restent consultables, exportables et supprimables.
        </p>
        {error && <Alert>{error}</Alert>}
        <button type="button" className="btn btn-danger" disabled={busy} onClick={() => apply('revoke')}>
          Retirer mon accord
        </button>
      </div>
    );
  }

  return (
    <div className="stack">
      <p className="small">
        Avant que {child.displayName} puisse lire, nous avons besoin de votre accord. Nous enregistrons
        uniquement : son prénom, son année de naissance, ses lectures (durée, mots touchés, étoiles) et ses
        réglages. Pas de voix, pas de photo, pas de publicité.
      </p>
      {error && <Alert>{error}</Alert>}
      <button type="button" className="btn btn-primary" disabled={busy} onClick={() => apply('grant')}>
        Je donne mon accord parental
      </button>
    </div>
  );
}

export default function ParentPage() {
  const [children, setChildren] = useState<Child[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState(String(THIS_YEAR - 8));
  const [formError, setFormError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const raw = await api<Array<Record<string, unknown>>>('/children');
      setChildren(raw.map(toChild));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addChild(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setAdding(true);
    try {
      await api('/children', { method: 'POST', body: { displayName: name.trim(), birthYear: Number(birthYear) } });
      setName('');
      await load();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setAdding(false);
    }
  }

  return (
    <Shell requireAuth>
      <h1>Espace parent</h1>
      {error && <Alert>{error}</Alert>}

      {children === null && !error && <p role="status">Chargement…</p>}
      {children && children.length > 0 && (
        <ul className="grid" style={{ listStyle: 'none', padding: 0 }} aria-label="Vos enfants">
          {children.map((child) => (
            <li key={child.id} className="card stack">
              <div className="row">
                <h2 style={{ margin: 0 }}>{child.displayName}</h2>
                <span className={child.status === 'ACTIVE' ? 'badge badge-ok' : 'badge badge-wait'}>
                  {child.status === 'ACTIVE' ? 'Accord donné' : 'Accord à donner'}
                </span>
              </div>
              <p className="muted small" style={{ margin: 0 }}>
                Né(e) en {child.birthYear} · {child.ageBand} ans
              </p>
              {child.status === 'ACTIVE' && (
                <Link href={`/lire/${child.id}`} className="btn btn-primary">
                  Lancer la lecture
                </Link>
              )}
              <ConsentBox child={child} onChange={load} />
              <Link href={`/parent/enfant/${child.id}`}>Suivi et données de {child.displayName}</Link>
            </li>
          ))}
        </ul>
      )}

      <h2>{children && children.length > 0 ? 'Ajouter un autre enfant' : 'Ajouter votre enfant'}</h2>
      <form className="card stack narrow" style={{ marginLeft: 0 }} onSubmit={addChild}>
        <div className="field">
          <label htmlFor="child-name">Prénom (ou surnom)</label>
          <input id="child-name" required maxLength={40} value={name} onChange={(e) => setName(e.target.value)}
            aria-describedby="child-name-hint" />
          <p id="child-name-hint" className="hint">Pas de nom de famille : un prénom ou un surnom suffit.</p>
        </div>
        <div className="field">
          <label htmlFor="child-year">Année de naissance</label>
          <select id="child-year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
            {BIRTH_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {formError && <Alert>{formError}</Alert>}
        <button type="submit" className="btn btn-secondary" disabled={adding}>
          {adding ? 'Ajout…' : 'Ajouter'}
        </button>
      </form>
    </Shell>
  );
}
