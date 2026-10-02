'use client';

import { useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import type { Settings } from '@/lib/types';

/** Réglages d'accessibilité de l'enfant, persistés côté API (PATCH /settings). */
export function ReaderSettings({
  childId,
  settings,
  onChange,
}: {
  childId: string;
  settings: Settings;
  onChange: (s: Settings) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function update(patch: Partial<Settings>) {
    const next = { ...settings, ...patch };
    onChange(next); // retour immédiat à l'écran
    try {
      const res = await api<{ settings: Settings }>(`/children/${childId}/settings`, {
        method: 'PATCH',
        body: patch,
      });
      onChange(res.settings);
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <details className="card">
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Réglages de lecture</summary>
      <div className="stack" style={{ marginTop: 16 }}>
        <div className="field">
          <label htmlFor="font">Police</label>
          <select
            id="font"
            value={settings.fontFamily}
            onChange={(e) => update({ fontFamily: e.target.value as Settings['fontFamily'] })}
          >
            <option value="dyslexic">OpenDyslexic (dyslexie)</option>
            <option value="lexend">Lexend (très lisible)</option>
            <option value="system">Police standard</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="scale">Taille du texte : {Math.round(settings.fontScale * 100)} %</label>
          <input
            id="scale"
            type="range"
            min={0.8}
            max={2}
            step={0.1}
            value={settings.fontScale}
            onChange={(e) => update({ fontScale: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor="speed">Vitesse de la voix : {settings.voiceSpeed.toFixed(1)}×</label>
          <input
            id="speed"
            type="range"
            min={0.5}
            max={1.5}
            step={0.1}
            value={settings.voiceSpeed}
            onChange={(e) => update({ voiceSpeed: Number(e.target.value) })}
          />
        </div>
        <label className="row" style={{ gap: 8 }}>
          <input
            type="checkbox"
            checked={settings.syllableColoring}
            style={{ width: 24, height: 24 }}
            onChange={(e) => update({ syllableColoring: e.target.checked })}
          />
          Colorier les syllabes
        </label>
        {error && (
          <p role="alert" className="small">
            {error}
          </p>
        )}
      </div>
    </details>
  );
}

export const DEFAULT_SETTINGS: Settings = {
  voiceSpeed: 1,
  syllableColoring: true,
  fontFamily: 'dyslexic',
  fontScale: 1,
};
