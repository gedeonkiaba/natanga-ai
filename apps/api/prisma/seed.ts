/**
 * Seed Prisma — contenu pédagogique niveau 1 + compte parent de démonstration.
 * Exécuté via `pnpm --filter @natanga/api prisma:seed`.
 * Idempotent : les `upsert` évitent les doublons si relancé.
 *
 * Données alignées sur `packages/core/src/pedagogy/content.ts`.
 */
import { PrismaClient } from '@prisma/client';
import { createHash, randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

/** Graphemes/lettres niveau 1 (dont b/d/p/q, confusions ciblées). */
const GRAPHEMES = [
  { id: 'g-a', label: 'a', phoneme: 'a' },
  { id: 'g-i', label: 'i', phoneme: 'i' },
  { id: 'g-o', label: 'o', phoneme: 'o' },
  { id: 'g-b', label: 'b', phoneme: 'b' },
  { id: 'g-d', label: 'd', phoneme: 'd' },
  { id: 'g-p', label: 'p', phoneme: 'p' },
  { id: 'g-q', label: 'q', phoneme: 'k' },
];

/** Mots simples niveau 1. */
const WORDS = [
  { id: 'w-papa', label: 'papa', phoneme: 'papa' },
  { id: 'w-maman', label: 'maman', phoneme: 'maman' },
  { id: 'w-lapin', label: 'lapin', phoneme: 'lapin' },
  { id: 'w-ballon', label: 'ballon', phoneme: 'ballon' },
  { id: 'w-doigt', label: 'doigt', phoneme: 'doigt' },
];

async function main(): Promise<void> {
  // 1. Items (graphemes + mots).
  for (const g of GRAPHEMES) {
    await prisma.item.upsert({
      where: { id: g.id },
      create: { id: g.id, type: 'grapheme', label: g.label, phoneme: g.phoneme },
      update: { label: g.label, phoneme: g.phoneme },
    });
  }
  for (const w of WORDS) {
    await prisma.item.upsert({
      where: { id: w.id },
      create: { id: w.id, type: 'word', label: w.label, phoneme: w.phoneme },
      update: { label: w.label, phoneme: w.phoneme },
    });
  }

  // 2. Nœuds de l'arbre (3 premiers).
  const nodeIds = { vowels: 'n-letters-a', bd: 'n-letters-bd', pq: 'n-letters-pq' };
  await prisma.skillNode.upsert({
    where: { id: nodeIds.vowels },
    create: { id: nodeIds.vowels, level: 'letters', title: 'Les voyelles', order: 1, unlockedWhen: 0 },
    update: {},
  });
  await prisma.skillNode.upsert({
    where: { id: nodeIds.bd },
    create: { id: nodeIds.bd, level: 'letters', title: 'Les sons b / d', order: 2, unlockedWhen: 1 },
    update: {},
  });
  await prisma.skillNode.upsert({
    where: { id: nodeIds.pq },
    create: { id: nodeIds.pq, level: 'letters', title: 'Les sons p / q', order: 3, unlockedWhen: 2 },
    update: {},
  });

  // 3. Leçons.
  const lessonVowels = 'l-vowels-1';
  await prisma.lesson.upsert({
    where: { id: lessonVowels },
    create: { id: lessonVowels, nodeId: nodeIds.vowels, title: 'Écouter les voyelles', durationMin: 6, order: 1 },
    update: {},
  });

  // 4. Exercices (son ⇄ graphème + QCM mots).
  const exercises = [
    { id: 'e-vowel-a', phoneme: 'a', order: 1 },
    { id: 'e-vowel-i', phoneme: 'i', order: 2 },
    { id: 'e-vowel-o', phoneme: 'o', order: 3 },
  ];
  for (const e of exercises) {
    await prisma.exercise.upsert({
      where: { id: e.id },
      create: {
        id: e.id,
        lessonId: lessonVowels,
        type: 'sound-grapheme',
        params: { phoneme: e.phoneme },
        order: e.order,
      },
      update: {},
    });
  }
  await prisma.exercise.upsert({
    where: { id: 'e-word-papa' },
    create: {
      id: 'e-word-papa',
      lessonId: lessonVowels,
      type: 'word-recognition',
      params: { correctItemId: 'w-papa', itemIds: ['w-papa', 'w-maman', 'w-lapin'] },
      order: 4,
    },
    update: {},
  });

  // 5. Compte parent de démonstration (mot de passe haché, jamais en clair).
  const demoEmail = 'demo@natanga.app';
  const demoPassword = 'demo1234';
  const passwordHash = createHash('sha256').update(demoPassword).digest('hex');
  await prisma.user.upsert({
    where: { email: demoEmail },
    create: {
      id: randomUUID(),
      email: demoEmail,
      passwordHash,
      role: 'parent',
      status: 'ACTIVE',
    },
    update: { passwordHash },
  });

  const counts = {
    items: await prisma.item.count(),
    nodes: await prisma.skillNode.count(),
    lessons: await prisma.lesson.count(),
    exercises: await prisma.exercise.count(),
    users: await prisma.user.count(),
  };
  // eslint-disable-next-line no-console
  console.log(`Seed terminé : ${JSON.stringify(counts)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
