'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Shell } from '@/components/Shell';
import { DEFAULT_SETTINGS, ReaderSettings } from '@/components/ReaderSettings';
import { api, errorMessage } from '@/lib/api';
import { cheer, sessionMetrics } from '@/lib/reading';
import { speak, speechAvailable, stopSpeaking } from '@/lib/speech';
import { syllables, tokenize } from '@/lib/text';
import type { Lesson, SessionResult, Settings } from '@/lib/types';

function track(childId: string, name: string, lessonId: string) {
  // Événement produit sans donnée personnelle ; un échec ne gêne jamais la lecture.
  api(`/children/${childId}/events`, { method: 'POST', body: { name, props: { lessonId } } }).catch(() => {});
}

export default function ReaderPage() {
  const { childId, textId } = useParams<{ childId: string; textId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [difficult, setDifficult] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<SessionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const startedAt = useRef(Date.now());
  const opened = useRef(false);

  useEffect(() => {
    api<Lesson>(`/lessons/${textId}`).then(setLesson).catch((err) => setError(errorMessage(err)));
    api<{ settings: Settings }>(`/children/${childId}/settings`).then((r) => setSettings(r.settings)).catch(() => {});
    if (!opened.current) {
      opened.current = true;
      track(childId, 'text_opened', textId);
    }
    return () => stopSpeaking();
  }, [childId, textId]);

  const tokens = useMemo(() => tokenize(lesson?.text ?? ''), [lesson]);
  const totalWords = tokens.filter((t) => t.kind === 'word').length;

  function onWord(index: number, word: string) {
    speak(word, settings.voiceSpeed);
    if (!difficult.has(index)) {
      setDifficult(new Set(difficult).add(index));
      track(childId, 'word_blocked', textId);
    }
  }

  function listenAll() {
    if (!lesson?.text) return;
    speak(lesson.text, settings.voiceSpeed);
    track(childId, 'help_requested', textId);
  }

  async function finish() {
    setSaving(true);
    setError(null);
    stopSpeaking();
    try {
      const body = sessionMetrics({
        lessonId: textId,
        totalWords,
        difficultWords: difficult.size,
        startedAt: startedAt.current,
        endedAt: Date.now(),
      });
      setResult(await api<SessionResult>(`/children/${childId}/sessions`, { method: 'POST', body }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (result) {
    const stars = result.session.stars;
    return (
      <Shell requireAuth>
        <section className="celebrate stack" aria-live="polite">
          <h1>{cheer(stars)}</h1>
          <p className="stars pop" aria-label={`${stars} étoile${stars > 1 ? 's' : ''} gagnée${stars > 1 ? 's' : ''}`}>
            {'★'.repeat(stars)}
          </p>
          {result.unlocked.length > 0 && (
            <Alert ok>Nouveau trésor débloqué ! Continue à lire pour en découvrir d&apos;autres.</Alert>
          )}
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link href={`/lire/${childId}`} className="btn btn-primary btn-big">
              Lire une autre histoire
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  const fontClass = `font-${settings.fontFamily}`;

  return (
    <Shell requireAuth>
      <p>
        <Link href={`/lire/${childId}`}>← Toutes les histoires</Link>
      </p>
      {error && <Alert>{error}</Alert>}
      {!lesson && !error && <p role="status">Chargement…</p>}
      {lesson && (
        <div className="stack">
          <h1 className={fontClass}>{lesson.title}</h1>
          <p className="muted small">
            Un mot est difficile ? Touche-le pour l&apos;écouter.
            {!speechAvailable() && ' (La voix n’est pas disponible sur cet appareil.)'}
          </p>
          <div className="row">
            <button type="button" className="btn btn-secondary" onClick={listenAll}>
              <span aria-hidden="true">🔊</span> Écouter toute l&apos;histoire
            </button>
          </div>
          <article
            className={`reader ${fontClass}`}
            style={{ ['--reader-scale' as string]: String(settings.fontScale) }}
            lang="fr"
            aria-label={lesson.title}
          >
            {tokens.map((t, i) =>
              t.kind === 'sep' ? (
                <span key={i}>{t.text}</span>
              ) : (
                <button
                  key={i}
                  type="button"
                  className="word"
                  aria-pressed={difficult.has(t.index)}
                  onClick={() => onWord(t.index, t.text)}
                >
                  {settings.syllableColoring
                    ? syllables(t.text).map((s, k) => (
                        <span key={k} className="syl">
                          {s}
                        </span>
                      ))
                    : t.text}
                </button>
              ),
            )}
          </article>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary btn-big" onClick={finish} disabled={saving}>
              {saving ? 'Un instant…' : "J'ai fini !"}
            </button>
          </div>
          <ReaderSettings childId={childId} settings={settings} onChange={setSettings} />
        </div>
      )}
    </Shell>
  );
}
