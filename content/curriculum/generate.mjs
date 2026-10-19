#!/usr/bin/env node
/**
 * Génère le parcours pédagogique à partir de la base de connaissances (CSV) :
 *
 *   niveaux.csv  →  6 niveaux (nom, objectif)
 *   lecons.csv   →  1 nœud de l'arbre + 1 leçon par ligne
 *   mots.csv     →  le mot / la syllabe / la phrase de chaque leçon (+ découpage syllabique)
 *
 * Les exercices sont construits ici, de façon déterministe, avec les 2 types que savent
 * jouer les applis : son ⇄ graphème et reconnaissance (mot, syllabe, phrase).
 *
 * Sorties (identiques pour les 3 clients — ne pas éditer à la main) :
 *   packages/core/src/pedagogy/curriculum.generated.ts      (Expo, web)
 *   apps/mobile-flutter/lib/domain/curriculum.g.dart        (Flutter)
 *   apps/api-laravel/database/seeders/data/curriculum.json  (API Laravel)
 *
 * Usage : node content/curriculum/generate.mjs          (écrit les fichiers)
 *         node content/curriculum/generate.mjs --check  (échoue s'ils ne sont pas à jour)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');

// --- Lecture CSV (champs entre guillemets acceptés) ---

function parseCsv(file) {
  const text = readFileSync(join(here, file), 'utf8').replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...data] = rows;
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const niveaux = parseCsv('niveaux.csv');
/** Image (Fluent Emoji) de chaque mot illustrable : remplace `image_suggeree` de mots.csv. */
const IMAGES = Object.fromEntries(parseCsv('images.csv').map((r) => [r.mot, `emoji:${r.emoji}`]));
/** Questions de compréhension (phrases, textes) : réponse et pièges sont des mots illustrés. */
const QUESTIONS = {};
for (const r of parseCsv('questions.csv')) {
  (QUESTIONS[r.lecon_id] ??= []).push({ question: r.question, answer: r.reponse, traps: r.pieges.split('|') });
}
const lecons = parseCsv('lecons.csv');
const mots = parseCsv('mots.csv');

// --- Corrections et compléments pédagogiques (documentés dans docs/28-parcours-pedagogique.md) ---

/** Le mot-repère de la base ne contient pas le son : on le remplace. */
const CUE_WORD_FIX = {
  e: { word: 'cheval', reason: '« éléphant » contient le son /é/, pas /e/' },
  an: { word: 'maman', reason: 'dans « banane », on n’entend pas /an/ (ba-na-ne)' },
};

/** Second mot de la banque contenant le son (exercice 4), choisi à la main. */
const SECOND_WORD = {
  a: 'papa', i: 'ami', o: 'robot', u: 'jupe', é: 'vélo',
  m: 'maman', p: 'pomme', t: 'bateau', s: 'poisson', l: 'lune', r: 'fleur', n: 'banane',
  d: 'dodo', v: 'cheval', b: 'bonbon', ch: 'cheval', ou: 'poule', oi: 'doigt', an: 'éléphant', on: 'lion',
  c: 'cadeau', g: 'gorille', ai: 'maison', ei: 'baleine', au: 'chaussure', eu: 'fleur', en: 'enfant',
  gn: 'araignée', ill: 'chenille', ph: 'éléphant', qu: 'requin', gu: 'bague',
};

/** Lettres ou sons proches (miroir, son voisin) proposés comme distracteurs. */
const CONFUSABLE = {
  a: ['o', 'e'], e: ['é', 'u'], i: ['é', 'a'], o: ['a', 'u'], u: ['i', 'o'], é: ['e', 'i'],
  m: ['n', 'p'], p: ['q', 'b'], t: ['d', 'l'], s: ['f', 'r'], l: ['t', 'r'], r: ['l', 'n'],
  n: ['m', 'r'], d: ['b', 't'], f: ['v', 's'], v: ['f', 'b'], b: ['d', 'p'], j: ['s', 'v'],
  ch: ['s', 'j'], ou: ['u', 'o'], oi: ['ou', 'o'], an: ['on', 'in'], on: ['an', 'ou'],
  in: ['an', 'on'], eau: ['ou', 'an'],
  // Jamais d'homophone (ai/ei, en/an, au/o, ph/f, qu/c, gu/g) : l'oreille ne peut pas choisir.
  c: ['g', 't'], g: ['c', 'j'], z: ['s', 'j'],
  ai: ['oi', 'au'], ei: ['eu', 'oi'], au: ['ou', 'an'], eu: ['ou', 'au'], en: ['on', 'in'],
  gn: ['n', 'ill'], ill: ['gn', 'l'], ph: ['p', 'v'], qu: ['gu', 'p'], gu: ['qu', 'j'],
};

/** Ce que dit la voix pour un graphème isolé (le TTS épellerait « ch » ou « q »). */
const SAY = {
  ch: 'che', q: 'ku', c: 'ka', g: 'gue', ph: 'fe', gn: 'gne', ill: 'ille', qu: 'ke', gu: 'gue',
  ai: 'è', ei: 'è', au: 'o', en: 'an',
};

/** Syllabes voisines : même voyelle / même consonne, et l'inversion (ma → am). */
const SYLLABLE_NEAR = {
  ma: ['pa', 'mi'], pa: ['ta', 'pi'], ta: ['la', 'ti'], la: ['ta', 'li'], mi: ['pi', 'mo'],
  pi: ['ti', 'pa'], ti: ['li', 'to'], li: ['mi', 'la'], mo: ['to', 'ma'], to: ['mo', 'ti'],
};
const SYLLABLE_WORD = { ma: 'maman', pa: 'papa', la: 'lapin', mi: 'ami', li: 'livre' };

/** Mots ajoutés à la banque (leçons miroir b/d, p/q et mots-repères corrigés). */
const EXTRA_WORDS = {
  bon: 'bon', don: 'don', bébé: 'bé-bé', dodo: 'do-do', pomme: 'pom-me', poule: 'pou-le',
  quatre: 'qua-tre', coq: 'coq', doigt: 'doigt', cheval: 'che-val',
  // Seconds mots des sons ajoutés (c, g, ai, ei, au, en, gn, ill, qu, gu)
  cadeau: 'ca-deau', gorille: 'go-ril-le', baleine: 'ba-lei-ne', chaussure: 'chaus-su-re',
  enfant: 'en-fant', araignée: 'a-rai-gnée', chenille: 'che-nil-le', requin: 're-quin', bague: 'ba-gue',
};

/** Mots des phrases du niveau 6 : jamais distracteurs ailleurs (« fleurs » sonne comme « fleur »). */
const SENTENCE_WORDS = {
  le: 'le', dort: 'dort', lit: 'lit', un: 'un', la: 'la', est: 'est', belle: 'bel-le',
  aime: 'ai-me', les: 'les', fleurs: 'fleurs', je: 'je', vais: 'vais', à: 'à',
};

/** Mots à faire retrouver dans chaque phrase (niveau 6), dans l'ordre des leçons. */
const SENTENCE_TARGETS = [
  ['chat', 'dort'], ['livre', 'lit'], ['lune', 'belle'], ['fleurs', 'aime'], ['école', 'vais'],
];

/** Pseudo-mot à une lettre près (attention visuelle) : première lettre trouvée remplacée. */
const LOOKALIKE = { m: 'n', n: 'm', p: 'q', q: 'p', b: 'd', d: 'b', l: 't', t: 'l', a: 'o', o: 'a', f: 't', v: 'u', é: 'è' };

/** Leçons miroir (ajout Natanga) placées à la fin du niveau 2. */
const MIRROR_LESSONS = [
  {
    nodeId: 'n-letters-bd', lessonId: 'l-bd-1', title: 'b ou d ?',
    objective: 'Ne plus confondre b et d, les lettres en miroir.',
    exercises: [
      ['e-bd-b1', 'sg', 'b', 'b, comme ballon', ['b', 'd']],
      ['e-bd-d1', 'sg', 'd', 'd, comme doigt', ['b', 'd']],
      ['e-bd-b2', 'sg', 'b', 'b, comme bébé', ['d', 'p', 'b']],
      ['e-bd-bon', 'wr', 'bon', ['don', 'bon']],
      ['e-bd-dodo', 'wr', 'dodo', ['bébé', 'dodo', 'ballon']],
      ['e-bd-trace-d', 'tr', 'd'],
    ],
  },
  {
    nodeId: 'n-letters-pq', lessonId: 'l-pq-1', title: 'p ou q ?',
    objective: 'Ne plus confondre p et q, les lettres en miroir.',
    exercises: [
      ['e-pq-p1', 'sg', 'p', 'p, comme papa', ['p', 'q']],
      ['e-pq-q1', 'sg', 'q', 'q, comme quatre', ['p', 'q']],
      ['e-pq-p2', 'sg', 'p', 'p, comme pomme', ['q', 'b', 'p']],
      ['e-pq-quatre', 'wr', 'quatre', ['pomme', 'quatre', 'poule']],
      ['e-pq-coq', 'wr', 'coq', ['coq', 'poule', 'papa']],
      ['e-pq-trace-q', 'tr', 'q'],
    ],
  },
];

const LEVEL_KEYS = {
  1: 'sounds', 2: 'letters', 3: 'syllables', 4: 'words', 5: 'complex-sounds', 6: 'sentences', 7: 'short-texts',
};

// --- Items ---

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const items = new Map();
const add = (item) => {
  const prev = items.get(item.id);
  if (prev && prev.label !== item.label) throw new Error(`id en double : ${item.id} (${prev.label} / ${item.label})`);
  if (!prev) items.set(item.id, item);
  return item.id;
};
const gid = (g) => (g === 'é' ? 'g-e-aigu' : `g-${slug(g)}`);
const grapheme = (g) => add({ id: gid(g), type: 'grapheme', label: g, phoneme: g === 'q' ? 'k' : g, syllables: [] });
/** Les accents comptent pour une syllabe : « vé » ≠ « ve », « é » ≠ « è ». */
const accentSlug = (s) => slug(s.replace(/é/g, 'eacute').replace(/è/g, 'egrave').replace(/ê/g, 'ecirc'));
const syllable = (s) => add({ id: `s-${accentSlug(s)}`, type: 'syllable', label: s, phoneme: s, syllables: [s] });

const wordSyllables = new Map();
for (const m of mots) if (!m.mot.includes(' ')) wordSyllables.set(m.mot, m.syllabes);
for (const [w, s] of Object.entries({ ...EXTRA_WORDS, ...SENTENCE_WORDS })) if (!wordSyllables.has(w)) wordSyllables.set(w, s);
const word = (w) => {
  const syl = wordSyllables.get(w);
  if (!syl) throw new Error(`mot absent de la banque : ${w}`);
  const item = { id: `w-${slug(w)}`, type: 'word', label: w, phoneme: w, syllables: syl.split('-') };
  if (IMAGES[w]) item.image = IMAGES[w];
  return add(item);
};
const lookalike = (w) => {
  const chars = [...w];
  const i = chars.findIndex((c) => LOOKALIKE[c]);
  chars[i] = LOOKALIKE[chars[i]];
  const fake = chars.join('');
  return add({ id: `x-${slug(fake)}`, type: 'word', label: fake, phoneme: fake, syllables: [fake] });
};

// Graphèmes dans l'ordre d'apprentissage, puis q (leçon miroir).
for (const l of [...lecons].sort((a, b) => a.niveau_id - b.niveau_id || a.ordre - b.ordre)) {
  if (l.titre.startsWith('Le son')) grapheme(l.son_cible);
}
grapheme('q');

// --- Construction du parcours ---

const levels = niveaux.map((n) => ({
  rank: Number(n.id),
  key: LEVEL_KEYS[n.id],
  name: n.nom,
  objective: n.objectif,
}));
const nodes = [];
const lessons = [];
const exercises = [];
const motByLesson = new Map(mots.map((m) => [m.lecon_id, m]));

/** Fait tourner les choix pour que la bonne réponse ne soit pas toujours à la même place. */
const rotate = (arr, k) => arr.map((_, i) => arr[(i + k) % arr.length]);

const bankWords = [
  ...new Set([
    ...mots.filter((m) => !m.mot.includes(' ') && m.mot.length > 2).map((m) => m.mot),
    ...Object.keys(EXTRA_WORDS).filter((w) => w.length > 3),
    // Les mots des phrases (SENTENCE_WORDS) restent hors de la banque de distracteurs.
  ]),
].sort((a, b) => a.localeCompare(b, 'fr'));

/** Distracteurs de reconnaissance : mots proches (début commun, longueur voisine). */
function similarWords(target, count, exclude = () => false) {
  const common = (a, b) => {
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return i;
  };
  return bankWords
    .filter((w) => w !== target && !exclude(w))
    .map((w) => ({ w, score: 3 * common(w, target) - Math.abs(w.length - target.length) }))
    .sort((a, b) => b.score - a.score || a.w.localeCompare(b.w, 'fr'))
    .slice(0, count)
    .map((x) => x.w);
}

let order = 0;
function addNode(level, nodeId, lessonId, title, objective, durationMin) {
  order++;
  nodes.push({ id: nodeId, level, title, order, unlockedWhen: order - 1 });
  lessons.push({ id: lessonId, nodeId, title, objective, durationMin, order: 1 });
}
function addExercise(lessonId, id, type, params) {
  const n = exercises.filter((e) => e.lessonId === lessonId).length + 1;
  exercises.push({ id, lessonId, type, order: n, params });
}
const sg = (lessonId, id, target, cue, choiceIds) =>
  addExercise(lessonId, id, 'sound-grapheme', { phoneme: items.get(target).phoneme, cue, itemIds: choiceIds });
const wr = (lessonId, id, target, choiceIds) =>
  addExercise(lessonId, id, 'word-recognition', { correctItemId: target, itemIds: choiceIds });

/** Tracé au doigt : une seule lettre (ou un son écrit en plusieurs lettres : ou, ch, eau). */
const tr = (lessonId, id, g) => {
  const label = items.get(g).label;
  // On trace des lettres : la voix les nomme (« cé », « les lettres a, i »), pas le son.
  const letters = [...label];
  const cue =
    letters.length > 1 ? `Avec ton doigt, trace les lettres ${letters.join(', ')}` : `Avec ton doigt, trace la lettre ${label}`;
  addExercise(lessonId, id, 'tracing', { correctItemId: g, cue, itemIds: [g] });
};

/**
 * « Lis et trouve l'image » : l'enfant lit (sans l'entendre) un mot ou une phrase, puis touche
 * l'image qui correspond. Vraie lecture : de l'écrit vers le sens.
 */
const pictureMatch = (lessonId, id, answer, distractors, seed, { textItemId, question, unit = 'la phrase' } = {}) => {
  const answerId = word(answer);
  const params = {
    correctItemId: answerId,
    textItemId: textItemId ?? answerId,
    cue: question ? `Lis ${unit}. ${question}` : 'Lis le mot, puis touche la bonne image.',
    itemIds: rotate([answer, ...distractors].map(word), seed),
  };
  if (question) params.question = question;
  addExercise(lessonId, id, 'picture-match', params);
};
const imagedLike = (w, count) => similarWords(w, count, (x) => !IMAGES[x]);

/** Mélange déterministe (même résultat à chaque génération). */
const shuffle = (arr, seed) => {
  const h = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, seed + 7);
  const out = arr.map((x, i) => ({ x, key: h(`${x}#${i}`) })).sort((a, b) => a.key - b.key).map((o) => o.x);
  // Jamais dans l'ordre de la réponse : l'enfant doit vraiment assembler.
  return out.join() === arr.join() ? [...out.slice(1), out[0]] : out;
};

/** Syllabe piège pour l'assemblage : inversion (ma → am) ou lettre sosie (é → è). */
function trapSyllable(syllables) {
  const first = syllables[0];
  const chars = [...first];
  let trap = chars.length === 2 ? chars.reverse().join('') : '';
  if (!trap || syllables.includes(trap)) {
    const i = [...first].findIndex((c) => LOOKALIKE[c]);
    const c = [...first];
    c[i] = LOOKALIKE[c[i]];
    trap = c.join('');
  }
  return trap;
}

/** Assemblage : la voix dit le mot, l'enfant remet ses syllabes dans l'ordre (+ 1 piège). */
const assemble = (lessonId, id, w, seed) => {
  const wordId = word(w);
  const syl = items.get(wordId).syllables;
  const tiles = [...syl, trapSyllable(syl)].map(syllable);
  addExercise(lessonId, id, 'syllable-assembly', { correctItemId: wordId, itemIds: shuffle(tiles, seed) });
};

const byLevel = [...lecons].sort((a, b) => a.niveau_id - b.niveau_id || a.ordre - b.ordre);
let sentenceIndex = 0;
let textIndex = 0;
for (const [index, l] of byLevel.entries()) {
  const level = LEVEL_KEYS[l.niveau_id];
  const mot = motByLesson.get(l.id);
  const target = l.son_cible;
  const k = index; // rotation des choix

  if (l.titre.startsWith('Le son')) {
    const key = slug(target === 'é' ? 'e-aigu' : target);
    const lessonId = `l-son-${key}`;
    addNode(level, `n-son-${key}`, lessonId, l.titre, l.objectif, Number(l.duree_minutes));
    const cueWord = CUE_WORD_FIX[target]?.word ?? mot.mot;
    const g = grapheme(target);
    const [c1, c2] = CONFUSABLE[target].map(grapheme);
    const say = SAY[target] ?? target;
    sg(lessonId, `e-son-${key}-1`, g, `${say}, comme dans ${cueWord}`, rotate([g, c1], k));
    const notTarget = (w) => w.includes(target);
    wr(lessonId, `e-son-${key}-2`, word(cueWord), rotate([cueWord, ...similarWords(cueWord, 2, notTarget)].map(word), k));
    // Sons complexes (et ch/ou) : l'enfant sait lire des mots ; il lit le mot-repère.
    if ((level === 'complex-sounds' || level === 'syllables') && IMAGES[cueWord]) {
      pictureMatch(lessonId, `e-son-${key}-image`, cueWord, imagedLike(cueWord, 2), k);
    }
    sg(lessonId, `e-son-${key}-3`, g, say, rotate([c1, g, c2], k));
    const second = SECOND_WORD[target];
    if (second) {
      const distract = similarWords(second, 2, (w) => notTarget(w) || w === cueWord);
      wr(lessonId, `e-son-${key}-4`, word(second), rotate([second, ...distract].map(word), k + 1));
    }
    tr(lessonId, `e-son-${key}-trace`, g);
  } else if (l.titre.startsWith('La syllabe')) {
    const key = slug(target);
    const lessonId = `l-syl-${key}`;
    addNode(level, `n-syl-${key}`, lessonId, l.titre, l.objectif, Number(l.duree_minutes));
    const s = syllable(target);
    const [near1, near2] = SYLLABLE_NEAR[target].map(syllable);
    const inverted = syllable([...target].reverse().join(''));
    const helper = SYLLABLE_WORD[target];
    sg(lessonId, `e-syl-${key}-1`, s, helper ? `${target}, comme dans ${helper}` : target, rotate([s, near1], k));
    sg(lessonId, `e-syl-${key}-2`, s, target, rotate([inverted, s], k));
    sg(lessonId, `e-syl-${key}-3`, s, target, rotate([near2, s, near1], k));
    if (helper) {
      wr(lessonId, `e-syl-${key}-4`, word(helper), rotate([helper, ...similarWords(helper, 2)].map(word), k));
      pictureMatch(lessonId, `e-syl-${key}-image`, helper, imagedLike(helper, 2), k + 1);
      assemble(lessonId, `e-syl-${key}-assemble`, helper, k);
    }
  } else if (l.titre.startsWith('Le mot')) {
    const key = slug(target);
    const lessonId = `l-mot-${key}`;
    addNode(level, `n-mot-${key}`, lessonId, l.titre, l.objectif, Number(l.duree_minutes));
    const w = word(target);
    const [d1, d2, d3, d4] = similarWords(target, 4).map(word);
    // D'abord lire seul (la voix n'a pas encore dit le mot), puis écouter.
    pictureMatch(lessonId, `e-mot-${key}-image`, target, imagedLike(target, 2), k);
    wr(lessonId, `e-mot-${key}-1`, w, rotate([w, d1, d2], k));
    wr(lessonId, `e-mot-${key}-2`, w, rotate([d3, w, d4], k));
    wr(lessonId, `e-mot-${key}-3`, w, rotate([lookalike(target), w], k));
    if (items.get(w).syllables.length > 1) assemble(lessonId, `e-mot-${key}-assemble`, target, k);
  } else if (l.titre.startsWith('Texte')) {
    textIndex++;
    addNode(level, `n-texte-${textIndex}`, `l-texte-${textIndex}`, l.titre, l.objectif, Number(l.duree_minutes));
  } else if (l.titre.startsWith('Phrase')) {
    sentenceIndex++;
    const lessonId = `l-phrase-${sentenceIndex}`;
    addNode(level, `n-phrase-${sentenceIndex}`, lessonId, l.titre, l.objectif, Number(l.duree_minutes));
  } else {
    throw new Error(`type de leçon inconnu : ${l.titre}`);
  }

  // Leçons miroir : juste après le dernier son du niveau 2.
  const next = byLevel[index + 1];
  if (Number(l.niveau_id) === 2 && (!next || Number(next.niveau_id) !== 2)) {
    for (const m of MIRROR_LESSONS) {
      addNode('letters', m.nodeId, m.lessonId, m.title, m.objective, 6);
      for (const [id, type, t, ...rest] of m.exercises) {
        if (type === 'sg') sg(m.lessonId, id, grapheme(t), rest[0], rest[1].map(grapheme));
        else if (type === 'tr') tr(m.lessonId, id, grapheme(t));
        else wr(m.lessonId, id, word(t), rest[0].map(word));
      }
    }
  }
}

// Phrases : les items de phrase sont créés une fois toutes connues (distracteurs = autres phrases).
const sentences = byLevel.filter((l) => l.titre.startsWith('Phrase')).map((l) => motByLesson.get(l.id));
const sentenceIds = sentences.map((m, i) =>
  add({ id: `p-${i + 1}`, type: 'sentence', label: m.mot, phoneme: m.audio_text, syllables: m.syllabes.split(' ') }),
);
const tokens = (sentence) =>
  sentence
    .split(' ')
    .map((t) => t.replace(/[.,!?]/g, '').replace(/^.*[’']/, '').toLowerCase())
    .filter(Boolean);
sentences.forEach((m, i) => {
  const lessonId = `l-phrase-${i + 1}`;
  const others = [sentenceIds[(i + 1) % sentenceIds.length], sentenceIds[(i + 2) % sentenceIds.length]];
  wr(lessonId, `e-phrase-${i + 1}-1`, sentenceIds[i], rotate([sentenceIds[i], ...others], i));
  const [{ question, answer, traps }] = QUESTIONS[m.lecon_id];
  pictureMatch(lessonId, `e-phrase-${i + 1}-sens`, answer, traps, i, { textItemId: sentenceIds[i], question });
  const words = tokens(m.mot).map(word);
  SENTENCE_TARGETS[i].forEach((t, j) => wr(lessonId, `e-phrase-${i + 1}-${j + 2}`, word(t), words));
});

// Textes courts : le texte entier se lit seul, deux questions de compréhension, une phrase
// et un mot à retrouver à l'oreille.
const splitSentences = (t) => t.split(/(?<=[.!?])\s+/);
byLevel
  .filter((l) => l.titre.startsWith('Texte'))
  .forEach((l, i) => {
    const m = motByLesson.get(l.id);
    const n = i + 1;
    const lessonId = `l-texte-${n}`;
    const textId = add({ id: `t-${n}`, type: 'sentence', label: m.mot, phoneme: m.audio_text, syllables: m.syllabes.split(' ') });
    const syl = splitSentences(m.syllabes);
    const sentenceIds = splitSentences(m.mot).map((label, j) =>
      add({ id: `p-t${n}-${j + 1}`, type: 'sentence', label, phoneme: label, syllables: syl[j].split(' ') }),
    );
    const [q1, q2] = QUESTIONS[l.id];
    pictureMatch(lessonId, `e-texte-${n}-1`, q1.answer, q1.traps, i, { textItemId: textId, question: q1.question, unit: 'le texte' });
    wr(lessonId, `e-texte-${n}-2`, sentenceIds[1], rotate(sentenceIds, i));
    pictureMatch(lessonId, `e-texte-${n}-3`, q2.answer, q2.traps, i + 1, { textItemId: textId, question: q2.question, unit: 'le texte' });
    wr(lessonId, `e-texte-${n}-4`, word(q2.answer), rotate([q2.answer, q1.answer, q2.traps[0]].map(word), i));
  });

// --- Bilans : une leçon de révision à la fin de chaque niveau ---

/** Préférence de type pour la révision (le tracé n'y figure pas). */
const REVIEW_ORDER = ['picture-match', 'syllable-assembly', 'sound-grapheme', 'word-recognition'];
const REVIEW_SIZE = 6;
for (const lvl of levels) {
  const levelLessons = lessons.filter((l) => nodes.find((n) => n.id === l.nodeId).level === lvl.key);
  // Leçons réparties sur tout le niveau ; on y revient si le niveau en compte moins de 6.
  const picks = [];
  const used = new Set();
  for (let round = 0; picks.length < REVIEW_SIZE && round < REVIEW_ORDER.length; round++) {
    const step = levelLessons.length / Math.min(REVIEW_SIZE - picks.length, levelLessons.length);
    for (let i = 0; i < levelLessons.length && picks.length < REVIEW_SIZE; i += step) {
      const pool = exercises.filter((e) => e.lessonId === levelLessons[Math.floor(i)].id && !used.has(e.id));
      // Son ⇄ lettre : la version sans mot-repère (« a » seul), plus exigeante.
      const hintless = pool.filter((e) => e.type !== 'sound-grapheme' || !e.params.cue.includes('comme'));
      const ex = REVIEW_ORDER.map((t) => hintless.find((e) => e.type === t) ?? pool.find((e) => e.type === t)).find(Boolean);
      if (ex) {
        used.add(ex.id);
        picks.push(ex);
      }
    }
  }
  const nodeId = `n-bilan-${lvl.rank}`;
  const lessonId = `l-bilan-${lvl.rank}`;
  const last = nodes.findLastIndex((n) => n.level === lvl.key);
  nodes.splice(last + 1, 0, { id: nodeId, level: lvl.key, title: `Bilan : ${lvl.name}`, order: 0, unlockedWhen: 0 });
  lessons.push({
    id: lessonId,
    nodeId,
    title: `Bilan : ${lvl.name}`,
    objective: `Je revois tout le niveau ${lvl.rank} : ${lvl.objective.charAt(0).toLowerCase()}${lvl.objective.slice(1)}.`,
    durationMin: 6,
    order: 1,
  });
  picks.forEach((e, i) => exercises.push({ ...e, id: `e-bilan-${lvl.rank}-${i + 1}`, lessonId, order: i + 1 }));
}
// Ordre du parcours et déblocage séquentiel recalculés après insertion des bilans.
nodes.forEach((n, i) => {
  n.order = i + 1;
  n.unlockedWhen = i;
});

// --- Vérifications ---

const itemList = [...items.values()];
for (const e of exercises) {
  const ids = e.params.itemIds;
  for (const id of ids) if (!items.has(id)) throw new Error(`${e.id} : item inconnu ${id}`);
  if (e.type === 'tracing') {
    if (ids.length !== 1 || ids[0] !== e.params.correctItemId) throw new Error(`${e.id} : tracé invalide`);
    continue;
  }
  if (e.type === 'picture-match') {
    if (!items.has(e.params.textItemId)) throw new Error(`${e.id} : texte à lire inconnu`);
    for (const id of ids) if (!items.get(id).image) throw new Error(`${e.id} : ${id} sans image`);
  }
  if (e.type === 'syllable-assembly') {
    const answer = items.get(e.params.correctItemId).syllables;
    const pool = ids.map((id) => items.get(id).label);
    for (const syl of answer) {
      const at = pool.indexOf(syl);
      if (at < 0) throw new Error(`${e.id} : syllabe manquante ${syl}`);
      pool.splice(at, 1);
    }
    if (answer.length < 2 || pool.length !== 1 || answer.includes(pool[0])) throw new Error(`${e.id} : piège invalide`);
    continue;
  }
  if (new Set(ids).size !== ids.length || ids.length < 2) throw new Error(`${e.id} : choix invalides`);
  const right =
    e.type === 'sound-grapheme'
      ? ids.filter((id) => items.get(id).phoneme === e.params.phoneme)
      : ids.filter((id) => id === e.params.correctItemId);
  if (right.length !== 1) throw new Error(`${e.id} : ${right.length} bonne(s) réponse(s)`);
}
for (const l of lessons) {
  if (exercises.filter((e) => e.lessonId === l.id).length < 3) throw new Error(`${l.id} : moins de 3 exercices`);
}

// --- Écriture ---

const curriculum = { levels, nodes, lessons, items: itemList, exercises };
const banner = 'Généré par content/curriculum/generate.mjs depuis content/curriculum/*.csv — ne pas éditer.';
const q = (s) => JSON.stringify(s);

const ts = `// ${banner}
import type { CurriculumLevel, Exercise, Lesson, PedagogyItem, SkillNode } from './model';

export const CURRICULUM_LEVELS: CurriculumLevel[] = ${JSON.stringify(levels, null, 2)};

export const CURRICULUM_NODES: SkillNode[] = ${JSON.stringify(nodes, null, 2)};

export const CURRICULUM_LESSONS: Lesson[] = ${JSON.stringify(lessons, null, 2)};

export const CURRICULUM_ITEMS: PedagogyItem[] = ${JSON.stringify(itemList, null, 2)};

export const CURRICULUM_EXERCISES: Exercise[] = ${JSON.stringify(exercises, null, 2)};
`;

const dartType = { grapheme: 'ItemType.grapheme', syllable: 'ItemType.syllable', word: 'ItemType.word', sentence: 'ItemType.sentence' };
const dartExType = {
  'sound-grapheme': 'ExerciseType.soundGrapheme',
  'word-recognition': 'ExerciseType.wordRecognition',
  'syllable-assembly': 'ExerciseType.syllableAssembly',
  tracing: 'ExerciseType.tracing',
  'picture-match': 'ExerciseType.pictureMatch',
};
const dartList = (xs) => `[${xs.map(q).join(', ')}]`;
const dart = `// ${banner}
// ignore_for_file: lines_longer_than_80_chars
part of 'pedagogy.dart';

const curriculumLevels = [
${levels.map((l) => `  CurriculumLevel(rank: ${l.rank}, key: ${q(l.key)}, name: ${q(l.name)}, objective: ${q(l.objective)}),`).join('\n')}
];

const curriculumNodes = [
${nodes.map((n) => `  SkillNode(id: ${q(n.id)}, level: ${q(n.level)}, title: ${q(n.title)}, order: ${n.order}, unlockedWhen: ${n.unlockedWhen}),`).join('\n')}
];

const curriculumLessons = [
${lessons.map((l) => `  Lesson(id: ${q(l.id)}, nodeId: ${q(l.nodeId)}, title: ${q(l.title)}, objective: ${q(l.objective)}, durationMin: ${l.durationMin}),`).join('\n')}
];

const curriculumItems = [
${itemList.map((i) => `  PedagogyItem(id: ${q(i.id)}, type: ${dartType[i.type]}, label: ${q(i.label)}, phoneme: ${q(i.phoneme)}, syllables: ${dartList(i.syllables)}${i.image ? `, image: ${q(i.image)}` : ''}),`).join('\n')}
];

const curriculumExercises = [
${exercises
  .map((e) => {
    const p = e.params;
    const args = [`id: ${q(e.id)}`, `lessonId: ${q(e.lessonId)}`, `type: ${dartExType[e.type]}`, `order: ${e.order}`];
    if (p.phoneme !== undefined) args.push(`phoneme: ${q(p.phoneme)}`);
    if (p.cue !== undefined) args.push(`cue: ${q(p.cue)}`);
    if (p.correctItemId !== undefined) args.push(`correctItemId: ${q(p.correctItemId)}`);
    if (p.textItemId !== undefined) args.push(`textItemId: ${q(p.textItemId)}`);
    if (p.question !== undefined) args.push(`question: ${q(p.question)}`);
    args.push(`itemIds: ${dartList(p.itemIds)}`);
    return `  Exercise(${args.join(', ')}),`;
  })
  .join('\n')}
];
`;

const outputs = {
  'packages/core/src/pedagogy/curriculum.generated.ts': ts,
  'apps/mobile-flutter/lib/domain/curriculum.g.dart': dart,
  'apps/api-laravel/database/seeders/data/curriculum.json': JSON.stringify(curriculum, null, 2) + '\n',
};

const check = process.argv.includes('--check');
let stale = 0;
for (const [path, content] of Object.entries(outputs)) {
  const full = join(root, path);
  if (check) {
    let current = '';
    try {
      current = readFileSync(full, 'utf8');
    } catch {}
    if (current !== content) {
      console.error(`✗ ${path} n'est pas à jour : lancez node content/curriculum/generate.mjs`);
      stale++;
    }
  } else {
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
    console.log(`✓ ${relative(root, full)}`);
  }
}
if (stale) process.exit(1);
console.log(
  `${levels.length} niveaux · ${nodes.length} leçons · ${exercises.length} exercices · ${itemList.length} items`,
);
