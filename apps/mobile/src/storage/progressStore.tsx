import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialProgress, parseProgress, type ProgressState } from '../features/progress';

/** Clé de sauvegarde sur l'appareil (stockage local, aucune connexion requise). */
export const STORAGE_KEY = 'natanga.progress.v1';

interface ProgressContextValue {
  progress: ProgressState;
  ready: boolean;
  update: (change: (state: ProgressState) => ProgressState) => void;
}

const ProgressContext = createContext<ProgressContextValue>({
  progress: initialProgress,
  ready: false,
  update: () => {},
});

/**
 * Charge la progression sauvegardée au démarrage puis l'enregistre à chaque
 * changement. Si le stockage échoue, l'app continue en mémoire (jamais bloquée).
 */
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .catch(() => null)
      .then((raw) => {
        if (cancelled) return;
        setProgress(parseProgress(raw));
        loaded.current = true;
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded.current) return; // ne jamais écraser la sauvegarde avant de l'avoir lue
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => {});
  }, [progress]);

  const update = useCallback(
    (change: (state: ProgressState) => ProgressState) => setProgress(change),
    [],
  );

  return (
    <ProgressContext.Provider value={{ progress, ready, update }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
