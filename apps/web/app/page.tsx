import { colors, spacing, radii, fontSizes } from '@natanga/ui/tokens';

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: spacing.lg,
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: colors.secondary, fontSize: fontSizes.xxl, fontFamily: 'inherit' }}>
        Natanga
      </h1>
      <p style={{ fontSize: fontSizes.lg, color: colors.text, lineHeight: 1.6 }}>
        Apprendre à lire et à écrire, à son rythme.
      </p>
      <button
        type="button"
        style={{
          backgroundColor: colors.primary,
          color: colors.primaryContrast,
          border: 'none',
          borderRadius: radii.pill,
          padding: `${spacing.sm}px ${spacing.lg}px`,
          fontSize: fontSizes.md,
          cursor: 'pointer',
          minHeight: 44,
        }}
      >
        C&apos;est parti !
      </button>
      <p style={{ fontSize: fontSizes.sm, color: colors.textMuted, marginTop: spacing.lg }}>
        Cette application entraîne et soutient ; elle ne remplace pas un orthophoniste.
      </p>
    </main>
  );
}
