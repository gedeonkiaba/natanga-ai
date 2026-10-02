import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { fontFamilies } from '@natanga/ui/tokens';

export const metadata: Metadata = {
  title: 'Natanga — Apprendre à lire et écrire',
  description:
    "Application d'apprentissage de la lecture et de l'écriture pour les enfants de 6 à 12 ans présentant des difficultés (dyslexie, dysorthographie, TDAH).",
};

// Vue mobile & accessibilité : les préférences de taille/contraste sont respectées via tokens.
export const viewport: Viewport = {
  themeColor: '#FAF6EF',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: fontFamilies.body,
          backgroundColor: '#FAF6EF',
          color: '#1F1A10',
        }}
      >
        {children}
      </body>
    </html>
  );
}
