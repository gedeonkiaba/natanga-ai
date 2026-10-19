import { describe, expect, it } from 'vitest';
import {
  checkPictureMatch,
  checkSoundGrapheme,
  checkSyllableAssembly,
  checkWordRecognition,
  choicesOf,
  spokenPrompt,
} from './exercises';
import {
  CURRICULUM_EXERCISES,
  CURRICULUM_ITEMS,
  CURRICULUM_LESSONS,
  CURRICULUM_LEVELS,
  CURRICULUM_NODES,
} from './content';

describe('association son ⇄ graphème (US-07)', () => {
  const ex = CURRICULUM_EXERCISES[0]!; // « Le son /a/ » : a | o

  it('valide la bonne correspondance', () => {
    const result = checkSoundGrapheme(ex, CURRICULUM_ITEMS, 'g-a');
    expect(result.correct).toBe(true);
  });

  it('rejette une mauvaise correspondance avec feedback bienveillant', () => {
    const result = checkSoundGrapheme(ex, CURRICULUM_ITEMS, 'g-o');
    expect(result.correct).toBe(false);
    expect(result.feedback).toContain('réessaie');
    expect(result.correctId).toBe('g-a');
  });
});

describe('reconnaissance de mots (US-08)', () => {
  const ex = CURRICULUM_EXERCISES.find((e) => e.type === 'word-recognition')!; // « avion »

  it('valide le bon mot', () => {
    const result = checkWordRecognition(ex, 'w-avion');
    expect(result.correct).toBe(true);
  });

  it('rejette un distracteur sans message punitif', () => {
    const result = checkWordRecognition(ex, 'w-ecole');
    expect(result.correct).toBe(false);
    expect(result.feedback.toLowerCase()).not.toContain('erreur');
  });
});

describe('contenu : chaque leçon est jouable', () => {
  it('chaque nœud a une leçon d’au moins 3 exercices', () => {
    for (const node of CURRICULUM_NODES) {
      const lesson = CURRICULUM_LESSONS.find((l) => l.nodeId === node.id);
      expect(lesson, node.id).toBeDefined();
      expect(
        CURRICULUM_EXERCISES.filter((e) => e.lessonId === lesson!.id).length,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it('chaque exercice propose exactement une bonne réponse et une consigne orale', () => {
    for (const e of CURRICULUM_EXERCISES.filter(
      (x) => x.type === 'sound-grapheme' || x.type === 'word-recognition',
    )) {
      const choices = choicesOf(e, CURRICULUM_ITEMS);
      expect(choices.length, e.id).toBe(e.params.itemIds!.length);
      const right = choices.filter((c) =>
        e.type === 'sound-grapheme'
          ? checkSoundGrapheme(e, CURRICULUM_ITEMS, c.id).correct
          : c.id === e.params.correctItemId,
      );
      expect(right, e.id).toHaveLength(1);
      expect(spokenPrompt(e, CURRICULUM_ITEMS), e.id).not.toBe('');
    }
  });

  it('7 niveaux, 77 leçons, déblocage séquentiel', () => {
    expect(CURRICULUM_LEVELS.map((l) => l.key)).toEqual([
      'sounds',
      'letters',
      'syllables',
      'words',
      'complex-sounds',
      'sentences',
      'short-texts',
    ]);
    expect(CURRICULUM_NODES).toHaveLength(77); // 68 leçons de la base + 2 miroirs + 7 bilans
    expect(CURRICULUM_NODES.map((n) => n.unlockedWhen)).toEqual(CURRICULUM_NODES.map((_, i) => i));
  });

  it('corrections de la base : le mot-repère contient vraiment le son', () => {
    const first = (lessonId: string) => CURRICULUM_EXERCISES.find((e) => e.lessonId === lessonId)!;
    expect(spokenPrompt(first('l-son-e'), CURRICULUM_ITEMS)).toBe('e, comme dans cheval');
    expect(spokenPrompt(first('l-son-an'), CURRICULUM_ITEMS)).toBe('an, comme dans maman');
  });

  it('b/d : seulement les lettres en miroir, avec un mot-repère', () => {
    const b1 = CURRICULUM_EXERCISES.find((e) => e.id === 'e-bd-b1')!;
    expect(choicesOf(b1, CURRICULUM_ITEMS).map((c) => c.label)).toEqual(['b', 'd']);
    expect(spokenPrompt(b1, CURRICULUM_ITEMS)).toBe('b, comme ballon');
    const bon = CURRICULUM_EXERCISES.find((e) => e.id === 'e-bd-bon')!;
    expect(spokenPrompt(bon, CURRICULUM_ITEMS)).toBe('bon');
  });
});

describe('assemblage de syllabes et tracé', () => {
  const byId = (id: string) => CURRICULUM_EXERCISES.find((e) => e.id === id)!;

  it('remet « ma · man » dans l’ordre, la syllabe piège en plus', () => {
    const ex = byId('e-mot-maman-assemble');
    expect(spokenPrompt(ex, CURRICULUM_ITEMS)).toBe('maman');
    expect(
      choicesOf(ex, CURRICULUM_ITEMS)
        .map((t) => t.label)
        .sort(),
    ).toEqual(['am', 'ma', 'man']);
    expect(checkSyllableAssembly(ex, CURRICULUM_ITEMS, ['s-ma', 's-man']).correct).toBe(true);
    expect(checkSyllableAssembly(ex, CURRICULUM_ITEMS, ['s-man', 's-ma']).feedback).toBe(
      'Presque ! C’est « ma · man ». On réessaie.',
    );
  });

  it('chaque leçon de son se termine par le tracé de sa lettre', () => {
    const trace = CURRICULUM_EXERCISES.filter((e) => e.lessonId === 'l-son-a').at(-1)!;
    expect(trace.type).toBe('tracing');
    expect(spokenPrompt(trace, CURRICULUM_ITEMS)).toBe('Avec ton doigt, trace la lettre a');
  });
});

describe('lis et trouve l’image', () => {
  it('lit la phrase sans la dire, répond en image', () => {
    const ex = CURRICULUM_EXERCISES.find((e) => e.id === 'e-phrase-1-sens')!;
    expect(ex.params.question).toBe('Qui dort ?');
    expect(spokenPrompt(ex, CURRICULUM_ITEMS)).toBe('Lis la phrase. Qui dort ?');
    expect(choicesOf(ex, CURRICULUM_ITEMS).every((c) => c.image)).toBe(true);
    expect(checkPictureMatch(ex, CURRICULUM_ITEMS, 'w-chat').correct).toBe(true);
    expect(checkPictureMatch(ex, CURRICULUM_ITEMS, 'w-papa').feedback).toBe(
      'Presque ! C’est « chat ». On réessaie.',
    );
  });

  it('chaque niveau finit par un bilan de 6 exercices', () => {
    for (const level of CURRICULUM_LEVELS) {
      const last = CURRICULUM_NODES.filter((n) => n.level === level.key).at(-1)!;
      expect(last.id).toBe(`n-bilan-${level.rank}`);
      expect(
        CURRICULUM_EXERCISES.filter((e) => e.lessonId === `l-bilan-${level.rank}`),
      ).toHaveLength(6);
    }
  });
});
