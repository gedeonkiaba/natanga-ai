'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, Shell } from '@/components/Shell';
import { DEFAULT_SETTINGS, ReaderSettings } from '@/components/ReaderSettings';
import { ApiError, api, errorMessage } from '@/lib/api';
import { INTERESTS, toChild, type Child, type ReadingText, type Settings } from '@/lib/types';

export default function LibraryPage() {
  const { childId } = useParams<{ childId: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [interest, setInterest] = useState<string | null>(null);
  const [texts, setTexts] = useState<ReadingText[] | null>(null);
  const [error, setError] = useState<{ message: string; consent: boolean } | null>(null);

  useEffect(() => {
    api<Record<string, unknown>>(`/children/${childId}`)
      .then((raw) => setChild(toChild(raw)))
      .catch(() => {});
    api<{ settings: Settings }>(`/children/${childId}/settings`)
      .then((r) => setSettings(r.settings))
      .catch(() => {});
  }, [childId]);

  useEffect(() => {
    setTexts(null);
    const q = interest ? `?interest=${encodeURIComponent(interest)}` : '';
    api<{ texts: ReadingText[] }>(`/children/${childId}/texts${q}`)
      .then((r) => setTexts(r.texts))
      .catch((err) =>
        setError({
          message: errorMessage(err),
          consent: err instanceof ApiError && err.code === 'ERR_CONSENT_REQUIRED',
        }),
      );
  }, [childId, interest]);

  return (
    <Shell requireAuth childMode>
      <h1>{child ? `Bonjour ${child.displayName} !` : 'Bonjour !'} Que veux-tu lire ?</h1>
      {error ? (
        <div className="stack">
          <Alert>{error.message}</Alert>
          {error.consent && (
            <Link href="/parent" className="btn btn-primary">
              Aller à l&apos;espace parent
            </Link>
          )}
        </div>
      ) : (
        <div className="stack">
          <div className="row" role="group" aria-label="Choisir un thème">
            <button
              type="button"
              className="chip"
              aria-pressed={interest === null}
              onClick={() => setInterest(null)}
            >
              Tout
            </button>
            {INTERESTS.map((i) => (
              <button
                key={i.key}
                type="button"
                className="chip"
                aria-pressed={interest === i.key}
                onClick={() => setInterest(i.key)}
              >
                <span aria-hidden="true">{i.emoji}</span> {i.label}
              </button>
            ))}
          </div>

          {texts === null && <p role="status">Chargement des histoires…</p>}
          {texts && texts.length === 0 && (
            <p>Pas encore d&apos;histoire ici. Choisis un autre thème !</p>
          )}
          {texts && texts.length > 0 && (
            <ul className="grid" style={{ listStyle: 'none', padding: 0 }} aria-label="Histoires">
              {texts.map((t) => {
                const theme = INTERESTS.find((i) => i.key === t.interest);
                return (
                  <li key={t.id}>
                    <Link href={`/lire/${childId}/${t.id}`} className="card text-card">
                      <span aria-hidden="true" style={{ fontSize: 32 }}>
                        {theme?.emoji ?? '📖'}
                      </span>
                      <h3>{t.title}</h3>
                      <span className="muted small">
                        {theme?.label ?? t.interest} · {t.durationMin} min
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <ReaderSettings childId={childId} settings={settings} onChange={setSettings} />
        </div>
      )}
    </Shell>
  );
}
