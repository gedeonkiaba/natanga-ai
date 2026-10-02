import Link from 'next/link';
import { Shell } from '@/components/Shell';

export default function HomePage() {
  return (
    <Shell>
      <section className="stack" aria-labelledby="titre">
        <h1 id="titre">Apprendre à lire, à son rythme.</h1>
        <p className="lead">
          Natanga accompagne les enfants de 6 à 12 ans qui trouvent la lecture difficile — dyslexie,
          TDAH, retard de lecture — avec des textes courts adaptés à leur niveau et à leurs
          passions.
        </p>
        <div className="row">
          <Link href="/inscription" className="btn btn-primary btn-big">
            Créer un compte parent
          </Link>
          <Link href="/connexion" className="btn btn-ghost">
            J&apos;ai déjà un compte
          </Link>
        </div>
      </section>

      <h2>Ce que votre enfant y trouve</h2>
      <ul className="grid" style={{ listStyle: 'none', padding: 0 }}>
        <li className="card">
          <strong>Une police pensée pour la dyslexie</strong>
          <p className="muted small">OpenDyslexic ou Lexend, grande taille, espacement généreux.</p>
        </li>
        <li className="card">
          <strong>Chaque mot peut être écouté</strong>
          <p className="muted small">
            Un mot résiste ? On le touche, il est lu à voix haute. Sans jugement.
          </p>
        </li>
        <li className="card">
          <strong>La coloration syllabique</strong>
          <p className="muted small">
            Les syllabes alternent de couleur pour aider à découper les mots.
          </p>
        </li>
        <li className="card">
          <strong>Des étoiles, jamais d&apos;échec</strong>
          <p className="muted small">
            Chaque lecture terminée est récompensée. On encourage, on ne sanctionne pas.
          </p>
        </li>
      </ul>

      <h2>Pour vous, parent</h2>
      <p>
        Un tableau de bord simple : temps de lecture, textes terminés, mots qui posent problème et
        conseils concrets. Vos données restent les vôtres : export et suppression en un clic, aucune
        publicité, aucun enregistrement de la voix.
      </p>
      <p className="muted small">
        Natanga entraîne et soutient la lecture ; il ne pose pas de diagnostic et ne remplace pas un
        orthophoniste ou un enseignant.
      </p>
    </Shell>
  );
}
