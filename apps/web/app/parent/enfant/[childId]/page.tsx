'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Shell } from '@/components/Shell';
import { api, errorMessage } from '@/lib/api';
import type { Dashboard } from '@/lib/types';

function minutes(sec: number): string {
  const m = Math.round(sec / 60);
  return m < 1 ? '< 1 min' : `${m} min`;
}

export default function ChildDashboardPage() {
  const { childId } = useParams<{ childId: string }>();
  const router = useRouter();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api<{ dashboard: Dashboard }>(`/parent/dashboard/${childId}`);
      setData(res.dashboard);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [childId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setLevel(level: string) {
    setInfo(null);
    setError(null);
    try {
      await api(`/children/${childId}/level`, { method: 'POST', body: { level } });
      setInfo(`Niveau de lecture réglé sur ${level}.`);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function exportData() {
    try {
      const json = await api<unknown>(`/children/${childId}/export`);
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `natanga-export-${childId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function erase() {
    const name = data?.child.displayName ?? 'cet enfant';
    if (
      !window.confirm(
        `Supprimer définitivement toutes les données de ${name} ? Cette action est irréversible.`,
      )
    ) {
      return;
    }
    try {
      await api(`/children/${childId}`, { method: 'DELETE' });
      router.push('/parent');
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <Shell requireAuth parentOnly>
      <p>
        <Link href="/parent">← Espace parent</Link>
      </p>
      {error && <Alert>{error}</Alert>}
      {!data && !error && <p role="status">Chargement…</p>}
      {data && (
        <>
          <h1>Suivi de {data.child.displayName}</h1>

          <h2>Aujourd&apos;hui</h2>
          <div className="stats">
            <div className="stat">
              <strong>{data.today.sessionsCount}</strong>lecture(s)
            </div>
            <div className="stat">
              <strong>{minutes(data.today.durationSec)}</strong>de lecture
            </div>
            <div className="stat">
              <strong>{data.today.starsEarnedToday} ★</strong>étoiles gagnées
            </div>
          </div>

          <h2>Depuis le début</h2>
          <div className="stats">
            <div className="stat">
              <strong>{data.totals.sessions}</strong>lectures
            </div>
            <div className="stat">
              <strong>{minutes(data.totals.durationSec)}</strong>au total
            </div>
            <div className="stat">
              <strong>{data.totals.stars} ★</strong>étoiles
            </div>
          </div>

          <h2>Nos conseils</h2>
          <ul>
            {data.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h2>Dernières lectures</h2>
          {data.recentSessions.length === 0 ? (
            <p className="muted">Aucune lecture pour l&apos;instant.</p>
          ) : (
            <table className="card" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <caption className="sr-only">Dernières lectures</caption>
              <thead>
                <tr>
                  <th scope="col" align="left">
                    Date
                  </th>
                  <th scope="col" align="left">
                    Durée
                  </th>
                  <th scope="col" align="left">
                    Mots lus seul(e)
                  </th>
                  <th scope="col" align="left">
                    Étoiles
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentSessions.map((s) => (
                  <tr key={s.id}>
                    <td>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>{minutes(s.durationSec)}</td>
                    <td>
                      {s.correctWords} / {s.wordsRead}
                    </td>
                    <td>{'★'.repeat(s.stars) || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2>Niveau de lecture</h2>
          <p className="small muted">
            Niveau actuel : {data.child.placementLevel ?? '1 (par défaut)'}. Ajustez-le si les
            textes semblent trop faciles ou trop difficiles.
          </p>
          <div className="row" role="group" aria-label="Niveau de lecture">
            {['1', '2', '3'].map((l) => (
              <button
                key={l}
                type="button"
                className="chip"
                aria-pressed={(data.child.placementLevel ?? '1') === l}
                onClick={() => setLevel(l)}
              >
                Niveau {l}
              </button>
            ))}
          </div>
          {info && <Alert ok>{info}</Alert>}

          <h2>Vos données</h2>
          <div className="row">
            <button type="button" className="btn btn-ghost" onClick={exportData}>
              Télécharger ses données (JSON)
            </button>
            <button type="button" className="btn btn-danger" onClick={erase}>
              Supprimer son profil et ses données
            </button>
          </div>
        </>
      )}
    </Shell>
  );
}
