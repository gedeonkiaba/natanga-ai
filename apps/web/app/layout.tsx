import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource/lexend/400.css';
import '@fontsource/lexend/700.css';
import '@fontsource/opendyslexic/400.css';
import '@fontsource/opendyslexic/700.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Natanga — Apprendre à lire, à son rythme', template: '%s · Natanga' },
  description:
    'Ateliers de lecture pour les enfants de 6 à 12 ans en difficulté (dyslexie, TDAH, retard de lecture) : police adaptée, lecture à voix haute, coloration syllabique.',
};

export const viewport: Viewport = {
  themeColor: '#FAF6EF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip" href="#contenu">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
