// Généré par content/curriculum/generate.mjs depuis content/curriculum/*.csv — ne pas éditer.
import type { CurriculumLevel, Exercise, Lesson, PedagogyItem, SkillNode } from './model';

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    "rank": 1,
    "key": "sounds",
    "name": "Sons et écoute",
    "objective": "Reconnaître les sons de la langue"
  },
  {
    "rank": 2,
    "key": "letters",
    "name": "Lettres et sons",
    "objective": "Associer chaque lettre à son son"
  },
  {
    "rank": 3,
    "key": "syllables",
    "name": "Syllabes",
    "objective": "Découper et assembler des syllabes"
  },
  {
    "rank": 4,
    "key": "words",
    "name": "Mots simples",
    "objective": "Lire des mots courts et fréquents"
  },
  {
    "rank": 5,
    "key": "complex-sounds",
    "name": "Sons complexes",
    "objective": "Reconnaître les sons composés"
  },
  {
    "rank": 6,
    "key": "sentences",
    "name": "Phrases et compréhension",
    "objective": "Lire et comprendre de courtes phrases"
  },
  {
    "rank": 7,
    "key": "short-texts",
    "name": "Textes courts",
    "objective": "Lire et comprendre un petit texte de quelques phrases"
  }
];

export const CURRICULUM_NODES: SkillNode[] = [
  {
    "id": "n-son-a",
    "level": "sounds",
    "title": "Le son /a/",
    "order": 1,
    "unlockedWhen": 0
  },
  {
    "id": "n-son-e",
    "level": "sounds",
    "title": "Le son /e/",
    "order": 2,
    "unlockedWhen": 1
  },
  {
    "id": "n-son-i",
    "level": "sounds",
    "title": "Le son /i/",
    "order": 3,
    "unlockedWhen": 2
  },
  {
    "id": "n-son-o",
    "level": "sounds",
    "title": "Le son /o/",
    "order": 4,
    "unlockedWhen": 3
  },
  {
    "id": "n-son-u",
    "level": "sounds",
    "title": "Le son /u/",
    "order": 5,
    "unlockedWhen": 4
  },
  {
    "id": "n-son-e-aigu",
    "level": "sounds",
    "title": "Le son /é/",
    "order": 6,
    "unlockedWhen": 5
  },
  {
    "id": "n-bilan-1",
    "level": "sounds",
    "title": "Bilan : Sons et écoute",
    "order": 7,
    "unlockedWhen": 6
  },
  {
    "id": "n-son-m",
    "level": "letters",
    "title": "Le son /m/",
    "order": 8,
    "unlockedWhen": 7
  },
  {
    "id": "n-son-p",
    "level": "letters",
    "title": "Le son /p/",
    "order": 9,
    "unlockedWhen": 8
  },
  {
    "id": "n-son-t",
    "level": "letters",
    "title": "Le son /t/",
    "order": 10,
    "unlockedWhen": 9
  },
  {
    "id": "n-son-s",
    "level": "letters",
    "title": "Le son /s/",
    "order": 11,
    "unlockedWhen": 10
  },
  {
    "id": "n-son-l",
    "level": "letters",
    "title": "Le son /l/",
    "order": 12,
    "unlockedWhen": 11
  },
  {
    "id": "n-son-r",
    "level": "letters",
    "title": "Le son /r/",
    "order": 13,
    "unlockedWhen": 12
  },
  {
    "id": "n-son-n",
    "level": "letters",
    "title": "Le son /n/",
    "order": 14,
    "unlockedWhen": 13
  },
  {
    "id": "n-son-d",
    "level": "letters",
    "title": "Le son /d/",
    "order": 15,
    "unlockedWhen": 14
  },
  {
    "id": "n-son-f",
    "level": "letters",
    "title": "Le son /f/",
    "order": 16,
    "unlockedWhen": 15
  },
  {
    "id": "n-son-v",
    "level": "letters",
    "title": "Le son /v/",
    "order": 17,
    "unlockedWhen": 16
  },
  {
    "id": "n-son-b",
    "level": "letters",
    "title": "Le son /b/",
    "order": 18,
    "unlockedWhen": 17
  },
  {
    "id": "n-son-j",
    "level": "letters",
    "title": "Le son /j/",
    "order": 19,
    "unlockedWhen": 18
  },
  {
    "id": "n-son-c",
    "level": "letters",
    "title": "Le son /k/ écrit c",
    "order": 20,
    "unlockedWhen": 19
  },
  {
    "id": "n-son-g",
    "level": "letters",
    "title": "Le son /g/ écrit g",
    "order": 21,
    "unlockedWhen": 20
  },
  {
    "id": "n-son-z",
    "level": "letters",
    "title": "Le son /z/",
    "order": 22,
    "unlockedWhen": 21
  },
  {
    "id": "n-letters-bd",
    "level": "letters",
    "title": "b ou d ?",
    "order": 23,
    "unlockedWhen": 22
  },
  {
    "id": "n-letters-pq",
    "level": "letters",
    "title": "p ou q ?",
    "order": 24,
    "unlockedWhen": 23
  },
  {
    "id": "n-bilan-2",
    "level": "letters",
    "title": "Bilan : Lettres et sons",
    "order": 25,
    "unlockedWhen": 24
  },
  {
    "id": "n-son-ch",
    "level": "syllables",
    "title": "Le son /ch/",
    "order": 26,
    "unlockedWhen": 25
  },
  {
    "id": "n-son-ou",
    "level": "syllables",
    "title": "Le son /ou/",
    "order": 27,
    "unlockedWhen": 26
  },
  {
    "id": "n-syl-ma",
    "level": "syllables",
    "title": "La syllabe « ma »",
    "order": 28,
    "unlockedWhen": 27
  },
  {
    "id": "n-syl-pa",
    "level": "syllables",
    "title": "La syllabe « pa »",
    "order": 29,
    "unlockedWhen": 28
  },
  {
    "id": "n-syl-ta",
    "level": "syllables",
    "title": "La syllabe « ta »",
    "order": 30,
    "unlockedWhen": 29
  },
  {
    "id": "n-syl-la",
    "level": "syllables",
    "title": "La syllabe « la »",
    "order": 31,
    "unlockedWhen": 30
  },
  {
    "id": "n-syl-mi",
    "level": "syllables",
    "title": "La syllabe « mi »",
    "order": 32,
    "unlockedWhen": 31
  },
  {
    "id": "n-syl-pi",
    "level": "syllables",
    "title": "La syllabe « pi »",
    "order": 33,
    "unlockedWhen": 32
  },
  {
    "id": "n-syl-ti",
    "level": "syllables",
    "title": "La syllabe « ti »",
    "order": 34,
    "unlockedWhen": 33
  },
  {
    "id": "n-syl-li",
    "level": "syllables",
    "title": "La syllabe « li »",
    "order": 35,
    "unlockedWhen": 34
  },
  {
    "id": "n-syl-mo",
    "level": "syllables",
    "title": "La syllabe « mo »",
    "order": 36,
    "unlockedWhen": 35
  },
  {
    "id": "n-syl-to",
    "level": "syllables",
    "title": "La syllabe « to »",
    "order": 37,
    "unlockedWhen": 36
  },
  {
    "id": "n-bilan-3",
    "level": "syllables",
    "title": "Bilan : Syllabes",
    "order": 38,
    "unlockedWhen": 37
  },
  {
    "id": "n-mot-maman",
    "level": "words",
    "title": "Le mot « maman »",
    "order": 39,
    "unlockedWhen": 38
  },
  {
    "id": "n-mot-papa",
    "level": "words",
    "title": "Le mot « papa »",
    "order": 40,
    "unlockedWhen": 39
  },
  {
    "id": "n-mot-livre",
    "level": "words",
    "title": "Le mot « livre »",
    "order": 41,
    "unlockedWhen": 40
  },
  {
    "id": "n-mot-ecole",
    "level": "words",
    "title": "Le mot « école »",
    "order": 42,
    "unlockedWhen": 41
  },
  {
    "id": "n-mot-maison",
    "level": "words",
    "title": "Le mot « maison »",
    "order": 43,
    "unlockedWhen": 42
  },
  {
    "id": "n-mot-ami",
    "level": "words",
    "title": "Le mot « ami »",
    "order": 44,
    "unlockedWhen": 43
  },
  {
    "id": "n-mot-chat",
    "level": "words",
    "title": "Le mot « chat »",
    "order": 45,
    "unlockedWhen": 44
  },
  {
    "id": "n-mot-lune",
    "level": "words",
    "title": "Le mot « lune »",
    "order": 46,
    "unlockedWhen": 45
  },
  {
    "id": "n-mot-fleur",
    "level": "words",
    "title": "Le mot « fleur »",
    "order": 47,
    "unlockedWhen": 46
  },
  {
    "id": "n-mot-velo",
    "level": "words",
    "title": "Le mot « vélo »",
    "order": 48,
    "unlockedWhen": 47
  },
  {
    "id": "n-bilan-4",
    "level": "words",
    "title": "Bilan : Mots simples",
    "order": 49,
    "unlockedWhen": 48
  },
  {
    "id": "n-son-oi",
    "level": "complex-sounds",
    "title": "Le son /oi/",
    "order": 50,
    "unlockedWhen": 49
  },
  {
    "id": "n-son-an",
    "level": "complex-sounds",
    "title": "Le son /an/",
    "order": 51,
    "unlockedWhen": 50
  },
  {
    "id": "n-son-on",
    "level": "complex-sounds",
    "title": "Le son /on/",
    "order": 52,
    "unlockedWhen": 51
  },
  {
    "id": "n-son-in",
    "level": "complex-sounds",
    "title": "Le son /in/",
    "order": 53,
    "unlockedWhen": 52
  },
  {
    "id": "n-son-eau",
    "level": "complex-sounds",
    "title": "Le son /eau/",
    "order": 54,
    "unlockedWhen": 53
  },
  {
    "id": "n-son-ai",
    "level": "complex-sounds",
    "title": "Le son /è/ écrit ai",
    "order": 55,
    "unlockedWhen": 54
  },
  {
    "id": "n-son-ei",
    "level": "complex-sounds",
    "title": "Le son /è/ écrit ei",
    "order": 56,
    "unlockedWhen": 55
  },
  {
    "id": "n-son-au",
    "level": "complex-sounds",
    "title": "Le son /o/ écrit au",
    "order": 57,
    "unlockedWhen": 56
  },
  {
    "id": "n-son-eu",
    "level": "complex-sounds",
    "title": "Le son /eu/",
    "order": 58,
    "unlockedWhen": 57
  },
  {
    "id": "n-son-en",
    "level": "complex-sounds",
    "title": "Le son /an/ écrit en",
    "order": 59,
    "unlockedWhen": 58
  },
  {
    "id": "n-son-gn",
    "level": "complex-sounds",
    "title": "Le son /gn/",
    "order": 60,
    "unlockedWhen": 59
  },
  {
    "id": "n-son-ill",
    "level": "complex-sounds",
    "title": "Le son /ill/",
    "order": 61,
    "unlockedWhen": 60
  },
  {
    "id": "n-son-ph",
    "level": "complex-sounds",
    "title": "Le son /f/ écrit ph",
    "order": 62,
    "unlockedWhen": 61
  },
  {
    "id": "n-son-qu",
    "level": "complex-sounds",
    "title": "Le son /k/ écrit qu",
    "order": 63,
    "unlockedWhen": 62
  },
  {
    "id": "n-son-gu",
    "level": "complex-sounds",
    "title": "Le son /g/ écrit gu",
    "order": 64,
    "unlockedWhen": 63
  },
  {
    "id": "n-bilan-5",
    "level": "complex-sounds",
    "title": "Bilan : Sons complexes",
    "order": 65,
    "unlockedWhen": 64
  },
  {
    "id": "n-phrase-1",
    "level": "sentences",
    "title": "Phrase : « Le chat dort. »",
    "order": 66,
    "unlockedWhen": 65
  },
  {
    "id": "n-phrase-2",
    "level": "sentences",
    "title": "Phrase : « Papa lit un livre. »",
    "order": 67,
    "unlockedWhen": 66
  },
  {
    "id": "n-phrase-3",
    "level": "sentences",
    "title": "Phrase : « La lune est belle. »",
    "order": 68,
    "unlockedWhen": 67
  },
  {
    "id": "n-phrase-4",
    "level": "sentences",
    "title": "Phrase : « Maman aime les fleurs. »",
    "order": 69,
    "unlockedWhen": 68
  },
  {
    "id": "n-phrase-5",
    "level": "sentences",
    "title": "Phrase : « Je vais à l’école. »",
    "order": 70,
    "unlockedWhen": 69
  },
  {
    "id": "n-bilan-6",
    "level": "sentences",
    "title": "Bilan : Phrases et compréhension",
    "order": 71,
    "unlockedWhen": 70
  },
  {
    "id": "n-texte-1",
    "level": "short-texts",
    "title": "Texte : « Le petit chat »",
    "order": 72,
    "unlockedWhen": 71
  },
  {
    "id": "n-texte-2",
    "level": "short-texts",
    "title": "Texte : « À la mer »",
    "order": 73,
    "unlockedWhen": 72
  },
  {
    "id": "n-texte-3",
    "level": "short-texts",
    "title": "Texte : « La fête de bébé »",
    "order": 74,
    "unlockedWhen": 73
  },
  {
    "id": "n-texte-4",
    "level": "short-texts",
    "title": "Texte : « La neige »",
    "order": 75,
    "unlockedWhen": 74
  },
  {
    "id": "n-texte-5",
    "level": "short-texts",
    "title": "Texte : « Au zoo »",
    "order": 76,
    "unlockedWhen": 75
  },
  {
    "id": "n-bilan-7",
    "level": "short-texts",
    "title": "Bilan : Textes courts",
    "order": 77,
    "unlockedWhen": 76
  }
];

export const CURRICULUM_LESSONS: Lesson[] = [
  {
    "id": "l-son-a",
    "nodeId": "n-son-a",
    "title": "Le son /a/",
    "objective": "Reconnaître, entendre, associer et tracer le son /a/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-e",
    "nodeId": "n-son-e",
    "title": "Le son /e/",
    "objective": "Reconnaître, entendre, associer et tracer le son /e/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-i",
    "nodeId": "n-son-i",
    "title": "Le son /i/",
    "objective": "Reconnaître, entendre, associer et tracer le son /i/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-o",
    "nodeId": "n-son-o",
    "title": "Le son /o/",
    "objective": "Reconnaître, entendre, associer et tracer le son /o/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-u",
    "nodeId": "n-son-u",
    "title": "Le son /u/",
    "objective": "Reconnaître, entendre, associer et tracer le son /u/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-e-aigu",
    "nodeId": "n-son-e-aigu",
    "title": "Le son /é/",
    "objective": "Reconnaître, entendre, associer et tracer le son /é/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-m",
    "nodeId": "n-son-m",
    "title": "Le son /m/",
    "objective": "Reconnaître, entendre, associer et tracer le son /m/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-p",
    "nodeId": "n-son-p",
    "title": "Le son /p/",
    "objective": "Reconnaître, entendre, associer et tracer le son /p/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-t",
    "nodeId": "n-son-t",
    "title": "Le son /t/",
    "objective": "Reconnaître, entendre, associer et tracer le son /t/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-s",
    "nodeId": "n-son-s",
    "title": "Le son /s/",
    "objective": "Reconnaître, entendre, associer et tracer le son /s/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-l",
    "nodeId": "n-son-l",
    "title": "Le son /l/",
    "objective": "Reconnaître, entendre, associer et tracer le son /l/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-r",
    "nodeId": "n-son-r",
    "title": "Le son /r/",
    "objective": "Reconnaître, entendre, associer et tracer le son /r/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-n",
    "nodeId": "n-son-n",
    "title": "Le son /n/",
    "objective": "Reconnaître, entendre, associer et tracer le son /n/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-d",
    "nodeId": "n-son-d",
    "title": "Le son /d/",
    "objective": "Reconnaître, entendre, associer et tracer le son /d/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-f",
    "nodeId": "n-son-f",
    "title": "Le son /f/",
    "objective": "Reconnaître, entendre, associer et tracer le son /f/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-v",
    "nodeId": "n-son-v",
    "title": "Le son /v/",
    "objective": "Reconnaître, entendre, associer et tracer le son /v/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-b",
    "nodeId": "n-son-b",
    "title": "Le son /b/",
    "objective": "Reconnaître, entendre, associer et tracer le son /b/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-j",
    "nodeId": "n-son-j",
    "title": "Le son /j/",
    "objective": "Reconnaître, entendre, associer et tracer le son /j/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-c",
    "nodeId": "n-son-c",
    "title": "Le son /k/ écrit c",
    "objective": "Reconnaître, entendre, associer et tracer le son /k/ écrit c.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-g",
    "nodeId": "n-son-g",
    "title": "Le son /g/ écrit g",
    "objective": "Reconnaître, entendre, associer et tracer le son /g/ écrit g.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-z",
    "nodeId": "n-son-z",
    "title": "Le son /z/",
    "objective": "Reconnaître, entendre, associer et tracer le son /z/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-bd-1",
    "nodeId": "n-letters-bd",
    "title": "b ou d ?",
    "objective": "Ne plus confondre b et d, les lettres en miroir.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-pq-1",
    "nodeId": "n-letters-pq",
    "title": "p ou q ?",
    "objective": "Ne plus confondre p et q, les lettres en miroir.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-son-ch",
    "nodeId": "n-son-ch",
    "title": "Le son /ch/",
    "objective": "Reconnaître, entendre, associer et tracer le son /ch/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-ou",
    "nodeId": "n-son-ou",
    "title": "Le son /ou/",
    "objective": "Reconnaître, entendre, associer et tracer le son /ou/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-ma",
    "nodeId": "n-syl-ma",
    "title": "La syllabe « ma »",
    "objective": "Découper, entendre et assembler la syllabe « ma ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-pa",
    "nodeId": "n-syl-pa",
    "title": "La syllabe « pa »",
    "objective": "Découper, entendre et assembler la syllabe « pa ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-ta",
    "nodeId": "n-syl-ta",
    "title": "La syllabe « ta »",
    "objective": "Découper, entendre et assembler la syllabe « ta ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-la",
    "nodeId": "n-syl-la",
    "title": "La syllabe « la »",
    "objective": "Découper, entendre et assembler la syllabe « la ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-mi",
    "nodeId": "n-syl-mi",
    "title": "La syllabe « mi »",
    "objective": "Découper, entendre et assembler la syllabe « mi ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-pi",
    "nodeId": "n-syl-pi",
    "title": "La syllabe « pi »",
    "objective": "Découper, entendre et assembler la syllabe « pi ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-ti",
    "nodeId": "n-syl-ti",
    "title": "La syllabe « ti »",
    "objective": "Découper, entendre et assembler la syllabe « ti ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-li",
    "nodeId": "n-syl-li",
    "title": "La syllabe « li »",
    "objective": "Découper, entendre et assembler la syllabe « li ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-mo",
    "nodeId": "n-syl-mo",
    "title": "La syllabe « mo »",
    "objective": "Découper, entendre et assembler la syllabe « mo ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-syl-to",
    "nodeId": "n-syl-to",
    "title": "La syllabe « to »",
    "objective": "Découper, entendre et assembler la syllabe « to ».",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-mot-maman",
    "nodeId": "n-mot-maman",
    "title": "Le mot « maman »",
    "objective": "Lire, écouter, épeler et comprendre le mot « maman ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-papa",
    "nodeId": "n-mot-papa",
    "title": "Le mot « papa »",
    "objective": "Lire, écouter, épeler et comprendre le mot « papa ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-livre",
    "nodeId": "n-mot-livre",
    "title": "Le mot « livre »",
    "objective": "Lire, écouter, épeler et comprendre le mot « livre ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-ecole",
    "nodeId": "n-mot-ecole",
    "title": "Le mot « école »",
    "objective": "Lire, écouter, épeler et comprendre le mot « école ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-maison",
    "nodeId": "n-mot-maison",
    "title": "Le mot « maison »",
    "objective": "Lire, écouter, épeler et comprendre le mot « maison ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-ami",
    "nodeId": "n-mot-ami",
    "title": "Le mot « ami »",
    "objective": "Lire, écouter, épeler et comprendre le mot « ami ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-chat",
    "nodeId": "n-mot-chat",
    "title": "Le mot « chat »",
    "objective": "Lire, écouter, épeler et comprendre le mot « chat ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-lune",
    "nodeId": "n-mot-lune",
    "title": "Le mot « lune »",
    "objective": "Lire, écouter, épeler et comprendre le mot « lune ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-fleur",
    "nodeId": "n-mot-fleur",
    "title": "Le mot « fleur »",
    "objective": "Lire, écouter, épeler et comprendre le mot « fleur ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-mot-velo",
    "nodeId": "n-mot-velo",
    "title": "Le mot « vélo »",
    "objective": "Lire, écouter, épeler et comprendre le mot « vélo ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-son-oi",
    "nodeId": "n-son-oi",
    "title": "Le son /oi/",
    "objective": "Reconnaître, entendre, associer et tracer le son /oi/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-an",
    "nodeId": "n-son-an",
    "title": "Le son /an/",
    "objective": "Reconnaître, entendre, associer et tracer le son /an/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-on",
    "nodeId": "n-son-on",
    "title": "Le son /on/",
    "objective": "Reconnaître, entendre, associer et tracer le son /on/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-in",
    "nodeId": "n-son-in",
    "title": "Le son /in/",
    "objective": "Reconnaître, entendre, associer et tracer le son /in/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-eau",
    "nodeId": "n-son-eau",
    "title": "Le son /eau/",
    "objective": "Reconnaître, entendre, associer et tracer le son /eau/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-ai",
    "nodeId": "n-son-ai",
    "title": "Le son /è/ écrit ai",
    "objective": "Reconnaître, entendre, associer et tracer le son /è/ écrit ai.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-ei",
    "nodeId": "n-son-ei",
    "title": "Le son /è/ écrit ei",
    "objective": "Reconnaître, entendre, associer et tracer le son /è/ écrit ei.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-au",
    "nodeId": "n-son-au",
    "title": "Le son /o/ écrit au",
    "objective": "Reconnaître, entendre, associer et tracer le son /o/ écrit au.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-eu",
    "nodeId": "n-son-eu",
    "title": "Le son /eu/",
    "objective": "Reconnaître, entendre, associer et tracer le son /eu/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-en",
    "nodeId": "n-son-en",
    "title": "Le son /an/ écrit en",
    "objective": "Reconnaître, entendre, associer et tracer le son /an/ écrit en.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-gn",
    "nodeId": "n-son-gn",
    "title": "Le son /gn/",
    "objective": "Reconnaître, entendre, associer et tracer le son /gn/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-ill",
    "nodeId": "n-son-ill",
    "title": "Le son /ill/",
    "objective": "Reconnaître, entendre, associer et tracer le son /ill/.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-ph",
    "nodeId": "n-son-ph",
    "title": "Le son /f/ écrit ph",
    "objective": "Reconnaître, entendre, associer et tracer le son /f/ écrit ph.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-qu",
    "nodeId": "n-son-qu",
    "title": "Le son /k/ écrit qu",
    "objective": "Reconnaître, entendre, associer et tracer le son /k/ écrit qu.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-son-gu",
    "nodeId": "n-son-gu",
    "title": "Le son /g/ écrit gu",
    "objective": "Reconnaître, entendre, associer et tracer le son /g/ écrit gu.",
    "durationMin": 7,
    "order": 1
  },
  {
    "id": "l-phrase-1",
    "nodeId": "n-phrase-1",
    "title": "Phrase : « Le chat dort. »",
    "objective": "Écouter, lire et comprendre la phrase « Le chat dort. ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-phrase-2",
    "nodeId": "n-phrase-2",
    "title": "Phrase : « Papa lit un livre. »",
    "objective": "Écouter, lire et comprendre la phrase « Papa lit un livre. ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-phrase-3",
    "nodeId": "n-phrase-3",
    "title": "Phrase : « La lune est belle. »",
    "objective": "Écouter, lire et comprendre la phrase « La lune est belle. ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-phrase-4",
    "nodeId": "n-phrase-4",
    "title": "Phrase : « Maman aime les fleurs. »",
    "objective": "Écouter, lire et comprendre la phrase « Maman aime les fleurs. ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-phrase-5",
    "nodeId": "n-phrase-5",
    "title": "Phrase : « Je vais à l’école. »",
    "objective": "Écouter, lire et comprendre la phrase « Je vais à l’école. ».",
    "durationMin": 8,
    "order": 1
  },
  {
    "id": "l-texte-1",
    "nodeId": "n-texte-1",
    "title": "Texte : « Le petit chat »",
    "objective": "Lire seul un petit texte et répondre aux questions.",
    "durationMin": 10,
    "order": 1
  },
  {
    "id": "l-texte-2",
    "nodeId": "n-texte-2",
    "title": "Texte : « À la mer »",
    "objective": "Lire seul un petit texte et répondre aux questions.",
    "durationMin": 10,
    "order": 1
  },
  {
    "id": "l-texte-3",
    "nodeId": "n-texte-3",
    "title": "Texte : « La fête de bébé »",
    "objective": "Lire seul un petit texte et répondre aux questions.",
    "durationMin": 10,
    "order": 1
  },
  {
    "id": "l-texte-4",
    "nodeId": "n-texte-4",
    "title": "Texte : « La neige »",
    "objective": "Lire seul un petit texte et répondre aux questions.",
    "durationMin": 10,
    "order": 1
  },
  {
    "id": "l-texte-5",
    "nodeId": "n-texte-5",
    "title": "Texte : « Au zoo »",
    "objective": "Lire seul un petit texte et répondre aux questions.",
    "durationMin": 10,
    "order": 1
  },
  {
    "id": "l-bilan-1",
    "nodeId": "n-bilan-1",
    "title": "Bilan : Sons et écoute",
    "objective": "Je revois tout le niveau 1 : reconnaître les sons de la langue.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-bilan-2",
    "nodeId": "n-bilan-2",
    "title": "Bilan : Lettres et sons",
    "objective": "Je revois tout le niveau 2 : associer chaque lettre à son son.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-bilan-3",
    "nodeId": "n-bilan-3",
    "title": "Bilan : Syllabes",
    "objective": "Je revois tout le niveau 3 : découper et assembler des syllabes.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-bilan-4",
    "nodeId": "n-bilan-4",
    "title": "Bilan : Mots simples",
    "objective": "Je revois tout le niveau 4 : lire des mots courts et fréquents.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-bilan-5",
    "nodeId": "n-bilan-5",
    "title": "Bilan : Sons complexes",
    "objective": "Je revois tout le niveau 5 : reconnaître les sons composés.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-bilan-6",
    "nodeId": "n-bilan-6",
    "title": "Bilan : Phrases et compréhension",
    "objective": "Je revois tout le niveau 6 : lire et comprendre de courtes phrases.",
    "durationMin": 6,
    "order": 1
  },
  {
    "id": "l-bilan-7",
    "nodeId": "n-bilan-7",
    "title": "Bilan : Textes courts",
    "objective": "Je revois tout le niveau 7 : lire et comprendre un petit texte de quelques phrases.",
    "durationMin": 6,
    "order": 1
  }
];

export const CURRICULUM_ITEMS: PedagogyItem[] = [
  {
    "id": "g-a",
    "type": "grapheme",
    "label": "a",
    "phoneme": "a",
    "syllables": []
  },
  {
    "id": "g-e",
    "type": "grapheme",
    "label": "e",
    "phoneme": "e",
    "syllables": []
  },
  {
    "id": "g-i",
    "type": "grapheme",
    "label": "i",
    "phoneme": "i",
    "syllables": []
  },
  {
    "id": "g-o",
    "type": "grapheme",
    "label": "o",
    "phoneme": "o",
    "syllables": []
  },
  {
    "id": "g-u",
    "type": "grapheme",
    "label": "u",
    "phoneme": "u",
    "syllables": []
  },
  {
    "id": "g-e-aigu",
    "type": "grapheme",
    "label": "é",
    "phoneme": "é",
    "syllables": []
  },
  {
    "id": "g-m",
    "type": "grapheme",
    "label": "m",
    "phoneme": "m",
    "syllables": []
  },
  {
    "id": "g-p",
    "type": "grapheme",
    "label": "p",
    "phoneme": "p",
    "syllables": []
  },
  {
    "id": "g-t",
    "type": "grapheme",
    "label": "t",
    "phoneme": "t",
    "syllables": []
  },
  {
    "id": "g-s",
    "type": "grapheme",
    "label": "s",
    "phoneme": "s",
    "syllables": []
  },
  {
    "id": "g-l",
    "type": "grapheme",
    "label": "l",
    "phoneme": "l",
    "syllables": []
  },
  {
    "id": "g-r",
    "type": "grapheme",
    "label": "r",
    "phoneme": "r",
    "syllables": []
  },
  {
    "id": "g-n",
    "type": "grapheme",
    "label": "n",
    "phoneme": "n",
    "syllables": []
  },
  {
    "id": "g-d",
    "type": "grapheme",
    "label": "d",
    "phoneme": "d",
    "syllables": []
  },
  {
    "id": "g-f",
    "type": "grapheme",
    "label": "f",
    "phoneme": "f",
    "syllables": []
  },
  {
    "id": "g-v",
    "type": "grapheme",
    "label": "v",
    "phoneme": "v",
    "syllables": []
  },
  {
    "id": "g-b",
    "type": "grapheme",
    "label": "b",
    "phoneme": "b",
    "syllables": []
  },
  {
    "id": "g-j",
    "type": "grapheme",
    "label": "j",
    "phoneme": "j",
    "syllables": []
  },
  {
    "id": "g-c",
    "type": "grapheme",
    "label": "c",
    "phoneme": "c",
    "syllables": []
  },
  {
    "id": "g-g",
    "type": "grapheme",
    "label": "g",
    "phoneme": "g",
    "syllables": []
  },
  {
    "id": "g-z",
    "type": "grapheme",
    "label": "z",
    "phoneme": "z",
    "syllables": []
  },
  {
    "id": "g-ch",
    "type": "grapheme",
    "label": "ch",
    "phoneme": "ch",
    "syllables": []
  },
  {
    "id": "g-ou",
    "type": "grapheme",
    "label": "ou",
    "phoneme": "ou",
    "syllables": []
  },
  {
    "id": "g-oi",
    "type": "grapheme",
    "label": "oi",
    "phoneme": "oi",
    "syllables": []
  },
  {
    "id": "g-an",
    "type": "grapheme",
    "label": "an",
    "phoneme": "an",
    "syllables": []
  },
  {
    "id": "g-on",
    "type": "grapheme",
    "label": "on",
    "phoneme": "on",
    "syllables": []
  },
  {
    "id": "g-in",
    "type": "grapheme",
    "label": "in",
    "phoneme": "in",
    "syllables": []
  },
  {
    "id": "g-eau",
    "type": "grapheme",
    "label": "eau",
    "phoneme": "eau",
    "syllables": []
  },
  {
    "id": "g-ai",
    "type": "grapheme",
    "label": "ai",
    "phoneme": "ai",
    "syllables": []
  },
  {
    "id": "g-ei",
    "type": "grapheme",
    "label": "ei",
    "phoneme": "ei",
    "syllables": []
  },
  {
    "id": "g-au",
    "type": "grapheme",
    "label": "au",
    "phoneme": "au",
    "syllables": []
  },
  {
    "id": "g-eu",
    "type": "grapheme",
    "label": "eu",
    "phoneme": "eu",
    "syllables": []
  },
  {
    "id": "g-en",
    "type": "grapheme",
    "label": "en",
    "phoneme": "en",
    "syllables": []
  },
  {
    "id": "g-gn",
    "type": "grapheme",
    "label": "gn",
    "phoneme": "gn",
    "syllables": []
  },
  {
    "id": "g-ill",
    "type": "grapheme",
    "label": "ill",
    "phoneme": "ill",
    "syllables": []
  },
  {
    "id": "g-ph",
    "type": "grapheme",
    "label": "ph",
    "phoneme": "ph",
    "syllables": []
  },
  {
    "id": "g-qu",
    "type": "grapheme",
    "label": "qu",
    "phoneme": "qu",
    "syllables": []
  },
  {
    "id": "g-gu",
    "type": "grapheme",
    "label": "gu",
    "phoneme": "gu",
    "syllables": []
  },
  {
    "id": "g-q",
    "type": "grapheme",
    "label": "q",
    "phoneme": "k",
    "syllables": []
  },
  {
    "id": "w-avion",
    "type": "word",
    "label": "avion",
    "phoneme": "avion",
    "syllables": [
      "a",
      "vi",
      "on"
    ],
    "image": "emoji:airplane"
  },
  {
    "id": "w-doigt",
    "type": "word",
    "label": "doigt",
    "phoneme": "doigt",
    "syllables": [
      "doigt"
    ],
    "image": "emoji:index-pointing-up"
  },
  {
    "id": "w-ecole",
    "type": "word",
    "label": "école",
    "phoneme": "école",
    "syllables": [
      "é",
      "co",
      "le"
    ],
    "image": "emoji:school"
  },
  {
    "id": "w-papa",
    "type": "word",
    "label": "papa",
    "phoneme": "papa",
    "syllables": [
      "pa",
      "pa"
    ],
    "image": "emoji:man"
  },
  {
    "id": "w-pomme",
    "type": "word",
    "label": "pomme",
    "phoneme": "pomme",
    "syllables": [
      "pom",
      "me"
    ],
    "image": "emoji:red-apple"
  },
  {
    "id": "w-poule",
    "type": "word",
    "label": "poule",
    "phoneme": "poule",
    "syllables": [
      "pou",
      "le"
    ],
    "image": "emoji:chicken"
  },
  {
    "id": "w-cheval",
    "type": "word",
    "label": "cheval",
    "phoneme": "cheval",
    "syllables": [
      "che",
      "val"
    ],
    "image": "emoji:horse-face"
  },
  {
    "id": "w-chat",
    "type": "word",
    "label": "chat",
    "phoneme": "chat",
    "syllables": [
      "chat"
    ],
    "image": "emoji:cat-face"
  },
  {
    "id": "w-ballon",
    "type": "word",
    "label": "ballon",
    "phoneme": "ballon",
    "syllables": [
      "bal",
      "lon"
    ],
    "image": "emoji:soccer-ball"
  },
  {
    "id": "w-iguane",
    "type": "word",
    "label": "iguane",
    "phoneme": "iguane",
    "syllables": [
      "i",
      "gua",
      "ne"
    ],
    "image": "emoji:lizard"
  },
  {
    "id": "w-banane",
    "type": "word",
    "label": "banane",
    "phoneme": "banane",
    "syllables": [
      "ba",
      "na",
      "ne"
    ],
    "image": "emoji:banana"
  },
  {
    "id": "w-ami",
    "type": "word",
    "label": "ami",
    "phoneme": "ami",
    "syllables": [
      "a",
      "mi"
    ],
    "image": "emoji:people-hugging"
  },
  {
    "id": "w-auto",
    "type": "word",
    "label": "auto",
    "phoneme": "auto",
    "syllables": [
      "au",
      "to"
    ],
    "image": "emoji:automobile"
  },
  {
    "id": "w-feu",
    "type": "word",
    "label": "feu",
    "phoneme": "feu",
    "syllables": [
      "feu"
    ],
    "image": "emoji:fire"
  },
  {
    "id": "w-orange",
    "type": "word",
    "label": "orange",
    "phoneme": "orange",
    "syllables": [
      "o",
      "ran",
      "ge"
    ],
    "image": "emoji:tangerine"
  },
  {
    "id": "w-bateau",
    "type": "word",
    "label": "bateau",
    "phoneme": "bateau",
    "syllables": [
      "ba",
      "teau"
    ],
    "image": "emoji:sailboat"
  },
  {
    "id": "w-robot",
    "type": "word",
    "label": "robot",
    "phoneme": "robot",
    "syllables": [
      "ro",
      "bot"
    ],
    "image": "emoji:robot"
  },
  {
    "id": "w-requin",
    "type": "word",
    "label": "requin",
    "phoneme": "requin",
    "syllables": [
      "re",
      "quin"
    ],
    "image": "emoji:shark"
  },
  {
    "id": "w-bague",
    "type": "word",
    "label": "bague",
    "phoneme": "bague",
    "syllables": [
      "ba",
      "gue"
    ],
    "image": "emoji:ring"
  },
  {
    "id": "w-lune",
    "type": "word",
    "label": "lune",
    "phoneme": "lune",
    "syllables": [
      "lu",
      "ne"
    ],
    "image": "emoji:crescent-moon"
  },
  {
    "id": "w-lait",
    "type": "word",
    "label": "lait",
    "phoneme": "lait",
    "syllables": [
      "lait"
    ],
    "image": "emoji:glass-of-milk"
  },
  {
    "id": "w-lion",
    "type": "word",
    "label": "lion",
    "phoneme": "lion",
    "syllables": [
      "li",
      "on"
    ],
    "image": "emoji:lion"
  },
  {
    "id": "w-jupe",
    "type": "word",
    "label": "jupe",
    "phoneme": "jupe",
    "syllables": [
      "ju",
      "pe"
    ]
  },
  {
    "id": "w-bebe",
    "type": "word",
    "label": "bébé",
    "phoneme": "bébé",
    "syllables": [
      "bé",
      "bé"
    ],
    "image": "emoji:baby"
  },
  {
    "id": "w-velo",
    "type": "word",
    "label": "vélo",
    "phoneme": "vélo",
    "syllables": [
      "vé",
      "lo"
    ],
    "image": "emoji:bicycle"
  },
  {
    "id": "w-maison",
    "type": "word",
    "label": "maison",
    "phoneme": "maison",
    "syllables": [
      "mai",
      "son"
    ],
    "image": "emoji:house"
  },
  {
    "id": "w-maman",
    "type": "word",
    "label": "maman",
    "phoneme": "maman",
    "syllables": [
      "ma",
      "man"
    ],
    "image": "emoji:woman"
  },
  {
    "id": "w-tortue",
    "type": "word",
    "label": "tortue",
    "phoneme": "tortue",
    "syllables": [
      "tor",
      "tue"
    ],
    "image": "emoji:turtle"
  },
  {
    "id": "w-soleil",
    "type": "word",
    "label": "soleil",
    "phoneme": "soleil",
    "syllables": [
      "so",
      "leil"
    ],
    "image": "emoji:sun"
  },
  {
    "id": "w-poisson",
    "type": "word",
    "label": "poisson",
    "phoneme": "poisson",
    "syllables": [
      "pois",
      "son"
    ],
    "image": "emoji:fish"
  },
  {
    "id": "w-fleur",
    "type": "word",
    "label": "fleur",
    "phoneme": "fleur",
    "syllables": [
      "fleur"
    ],
    "image": "emoji:blossom"
  },
  {
    "id": "w-fille",
    "type": "word",
    "label": "fille",
    "phoneme": "fille",
    "syllables": [
      "fil",
      "le"
    ],
    "image": "emoji:girl"
  },
  {
    "id": "w-nez",
    "type": "word",
    "label": "nez",
    "phoneme": "nez",
    "syllables": [
      "nez"
    ],
    "image": "emoji:nose"
  },
  {
    "id": "w-domino",
    "type": "word",
    "label": "domino",
    "phoneme": "domino",
    "syllables": [
      "do",
      "mi",
      "no"
    ]
  },
  {
    "id": "w-dodo",
    "type": "word",
    "label": "dodo",
    "phoneme": "dodo",
    "syllables": [
      "do",
      "do"
    ]
  },
  {
    "id": "w-chenille",
    "type": "word",
    "label": "chenille",
    "phoneme": "chenille",
    "syllables": [
      "che",
      "nil",
      "le"
    ],
    "image": "emoji:bug"
  },
  {
    "id": "w-cadeau",
    "type": "word",
    "label": "cadeau",
    "phoneme": "cadeau",
    "syllables": [
      "ca",
      "deau"
    ],
    "image": "emoji:wrapped-gift"
  },
  {
    "id": "w-bonbon",
    "type": "word",
    "label": "bonbon",
    "phoneme": "bonbon",
    "syllables": [
      "bon",
      "bon"
    ],
    "image": "emoji:candy"
  },
  {
    "id": "w-carotte",
    "type": "word",
    "label": "carotte",
    "phoneme": "carotte",
    "syllables": [
      "ca",
      "rot",
      "te"
    ],
    "image": "emoji:carrot"
  },
  {
    "id": "w-baleine",
    "type": "word",
    "label": "baleine",
    "phoneme": "baleine",
    "syllables": [
      "ba",
      "lei",
      "ne"
    ],
    "image": "emoji:spouting-whale"
  },
  {
    "id": "w-gorille",
    "type": "word",
    "label": "gorille",
    "phoneme": "gorille",
    "syllables": [
      "go",
      "ril",
      "le"
    ],
    "image": "emoji:gorilla"
  },
  {
    "id": "w-gateau",
    "type": "word",
    "label": "gâteau",
    "phoneme": "gâteau",
    "syllables": [
      "gâ",
      "teau"
    ],
    "image": "emoji:shortcake"
  },
  {
    "id": "w-zebre",
    "type": "word",
    "label": "zèbre",
    "phoneme": "zèbre",
    "syllables": [
      "zè",
      "bre"
    ],
    "image": "emoji:zebra"
  },
  {
    "id": "w-bon",
    "type": "word",
    "label": "bon",
    "phoneme": "bon",
    "syllables": [
      "bon"
    ]
  },
  {
    "id": "w-don",
    "type": "word",
    "label": "don",
    "phoneme": "don",
    "syllables": [
      "don"
    ]
  },
  {
    "id": "w-quatre",
    "type": "word",
    "label": "quatre",
    "phoneme": "quatre",
    "syllables": [
      "qua",
      "tre"
    ]
  },
  {
    "id": "w-coq",
    "type": "word",
    "label": "coq",
    "phoneme": "coq",
    "syllables": [
      "coq"
    ],
    "image": "emoji:rooster"
  },
  {
    "id": "w-chaussure",
    "type": "word",
    "label": "chaussure",
    "phoneme": "chaussure",
    "syllables": [
      "chaus",
      "su",
      "re"
    ],
    "image": "emoji:running-shoe"
  },
  {
    "id": "w-loupe",
    "type": "word",
    "label": "loupe",
    "phoneme": "loupe",
    "syllables": [
      "lou",
      "pe"
    ],
    "image": "emoji:magnifying-glass-tilted-left"
  },
  {
    "id": "w-lapin",
    "type": "word",
    "label": "lapin",
    "phoneme": "lapin",
    "syllables": [
      "la",
      "pin"
    ],
    "image": "emoji:rabbit-face"
  },
  {
    "id": "w-livre",
    "type": "word",
    "label": "livre",
    "phoneme": "livre",
    "syllables": [
      "li",
      "vre"
    ],
    "image": "emoji:open-book"
  },
  {
    "id": "s-ma",
    "type": "syllable",
    "label": "ma",
    "phoneme": "ma",
    "syllables": [
      "ma"
    ]
  },
  {
    "id": "s-pa",
    "type": "syllable",
    "label": "pa",
    "phoneme": "pa",
    "syllables": [
      "pa"
    ]
  },
  {
    "id": "s-mi",
    "type": "syllable",
    "label": "mi",
    "phoneme": "mi",
    "syllables": [
      "mi"
    ]
  },
  {
    "id": "s-am",
    "type": "syllable",
    "label": "am",
    "phoneme": "am",
    "syllables": [
      "am"
    ]
  },
  {
    "id": "s-man",
    "type": "syllable",
    "label": "man",
    "phoneme": "man",
    "syllables": [
      "man"
    ]
  },
  {
    "id": "s-ta",
    "type": "syllable",
    "label": "ta",
    "phoneme": "ta",
    "syllables": [
      "ta"
    ]
  },
  {
    "id": "s-pi",
    "type": "syllable",
    "label": "pi",
    "phoneme": "pi",
    "syllables": [
      "pi"
    ]
  },
  {
    "id": "s-ap",
    "type": "syllable",
    "label": "ap",
    "phoneme": "ap",
    "syllables": [
      "ap"
    ]
  },
  {
    "id": "s-la",
    "type": "syllable",
    "label": "la",
    "phoneme": "la",
    "syllables": [
      "la"
    ]
  },
  {
    "id": "s-ti",
    "type": "syllable",
    "label": "ti",
    "phoneme": "ti",
    "syllables": [
      "ti"
    ]
  },
  {
    "id": "s-at",
    "type": "syllable",
    "label": "at",
    "phoneme": "at",
    "syllables": [
      "at"
    ]
  },
  {
    "id": "s-li",
    "type": "syllable",
    "label": "li",
    "phoneme": "li",
    "syllables": [
      "li"
    ]
  },
  {
    "id": "s-al",
    "type": "syllable",
    "label": "al",
    "phoneme": "al",
    "syllables": [
      "al"
    ]
  },
  {
    "id": "s-pin",
    "type": "syllable",
    "label": "pin",
    "phoneme": "pin",
    "syllables": [
      "pin"
    ]
  },
  {
    "id": "s-mo",
    "type": "syllable",
    "label": "mo",
    "phoneme": "mo",
    "syllables": [
      "mo"
    ]
  },
  {
    "id": "s-im",
    "type": "syllable",
    "label": "im",
    "phoneme": "im",
    "syllables": [
      "im"
    ]
  },
  {
    "id": "s-a",
    "type": "syllable",
    "label": "a",
    "phoneme": "a",
    "syllables": [
      "a"
    ]
  },
  {
    "id": "s-o",
    "type": "syllable",
    "label": "o",
    "phoneme": "o",
    "syllables": [
      "o"
    ]
  },
  {
    "id": "s-ip",
    "type": "syllable",
    "label": "ip",
    "phoneme": "ip",
    "syllables": [
      "ip"
    ]
  },
  {
    "id": "s-to",
    "type": "syllable",
    "label": "to",
    "phoneme": "to",
    "syllables": [
      "to"
    ]
  },
  {
    "id": "s-it",
    "type": "syllable",
    "label": "it",
    "phoneme": "it",
    "syllables": [
      "it"
    ]
  },
  {
    "id": "s-il",
    "type": "syllable",
    "label": "il",
    "phoneme": "il",
    "syllables": [
      "il"
    ]
  },
  {
    "id": "s-vre",
    "type": "syllable",
    "label": "vre",
    "phoneme": "vre",
    "syllables": [
      "vre"
    ]
  },
  {
    "id": "s-om",
    "type": "syllable",
    "label": "om",
    "phoneme": "om",
    "syllables": [
      "om"
    ]
  },
  {
    "id": "s-ot",
    "type": "syllable",
    "label": "ot",
    "phoneme": "ot",
    "syllables": [
      "ot"
    ]
  },
  {
    "id": "x-naman",
    "type": "word",
    "label": "naman",
    "phoneme": "naman",
    "syllables": [
      "naman"
    ]
  },
  {
    "id": "w-phoque",
    "type": "word",
    "label": "phoque",
    "phoneme": "phoque",
    "syllables": [
      "pho",
      "que"
    ],
    "image": "emoji:seal"
  },
  {
    "id": "x-qapa",
    "type": "word",
    "label": "qapa",
    "phoneme": "qapa",
    "syllables": [
      "qapa"
    ]
  },
  {
    "id": "x-tivre",
    "type": "word",
    "label": "tivre",
    "phoneme": "tivre",
    "syllables": [
      "tivre"
    ]
  },
  {
    "id": "w-elephant",
    "type": "word",
    "label": "éléphant",
    "phoneme": "éléphant",
    "syllables": [
      "é",
      "lé",
      "phant"
    ],
    "image": "emoji:elephant"
  },
  {
    "id": "x-ecole",
    "type": "word",
    "label": "ècole",
    "phoneme": "ècole",
    "syllables": [
      "ècole"
    ]
  },
  {
    "id": "s-eacute",
    "type": "syllable",
    "label": "é",
    "phoneme": "é",
    "syllables": [
      "é"
    ]
  },
  {
    "id": "s-co",
    "type": "syllable",
    "label": "co",
    "phoneme": "co",
    "syllables": [
      "co"
    ]
  },
  {
    "id": "s-le",
    "type": "syllable",
    "label": "le",
    "phoneme": "le",
    "syllables": [
      "le"
    ]
  },
  {
    "id": "s-egrave",
    "type": "syllable",
    "label": "è",
    "phoneme": "è",
    "syllables": [
      "è"
    ]
  },
  {
    "id": "w-montagne",
    "type": "word",
    "label": "montagne",
    "phoneme": "montagne",
    "syllables": [
      "mon",
      "ta",
      "gne"
    ],
    "image": "emoji:snow-capped-mountain"
  },
  {
    "id": "x-naison",
    "type": "word",
    "label": "naison",
    "phoneme": "naison",
    "syllables": [
      "naison"
    ]
  },
  {
    "id": "s-mai",
    "type": "syllable",
    "label": "mai",
    "phoneme": "mai",
    "syllables": [
      "mai"
    ]
  },
  {
    "id": "s-son",
    "type": "syllable",
    "label": "son",
    "phoneme": "son",
    "syllables": [
      "son"
    ]
  },
  {
    "id": "s-nai",
    "type": "syllable",
    "label": "nai",
    "phoneme": "nai",
    "syllables": [
      "nai"
    ]
  },
  {
    "id": "x-omi",
    "type": "word",
    "label": "omi",
    "phoneme": "omi",
    "syllables": [
      "omi"
    ]
  },
  {
    "id": "x-chot",
    "type": "word",
    "label": "chot",
    "phoneme": "chot",
    "syllables": [
      "chot"
    ]
  },
  {
    "id": "x-tune",
    "type": "word",
    "label": "tune",
    "phoneme": "tune",
    "syllables": [
      "tune"
    ]
  },
  {
    "id": "s-lu",
    "type": "syllable",
    "label": "lu",
    "phoneme": "lu",
    "syllables": [
      "lu"
    ]
  },
  {
    "id": "s-ne",
    "type": "syllable",
    "label": "ne",
    "phoneme": "ne",
    "syllables": [
      "ne"
    ]
  },
  {
    "id": "s-ul",
    "type": "syllable",
    "label": "ul",
    "phoneme": "ul",
    "syllables": [
      "ul"
    ]
  },
  {
    "id": "x-tleur",
    "type": "word",
    "label": "tleur",
    "phoneme": "tleur",
    "syllables": [
      "tleur"
    ]
  },
  {
    "id": "w-dent",
    "type": "word",
    "label": "dent",
    "phoneme": "dent",
    "syllables": [
      "dent"
    ],
    "image": "emoji:tooth"
  },
  {
    "id": "x-uelo",
    "type": "word",
    "label": "uélo",
    "phoneme": "uélo",
    "syllables": [
      "uélo"
    ]
  },
  {
    "id": "s-veacute",
    "type": "syllable",
    "label": "vé",
    "phoneme": "vé",
    "syllables": [
      "vé"
    ]
  },
  {
    "id": "s-lo",
    "type": "syllable",
    "label": "lo",
    "phoneme": "lo",
    "syllables": [
      "lo"
    ]
  },
  {
    "id": "s-eacutev",
    "type": "syllable",
    "label": "év",
    "phoneme": "év",
    "syllables": [
      "év"
    ]
  },
  {
    "id": "w-araignee",
    "type": "word",
    "label": "araignée",
    "phoneme": "araignée",
    "syllables": [
      "a",
      "rai",
      "gnée"
    ],
    "image": "emoji:spider"
  },
  {
    "id": "w-neige",
    "type": "word",
    "label": "neige",
    "phoneme": "neige",
    "syllables": [
      "nei",
      "ge"
    ],
    "image": "emoji:snowflake"
  },
  {
    "id": "w-enfant",
    "type": "word",
    "label": "enfant",
    "phoneme": "enfant",
    "syllables": [
      "en",
      "fant"
    ],
    "image": "emoji:child"
  },
  {
    "id": "w-guitare",
    "type": "word",
    "label": "guitare",
    "phoneme": "guitare",
    "syllables": [
      "gui",
      "ta",
      "re"
    ],
    "image": "emoji:guitar"
  },
  {
    "id": "p-1",
    "type": "sentence",
    "label": "Le chat dort.",
    "phoneme": "Le chat dort.",
    "syllables": [
      "Le",
      "chat",
      "dort."
    ]
  },
  {
    "id": "p-2",
    "type": "sentence",
    "label": "Papa lit un livre.",
    "phoneme": "Papa lit un livre.",
    "syllables": [
      "Pa-pa",
      "lit",
      "un",
      "li-vre."
    ]
  },
  {
    "id": "p-3",
    "type": "sentence",
    "label": "La lune est belle.",
    "phoneme": "La lune est belle.",
    "syllables": [
      "La",
      "lu-ne",
      "est",
      "bel-le."
    ]
  },
  {
    "id": "p-4",
    "type": "sentence",
    "label": "Maman aime les fleurs.",
    "phoneme": "Maman aime les fleurs.",
    "syllables": [
      "Ma-man",
      "ai-me",
      "les",
      "fleurs."
    ]
  },
  {
    "id": "p-5",
    "type": "sentence",
    "label": "Je vais à l’école.",
    "phoneme": "Je vais à l’école.",
    "syllables": [
      "Je",
      "vais",
      "à",
      "l’é-co-le."
    ]
  },
  {
    "id": "w-le",
    "type": "word",
    "label": "le",
    "phoneme": "le",
    "syllables": [
      "le"
    ]
  },
  {
    "id": "w-dort",
    "type": "word",
    "label": "dort",
    "phoneme": "dort",
    "syllables": [
      "dort"
    ]
  },
  {
    "id": "w-lit",
    "type": "word",
    "label": "lit",
    "phoneme": "lit",
    "syllables": [
      "lit"
    ]
  },
  {
    "id": "w-un",
    "type": "word",
    "label": "un",
    "phoneme": "un",
    "syllables": [
      "un"
    ]
  },
  {
    "id": "w-la",
    "type": "word",
    "label": "la",
    "phoneme": "la",
    "syllables": [
      "la"
    ]
  },
  {
    "id": "w-est",
    "type": "word",
    "label": "est",
    "phoneme": "est",
    "syllables": [
      "est"
    ]
  },
  {
    "id": "w-belle",
    "type": "word",
    "label": "belle",
    "phoneme": "belle",
    "syllables": [
      "bel",
      "le"
    ]
  },
  {
    "id": "w-fleurs",
    "type": "word",
    "label": "fleurs",
    "phoneme": "fleurs",
    "syllables": [
      "fleurs"
    ],
    "image": "emoji:bouquet"
  },
  {
    "id": "w-aime",
    "type": "word",
    "label": "aime",
    "phoneme": "aime",
    "syllables": [
      "ai",
      "me"
    ]
  },
  {
    "id": "w-les",
    "type": "word",
    "label": "les",
    "phoneme": "les",
    "syllables": [
      "les"
    ]
  },
  {
    "id": "w-je",
    "type": "word",
    "label": "je",
    "phoneme": "je",
    "syllables": [
      "je"
    ]
  },
  {
    "id": "w-vais",
    "type": "word",
    "label": "vais",
    "phoneme": "vais",
    "syllables": [
      "vais"
    ]
  },
  {
    "id": "w-a",
    "type": "word",
    "label": "à",
    "phoneme": "à",
    "syllables": [
      "à"
    ]
  },
  {
    "id": "t-1",
    "type": "sentence",
    "label": "Papa a un petit chat. Le chat aime le lait. Il dort sur le lit.",
    "phoneme": "Papa a un petit chat. Le chat aime le lait. Il dort sur le lit.",
    "syllables": [
      "Pa-pa",
      "a",
      "un",
      "pe-tit",
      "chat.",
      "Le",
      "chat",
      "ai-me",
      "le",
      "lait.",
      "Il",
      "dort",
      "sur",
      "le",
      "lit."
    ]
  },
  {
    "id": "p-t1-1",
    "type": "sentence",
    "label": "Papa a un petit chat.",
    "phoneme": "Papa a un petit chat.",
    "syllables": [
      "Pa-pa",
      "a",
      "un",
      "pe-tit",
      "chat."
    ]
  },
  {
    "id": "p-t1-2",
    "type": "sentence",
    "label": "Le chat aime le lait.",
    "phoneme": "Le chat aime le lait.",
    "syllables": [
      "Le",
      "chat",
      "ai-me",
      "le",
      "lait."
    ]
  },
  {
    "id": "p-t1-3",
    "type": "sentence",
    "label": "Il dort sur le lit.",
    "phoneme": "Il dort sur le lit.",
    "syllables": [
      "Il",
      "dort",
      "sur",
      "le",
      "lit."
    ]
  },
  {
    "id": "t-2",
    "type": "sentence",
    "label": "Maman et moi allons à la mer. Sur l’eau, il y a un bateau. Je vois un gros poisson.",
    "phoneme": "Maman et moi allons à la mer. Sur l’eau, il y a un bateau. Je vois un gros poisson.",
    "syllables": [
      "Ma-man",
      "et",
      "moi",
      "al-lons",
      "à",
      "la",
      "mer.",
      "Sur",
      "l’eau,",
      "il",
      "y",
      "a",
      "un",
      "ba-teau.",
      "Je",
      "vois",
      "un",
      "gros",
      "pois-son."
    ]
  },
  {
    "id": "p-t2-1",
    "type": "sentence",
    "label": "Maman et moi allons à la mer.",
    "phoneme": "Maman et moi allons à la mer.",
    "syllables": [
      "Ma-man",
      "et",
      "moi",
      "al-lons",
      "à",
      "la",
      "mer."
    ]
  },
  {
    "id": "p-t2-2",
    "type": "sentence",
    "label": "Sur l’eau, il y a un bateau.",
    "phoneme": "Sur l’eau, il y a un bateau.",
    "syllables": [
      "Sur",
      "l’eau,",
      "il",
      "y",
      "a",
      "un",
      "ba-teau."
    ]
  },
  {
    "id": "p-t2-3",
    "type": "sentence",
    "label": "Je vois un gros poisson.",
    "phoneme": "Je vois un gros poisson.",
    "syllables": [
      "Je",
      "vois",
      "un",
      "gros",
      "pois-son."
    ]
  },
  {
    "id": "t-3",
    "type": "sentence",
    "label": "C’est la fête de bébé. Papa fait un gâteau. Bébé a un cadeau et un ballon.",
    "phoneme": "C’est la fête de bébé. Papa fait un gâteau. Bébé a un cadeau et un ballon.",
    "syllables": [
      "C’est",
      "la",
      "fê-te",
      "de",
      "bé-bé.",
      "Pa-pa",
      "fait",
      "un",
      "gâ-teau.",
      "Bé-bé",
      "a",
      "un",
      "ca-deau",
      "et",
      "un",
      "bal-lon."
    ]
  },
  {
    "id": "p-t3-1",
    "type": "sentence",
    "label": "C’est la fête de bébé.",
    "phoneme": "C’est la fête de bébé.",
    "syllables": [
      "C’est",
      "la",
      "fê-te",
      "de",
      "bé-bé."
    ]
  },
  {
    "id": "p-t3-2",
    "type": "sentence",
    "label": "Papa fait un gâteau.",
    "phoneme": "Papa fait un gâteau.",
    "syllables": [
      "Pa-pa",
      "fait",
      "un",
      "gâ-teau."
    ]
  },
  {
    "id": "p-t3-3",
    "type": "sentence",
    "label": "Bébé a un cadeau et un ballon.",
    "phoneme": "Bébé a un cadeau et un ballon.",
    "syllables": [
      "Bé-bé",
      "a",
      "un",
      "ca-deau",
      "et",
      "un",
      "bal-lon."
    ]
  },
  {
    "id": "t-4",
    "type": "sentence",
    "label": "Il neige sur la montagne. Une fille fait un bonhomme de neige. Il a un nez en carotte.",
    "phoneme": "Il neige sur la montagne. Une fille fait un bonhomme de neige. Il a un nez en carotte.",
    "syllables": [
      "Il",
      "nei-ge",
      "sur",
      "la",
      "mon-ta-gne.",
      "U-ne",
      "fil-le",
      "fait",
      "un",
      "bon-hom-me",
      "de",
      "nei-ge.",
      "Il",
      "a",
      "un",
      "nez",
      "en",
      "ca-rot-te."
    ]
  },
  {
    "id": "p-t4-1",
    "type": "sentence",
    "label": "Il neige sur la montagne.",
    "phoneme": "Il neige sur la montagne.",
    "syllables": [
      "Il",
      "nei-ge",
      "sur",
      "la",
      "mon-ta-gne."
    ]
  },
  {
    "id": "p-t4-2",
    "type": "sentence",
    "label": "Une fille fait un bonhomme de neige.",
    "phoneme": "Une fille fait un bonhomme de neige.",
    "syllables": [
      "U-ne",
      "fil-le",
      "fait",
      "un",
      "bon-hom-me",
      "de",
      "nei-ge."
    ]
  },
  {
    "id": "p-t4-3",
    "type": "sentence",
    "label": "Il a un nez en carotte.",
    "phoneme": "Il a un nez en carotte.",
    "syllables": [
      "Il",
      "a",
      "un",
      "nez",
      "en",
      "ca-rot-te."
    ]
  },
  {
    "id": "t-5",
    "type": "sentence",
    "label": "Au zoo, il y a un lion et un zèbre. Le lion dort au soleil. Le zèbre mange de l’herbe.",
    "phoneme": "Au zoo, il y a un lion et un zèbre. Le lion dort au soleil. Le zèbre mange de l’herbe.",
    "syllables": [
      "Au",
      "zoo,",
      "il",
      "y",
      "a",
      "un",
      "li-on",
      "et",
      "un",
      "zè-bre.",
      "Le",
      "li-on",
      "dort",
      "au",
      "so-leil.",
      "Le",
      "zè-bre",
      "man-ge",
      "de",
      "l’her-be."
    ]
  },
  {
    "id": "p-t5-1",
    "type": "sentence",
    "label": "Au zoo, il y a un lion et un zèbre.",
    "phoneme": "Au zoo, il y a un lion et un zèbre.",
    "syllables": [
      "Au",
      "zoo,",
      "il",
      "y",
      "a",
      "un",
      "li-on",
      "et",
      "un",
      "zè-bre."
    ]
  },
  {
    "id": "p-t5-2",
    "type": "sentence",
    "label": "Le lion dort au soleil.",
    "phoneme": "Le lion dort au soleil.",
    "syllables": [
      "Le",
      "li-on",
      "dort",
      "au",
      "so-leil."
    ]
  },
  {
    "id": "p-t5-3",
    "type": "sentence",
    "label": "Le zèbre mange de l’herbe.",
    "phoneme": "Le zèbre mange de l’herbe.",
    "syllables": [
      "Le",
      "zè-bre",
      "man-ge",
      "de",
      "l’her-be."
    ]
  }
];

export const CURRICULUM_EXERCISES: Exercise[] = [
  {
    "id": "e-son-a-1",
    "lessonId": "l-son-a",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "a",
      "cue": "a, comme dans avion",
      "itemIds": [
        "g-a",
        "g-o"
      ]
    }
  },
  {
    "id": "e-son-a-2",
    "lessonId": "l-son-a",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-avion",
      "itemIds": [
        "w-avion",
        "w-doigt",
        "w-ecole"
      ]
    }
  },
  {
    "id": "e-son-a-3",
    "lessonId": "l-son-a",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "a",
      "cue": "a",
      "itemIds": [
        "g-o",
        "g-a",
        "g-e"
      ]
    }
  },
  {
    "id": "e-son-a-4",
    "lessonId": "l-son-a",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-son-a-trace",
    "lessonId": "l-son-a",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-a",
      "cue": "Avec ton doigt, trace la lettre a",
      "itemIds": [
        "g-a"
      ]
    }
  },
  {
    "id": "e-son-e-1",
    "lessonId": "l-son-e",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "e",
      "cue": "e, comme dans cheval",
      "itemIds": [
        "g-e-aigu",
        "g-e"
      ]
    }
  },
  {
    "id": "e-son-e-2",
    "lessonId": "l-son-e",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-cheval",
      "itemIds": [
        "w-chat",
        "w-ballon",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-son-e-3",
    "lessonId": "l-son-e",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "e",
      "cue": "e",
      "itemIds": [
        "g-e",
        "g-u",
        "g-e-aigu"
      ]
    }
  },
  {
    "id": "e-son-e-trace",
    "lessonId": "l-son-e",
    "type": "tracing",
    "order": 4,
    "params": {
      "correctItemId": "g-e",
      "cue": "Avec ton doigt, trace la lettre e",
      "itemIds": [
        "g-e"
      ]
    }
  },
  {
    "id": "e-son-i-1",
    "lessonId": "l-son-i",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "i",
      "cue": "i, comme dans iguane",
      "itemIds": [
        "g-i",
        "g-e-aigu"
      ]
    }
  },
  {
    "id": "e-son-i-2",
    "lessonId": "l-son-i",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-iguane",
      "itemIds": [
        "w-banane",
        "w-iguane",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-i-3",
    "lessonId": "l-son-i",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "i",
      "cue": "i",
      "itemIds": [
        "g-a",
        "g-e-aigu",
        "g-i"
      ]
    }
  },
  {
    "id": "e-son-i-4",
    "lessonId": "l-son-i",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-ami",
      "itemIds": [
        "w-ami",
        "w-auto",
        "w-feu"
      ]
    }
  },
  {
    "id": "e-son-i-trace",
    "lessonId": "l-son-i",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-i",
      "cue": "Avec ton doigt, trace la lettre i",
      "itemIds": [
        "g-i"
      ]
    }
  },
  {
    "id": "e-son-o-1",
    "lessonId": "l-son-o",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "o",
      "cue": "o, comme dans orange",
      "itemIds": [
        "g-a",
        "g-o"
      ]
    }
  },
  {
    "id": "e-son-o-2",
    "lessonId": "l-son-o",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-orange",
      "itemIds": [
        "w-orange",
        "w-banane",
        "w-bateau"
      ]
    }
  },
  {
    "id": "e-son-o-3",
    "lessonId": "l-son-o",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "o",
      "cue": "o",
      "itemIds": [
        "g-a",
        "g-o",
        "g-u"
      ]
    }
  },
  {
    "id": "e-son-o-4",
    "lessonId": "l-son-o",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-robot",
      "itemIds": [
        "w-requin",
        "w-bague",
        "w-robot"
      ]
    }
  },
  {
    "id": "e-son-o-trace",
    "lessonId": "l-son-o",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-o",
      "cue": "Avec ton doigt, trace la lettre o",
      "itemIds": [
        "g-o"
      ]
    }
  },
  {
    "id": "e-son-u-1",
    "lessonId": "l-son-u",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "u",
      "cue": "u, comme dans lune",
      "itemIds": [
        "g-u",
        "g-i"
      ]
    }
  },
  {
    "id": "e-son-u-2",
    "lessonId": "l-son-u",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-lune",
      "itemIds": [
        "w-lait",
        "w-lion",
        "w-lune"
      ]
    }
  },
  {
    "id": "e-son-u-3",
    "lessonId": "l-son-u",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "u",
      "cue": "u",
      "itemIds": [
        "g-u",
        "g-o",
        "g-i"
      ]
    }
  },
  {
    "id": "e-son-u-4",
    "lessonId": "l-son-u",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-jupe",
      "itemIds": [
        "w-chat",
        "w-jupe",
        "w-bebe"
      ]
    }
  },
  {
    "id": "e-son-u-trace",
    "lessonId": "l-son-u",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-u",
      "cue": "Avec ton doigt, trace la lettre u",
      "itemIds": [
        "g-u"
      ]
    }
  },
  {
    "id": "e-son-e-aigu-1",
    "lessonId": "l-son-e-aigu",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "é",
      "cue": "é, comme dans école",
      "itemIds": [
        "g-e",
        "g-e-aigu"
      ]
    }
  },
  {
    "id": "e-son-e-aigu-2",
    "lessonId": "l-son-e-aigu",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-ecole",
      "itemIds": [
        "w-bague",
        "w-ecole",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-son-e-aigu-3",
    "lessonId": "l-son-e-aigu",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "é",
      "cue": "é",
      "itemIds": [
        "g-i",
        "g-e",
        "g-e-aigu"
      ]
    }
  },
  {
    "id": "e-son-e-aigu-4",
    "lessonId": "l-son-e-aigu",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-velo",
      "itemIds": [
        "w-velo",
        "w-auto",
        "w-chat"
      ]
    }
  },
  {
    "id": "e-son-e-aigu-trace",
    "lessonId": "l-son-e-aigu",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-e-aigu",
      "cue": "Avec ton doigt, trace la lettre é",
      "itemIds": [
        "g-e-aigu"
      ]
    }
  },
  {
    "id": "e-son-m-1",
    "lessonId": "l-son-m",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "m",
      "cue": "m, comme dans maison",
      "itemIds": [
        "g-m",
        "g-n"
      ]
    }
  },
  {
    "id": "e-son-m-2",
    "lessonId": "l-son-m",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-maison",
      "itemIds": [
        "w-maison",
        "w-ballon",
        "w-banane"
      ]
    }
  },
  {
    "id": "e-son-m-3",
    "lessonId": "l-son-m",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "m",
      "cue": "m",
      "itemIds": [
        "g-n",
        "g-m",
        "g-p"
      ]
    }
  },
  {
    "id": "e-son-m-4",
    "lessonId": "l-son-m",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "w-avion",
        "w-bague",
        "w-maman"
      ]
    }
  },
  {
    "id": "e-son-m-trace",
    "lessonId": "l-son-m",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-m",
      "cue": "Avec ton doigt, trace la lettre m",
      "itemIds": [
        "g-m"
      ]
    }
  },
  {
    "id": "e-son-p-1",
    "lessonId": "l-son-p",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "p",
      "cue": "p, comme dans papa",
      "itemIds": [
        "g-q",
        "g-p"
      ]
    }
  },
  {
    "id": "e-son-p-2",
    "lessonId": "l-son-p",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "w-auto",
        "w-bebe",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-son-p-3",
    "lessonId": "l-son-p",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "p",
      "cue": "p",
      "itemIds": [
        "g-p",
        "g-b",
        "g-q"
      ]
    }
  },
  {
    "id": "e-son-p-4",
    "lessonId": "l-son-p",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-pomme",
      "itemIds": [
        "w-bague",
        "w-pomme",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-son-p-trace",
    "lessonId": "l-son-p",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-p",
      "cue": "Avec ton doigt, trace la lettre p",
      "itemIds": [
        "g-p"
      ]
    }
  },
  {
    "id": "e-son-t-1",
    "lessonId": "l-son-t",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "t",
      "cue": "t, comme dans tortue",
      "itemIds": [
        "g-t",
        "g-d"
      ]
    }
  },
  {
    "id": "e-son-t-2",
    "lessonId": "l-son-t",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-tortue",
      "itemIds": [
        "w-banane",
        "w-tortue",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-t-3",
    "lessonId": "l-son-t",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "t",
      "cue": "t",
      "itemIds": [
        "g-l",
        "g-d",
        "g-t"
      ]
    }
  },
  {
    "id": "e-son-t-4",
    "lessonId": "l-son-t",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-bateau",
      "itemIds": [
        "w-bateau",
        "w-ballon",
        "w-banane"
      ]
    }
  },
  {
    "id": "e-son-t-trace",
    "lessonId": "l-son-t",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-t",
      "cue": "Avec ton doigt, trace la lettre t",
      "itemIds": [
        "g-t"
      ]
    }
  },
  {
    "id": "e-son-s-1",
    "lessonId": "l-son-s",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "s",
      "cue": "s, comme dans soleil",
      "itemIds": [
        "g-f",
        "g-s"
      ]
    }
  },
  {
    "id": "e-son-s-2",
    "lessonId": "l-son-s",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-soleil",
      "itemIds": [
        "w-soleil",
        "w-ballon",
        "w-banane"
      ]
    }
  },
  {
    "id": "e-son-s-3",
    "lessonId": "l-son-s",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "s",
      "cue": "s",
      "itemIds": [
        "g-f",
        "g-s",
        "g-r"
      ]
    }
  },
  {
    "id": "e-son-s-4",
    "lessonId": "l-son-s",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-poisson",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-poisson"
      ]
    }
  },
  {
    "id": "e-son-s-trace",
    "lessonId": "l-son-s",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-s",
      "cue": "Avec ton doigt, trace la lettre s",
      "itemIds": [
        "g-s"
      ]
    }
  },
  {
    "id": "e-son-l-1",
    "lessonId": "l-son-l",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "l",
      "cue": "l, comme dans lion",
      "itemIds": [
        "g-l",
        "g-t"
      ]
    }
  },
  {
    "id": "e-son-l-2",
    "lessonId": "l-son-l",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-lion",
      "itemIds": [
        "w-auto",
        "w-bebe",
        "w-lion"
      ]
    }
  },
  {
    "id": "e-son-l-3",
    "lessonId": "l-son-l",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "l",
      "cue": "l",
      "itemIds": [
        "g-l",
        "g-r",
        "g-t"
      ]
    }
  },
  {
    "id": "e-son-l-4",
    "lessonId": "l-son-l",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-lune",
      "itemIds": [
        "w-bebe",
        "w-lune",
        "w-auto"
      ]
    }
  },
  {
    "id": "e-son-l-trace",
    "lessonId": "l-son-l",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-l",
      "cue": "Avec ton doigt, trace la lettre l",
      "itemIds": [
        "g-l"
      ]
    }
  },
  {
    "id": "e-son-r-1",
    "lessonId": "l-son-r",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "r",
      "cue": "r, comme dans robot",
      "itemIds": [
        "g-l",
        "g-r"
      ]
    }
  },
  {
    "id": "e-son-r-2",
    "lessonId": "l-son-r",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-robot",
      "itemIds": [
        "w-bague",
        "w-robot",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-son-r-3",
    "lessonId": "l-son-r",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "r",
      "cue": "r",
      "itemIds": [
        "g-n",
        "g-l",
        "g-r"
      ]
    }
  },
  {
    "id": "e-son-r-4",
    "lessonId": "l-son-r",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-fleur",
      "itemIds": [
        "w-fleur",
        "w-fille",
        "w-feu"
      ]
    }
  },
  {
    "id": "e-son-r-trace",
    "lessonId": "l-son-r",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-r",
      "cue": "Avec ton doigt, trace la lettre r",
      "itemIds": [
        "g-r"
      ]
    }
  },
  {
    "id": "e-son-n-1",
    "lessonId": "l-son-n",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "n",
      "cue": "n, comme dans nez",
      "itemIds": [
        "g-n",
        "g-m"
      ]
    }
  },
  {
    "id": "e-son-n-2",
    "lessonId": "l-son-n",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-nez",
      "itemIds": [
        "w-nez",
        "w-ami",
        "w-feu"
      ]
    }
  },
  {
    "id": "e-son-n-3",
    "lessonId": "l-son-n",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "n",
      "cue": "n",
      "itemIds": [
        "g-m",
        "g-n",
        "g-r"
      ]
    }
  },
  {
    "id": "e-son-n-4",
    "lessonId": "l-son-n",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-banane",
      "itemIds": [
        "w-bateau",
        "w-bague",
        "w-banane"
      ]
    }
  },
  {
    "id": "e-son-n-trace",
    "lessonId": "l-son-n",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-n",
      "cue": "Avec ton doigt, trace la lettre n",
      "itemIds": [
        "g-n"
      ]
    }
  },
  {
    "id": "e-son-d-1",
    "lessonId": "l-son-d",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "d",
      "cue": "d, comme dans domino",
      "itemIds": [
        "g-b",
        "g-d"
      ]
    }
  },
  {
    "id": "e-son-d-2",
    "lessonId": "l-son-d",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-domino",
      "itemIds": [
        "w-ballon",
        "w-banane",
        "w-domino"
      ]
    }
  },
  {
    "id": "e-son-d-3",
    "lessonId": "l-son-d",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "d",
      "cue": "d",
      "itemIds": [
        "g-d",
        "g-t",
        "g-b"
      ]
    }
  },
  {
    "id": "e-son-d-4",
    "lessonId": "l-son-d",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-dodo",
      "itemIds": [
        "w-bebe",
        "w-dodo",
        "w-auto"
      ]
    }
  },
  {
    "id": "e-son-d-trace",
    "lessonId": "l-son-d",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-d",
      "cue": "Avec ton doigt, trace la lettre d",
      "itemIds": [
        "g-d"
      ]
    }
  },
  {
    "id": "e-son-f-1",
    "lessonId": "l-son-f",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "f",
      "cue": "f, comme dans fleur",
      "itemIds": [
        "g-f",
        "g-v"
      ]
    }
  },
  {
    "id": "e-son-f-2",
    "lessonId": "l-son-f",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-fleur",
      "itemIds": [
        "w-bague",
        "w-fleur",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-son-f-3",
    "lessonId": "l-son-f",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "f",
      "cue": "f",
      "itemIds": [
        "g-s",
        "g-v",
        "g-f"
      ]
    }
  },
  {
    "id": "e-son-f-trace",
    "lessonId": "l-son-f",
    "type": "tracing",
    "order": 4,
    "params": {
      "correctItemId": "g-f",
      "cue": "Avec ton doigt, trace la lettre f",
      "itemIds": [
        "g-f"
      ]
    }
  },
  {
    "id": "e-son-v-1",
    "lessonId": "l-son-v",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "v",
      "cue": "v, comme dans vélo",
      "itemIds": [
        "g-f",
        "g-v"
      ]
    }
  },
  {
    "id": "e-son-v-2",
    "lessonId": "l-son-v",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-velo",
      "itemIds": [
        "w-velo",
        "w-auto",
        "w-bebe"
      ]
    }
  },
  {
    "id": "e-son-v-3",
    "lessonId": "l-son-v",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "v",
      "cue": "v",
      "itemIds": [
        "g-f",
        "g-v",
        "g-b"
      ]
    }
  },
  {
    "id": "e-son-v-4",
    "lessonId": "l-son-v",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-cheval",
      "itemIds": [
        "w-chenille",
        "w-chat",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-son-v-trace",
    "lessonId": "l-son-v",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-v",
      "cue": "Avec ton doigt, trace la lettre v",
      "itemIds": [
        "g-v"
      ]
    }
  },
  {
    "id": "e-son-b-1",
    "lessonId": "l-son-b",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "b",
      "cue": "b, comme dans ballon",
      "itemIds": [
        "g-b",
        "g-d"
      ]
    }
  },
  {
    "id": "e-son-b-2",
    "lessonId": "l-son-b",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-ballon",
      "itemIds": [
        "w-cadeau",
        "w-cheval",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-b-3",
    "lessonId": "l-son-b",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "b",
      "cue": "b",
      "itemIds": [
        "g-b",
        "g-p",
        "g-d"
      ]
    }
  },
  {
    "id": "e-son-b-4",
    "lessonId": "l-son-b",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-bonbon",
      "itemIds": [
        "w-cheval",
        "w-bonbon",
        "w-cadeau"
      ]
    }
  },
  {
    "id": "e-son-b-trace",
    "lessonId": "l-son-b",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-b",
      "cue": "Avec ton doigt, trace la lettre b",
      "itemIds": [
        "g-b"
      ]
    }
  },
  {
    "id": "e-son-j-1",
    "lessonId": "l-son-j",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "j",
      "cue": "j, comme dans jupe",
      "itemIds": [
        "g-s",
        "g-j"
      ]
    }
  },
  {
    "id": "e-son-j-2",
    "lessonId": "l-son-j",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-jupe",
      "itemIds": [
        "w-bebe",
        "w-jupe",
        "w-auto"
      ]
    }
  },
  {
    "id": "e-son-j-3",
    "lessonId": "l-son-j",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "j",
      "cue": "j",
      "itemIds": [
        "g-v",
        "g-s",
        "g-j"
      ]
    }
  },
  {
    "id": "e-son-j-trace",
    "lessonId": "l-son-j",
    "type": "tracing",
    "order": 4,
    "params": {
      "correctItemId": "g-j",
      "cue": "Avec ton doigt, trace la lettre j",
      "itemIds": [
        "g-j"
      ]
    }
  },
  {
    "id": "e-son-c-1",
    "lessonId": "l-son-c",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "c",
      "cue": "ka, comme dans carotte",
      "itemIds": [
        "g-c",
        "g-g"
      ]
    }
  },
  {
    "id": "e-son-c-2",
    "lessonId": "l-son-c",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-carotte",
      "itemIds": [
        "w-carotte",
        "w-baleine",
        "w-gorille"
      ]
    }
  },
  {
    "id": "e-son-c-3",
    "lessonId": "l-son-c",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "c",
      "cue": "ka",
      "itemIds": [
        "g-g",
        "g-c",
        "g-t"
      ]
    }
  },
  {
    "id": "e-son-c-4",
    "lessonId": "l-son-c",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-cadeau",
      "itemIds": [
        "w-ballon",
        "w-banane",
        "w-cadeau"
      ]
    }
  },
  {
    "id": "e-son-c-trace",
    "lessonId": "l-son-c",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-c",
      "cue": "Avec ton doigt, trace la lettre c",
      "itemIds": [
        "g-c"
      ]
    }
  },
  {
    "id": "e-son-g-1",
    "lessonId": "l-son-g",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "g",
      "cue": "gue, comme dans gâteau",
      "itemIds": [
        "g-c",
        "g-g"
      ]
    }
  },
  {
    "id": "e-son-g-2",
    "lessonId": "l-son-g",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-gateau",
      "itemIds": [
        "w-ballon",
        "w-banane",
        "w-gateau"
      ]
    }
  },
  {
    "id": "e-son-g-3",
    "lessonId": "l-son-g",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "g",
      "cue": "gue",
      "itemIds": [
        "g-g",
        "g-j",
        "g-c"
      ]
    }
  },
  {
    "id": "e-son-g-4",
    "lessonId": "l-son-g",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-gorille",
      "itemIds": [
        "w-carotte",
        "w-gorille",
        "w-baleine"
      ]
    }
  },
  {
    "id": "e-son-g-trace",
    "lessonId": "l-son-g",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-g",
      "cue": "Avec ton doigt, trace la lettre g",
      "itemIds": [
        "g-g"
      ]
    }
  },
  {
    "id": "e-son-z-1",
    "lessonId": "l-son-z",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "z",
      "cue": "z, comme dans zèbre",
      "itemIds": [
        "g-z",
        "g-s"
      ]
    }
  },
  {
    "id": "e-son-z-2",
    "lessonId": "l-son-z",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-zebre",
      "itemIds": [
        "w-bague",
        "w-zebre",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-son-z-3",
    "lessonId": "l-son-z",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "z",
      "cue": "z",
      "itemIds": [
        "g-j",
        "g-s",
        "g-z"
      ]
    }
  },
  {
    "id": "e-son-z-trace",
    "lessonId": "l-son-z",
    "type": "tracing",
    "order": 4,
    "params": {
      "correctItemId": "g-z",
      "cue": "Avec ton doigt, trace la lettre z",
      "itemIds": [
        "g-z"
      ]
    }
  },
  {
    "id": "e-bd-b1",
    "lessonId": "l-bd-1",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "b",
      "cue": "b, comme ballon",
      "itemIds": [
        "g-b",
        "g-d"
      ]
    }
  },
  {
    "id": "e-bd-d1",
    "lessonId": "l-bd-1",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "d",
      "cue": "d, comme doigt",
      "itemIds": [
        "g-b",
        "g-d"
      ]
    }
  },
  {
    "id": "e-bd-b2",
    "lessonId": "l-bd-1",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "b",
      "cue": "b, comme bébé",
      "itemIds": [
        "g-d",
        "g-p",
        "g-b"
      ]
    }
  },
  {
    "id": "e-bd-bon",
    "lessonId": "l-bd-1",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-bon",
      "itemIds": [
        "w-don",
        "w-bon"
      ]
    }
  },
  {
    "id": "e-bd-dodo",
    "lessonId": "l-bd-1",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-dodo",
      "itemIds": [
        "w-bebe",
        "w-dodo",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-bd-trace-d",
    "lessonId": "l-bd-1",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-d",
      "cue": "Avec ton doigt, trace la lettre d",
      "itemIds": [
        "g-d"
      ]
    }
  },
  {
    "id": "e-pq-p1",
    "lessonId": "l-pq-1",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "p",
      "cue": "p, comme papa",
      "itemIds": [
        "g-p",
        "g-q"
      ]
    }
  },
  {
    "id": "e-pq-q1",
    "lessonId": "l-pq-1",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "k",
      "cue": "q, comme quatre",
      "itemIds": [
        "g-p",
        "g-q"
      ]
    }
  },
  {
    "id": "e-pq-p2",
    "lessonId": "l-pq-1",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "p",
      "cue": "p, comme pomme",
      "itemIds": [
        "g-q",
        "g-b",
        "g-p"
      ]
    }
  },
  {
    "id": "e-pq-quatre",
    "lessonId": "l-pq-1",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-quatre",
      "itemIds": [
        "w-pomme",
        "w-quatre",
        "w-poule"
      ]
    }
  },
  {
    "id": "e-pq-coq",
    "lessonId": "l-pq-1",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-coq",
      "itemIds": [
        "w-coq",
        "w-poule",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-pq-trace-q",
    "lessonId": "l-pq-1",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-q",
      "cue": "Avec ton doigt, trace la lettre q",
      "itemIds": [
        "g-q"
      ]
    }
  },
  {
    "id": "e-son-ch-1",
    "lessonId": "l-son-ch",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ch",
      "cue": "che, comme dans chat",
      "itemIds": [
        "g-s",
        "g-ch"
      ]
    }
  },
  {
    "id": "e-son-ch-2",
    "lessonId": "l-son-ch",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-chat",
      "itemIds": [
        "w-chat",
        "w-cadeau",
        "w-auto"
      ]
    }
  },
  {
    "id": "e-son-ch-image",
    "lessonId": "l-son-ch",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-chat",
      "textItemId": "w-chat",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-chat",
        "w-chaussure",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-son-ch-3",
    "lessonId": "l-son-ch",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "ch",
      "cue": "che",
      "itemIds": [
        "g-s",
        "g-ch",
        "g-j"
      ]
    }
  },
  {
    "id": "e-son-ch-4",
    "lessonId": "l-son-ch",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-cheval",
      "itemIds": [
        "w-cadeau",
        "w-carotte",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-son-ch-trace",
    "lessonId": "l-son-ch",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-ch",
      "cue": "Avec ton doigt, trace les lettres c, h",
      "itemIds": [
        "g-ch"
      ]
    }
  },
  {
    "id": "e-son-ou-1",
    "lessonId": "l-son-ou",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ou",
      "cue": "ou, comme dans loupe",
      "itemIds": [
        "g-ou",
        "g-u"
      ]
    }
  },
  {
    "id": "e-son-ou-2",
    "lessonId": "l-son-ou",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-loupe",
      "itemIds": [
        "w-lapin",
        "w-livre",
        "w-loupe"
      ]
    }
  },
  {
    "id": "e-son-ou-image",
    "lessonId": "l-son-ou",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-loupe",
      "textItemId": "w-loupe",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lapin",
        "w-livre",
        "w-loupe"
      ]
    }
  },
  {
    "id": "e-son-ou-3",
    "lessonId": "l-son-ou",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "ou",
      "cue": "ou",
      "itemIds": [
        "g-ou",
        "g-o",
        "g-u"
      ]
    }
  },
  {
    "id": "e-son-ou-4",
    "lessonId": "l-son-ou",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-poule",
      "itemIds": [
        "w-poisson",
        "w-poule",
        "w-pomme"
      ]
    }
  },
  {
    "id": "e-son-ou-trace",
    "lessonId": "l-son-ou",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-ou",
      "cue": "Avec ton doigt, trace les lettres o, u",
      "itemIds": [
        "g-ou"
      ]
    }
  },
  {
    "id": "e-syl-ma-1",
    "lessonId": "l-syl-ma",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ma",
      "cue": "ma, comme dans maman",
      "itemIds": [
        "s-pa",
        "s-ma"
      ]
    }
  },
  {
    "id": "e-syl-ma-2",
    "lessonId": "l-syl-ma",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "ma",
      "cue": "ma",
      "itemIds": [
        "s-ma",
        "s-am"
      ]
    }
  },
  {
    "id": "e-syl-ma-3",
    "lessonId": "l-syl-ma",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "ma",
      "cue": "ma",
      "itemIds": [
        "s-pa",
        "s-mi",
        "s-ma"
      ]
    }
  },
  {
    "id": "e-syl-ma-4",
    "lessonId": "l-syl-ma",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "w-avion",
        "w-maman",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-syl-ma-image",
    "lessonId": "l-syl-ma",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-maman",
      "textItemId": "w-maman",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-maman",
        "w-maison",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-syl-ma-assemble",
    "lessonId": "l-syl-ma",
    "type": "syllable-assembly",
    "order": 6,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "s-man",
        "s-am",
        "s-ma"
      ]
    }
  },
  {
    "id": "e-syl-pa-1",
    "lessonId": "l-syl-pa",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "pa",
      "cue": "pa, comme dans papa",
      "itemIds": [
        "s-pa",
        "s-ta"
      ]
    }
  },
  {
    "id": "e-syl-pa-2",
    "lessonId": "l-syl-pa",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "pa",
      "cue": "pa",
      "itemIds": [
        "s-ap",
        "s-pa"
      ]
    }
  },
  {
    "id": "e-syl-pa-3",
    "lessonId": "l-syl-pa",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "pa",
      "cue": "pa",
      "itemIds": [
        "s-pi",
        "s-pa",
        "s-ta"
      ]
    }
  },
  {
    "id": "e-syl-pa-4",
    "lessonId": "l-syl-pa",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "w-papa",
        "w-pomme",
        "w-poule"
      ]
    }
  },
  {
    "id": "e-syl-pa-image",
    "lessonId": "l-syl-pa",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-papa",
      "textItemId": "w-papa",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-syl-pa-assemble",
    "lessonId": "l-syl-pa",
    "type": "syllable-assembly",
    "order": 6,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "s-ap",
        "s-pa",
        "s-pa"
      ]
    }
  },
  {
    "id": "e-syl-ta-1",
    "lessonId": "l-syl-ta",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ta",
      "cue": "ta",
      "itemIds": [
        "s-la",
        "s-ta"
      ]
    }
  },
  {
    "id": "e-syl-ta-2",
    "lessonId": "l-syl-ta",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "ta",
      "cue": "ta",
      "itemIds": [
        "s-ta",
        "s-at"
      ]
    }
  },
  {
    "id": "e-syl-ta-3",
    "lessonId": "l-syl-ta",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "ta",
      "cue": "ta",
      "itemIds": [
        "s-ta",
        "s-la",
        "s-ti"
      ]
    }
  },
  {
    "id": "e-syl-la-1",
    "lessonId": "l-syl-la",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "la",
      "cue": "la, comme dans lapin",
      "itemIds": [
        "s-la",
        "s-ta"
      ]
    }
  },
  {
    "id": "e-syl-la-2",
    "lessonId": "l-syl-la",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "la",
      "cue": "la",
      "itemIds": [
        "s-al",
        "s-la"
      ]
    }
  },
  {
    "id": "e-syl-la-3",
    "lessonId": "l-syl-la",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "la",
      "cue": "la",
      "itemIds": [
        "s-ta",
        "s-li",
        "s-la"
      ]
    }
  },
  {
    "id": "e-syl-la-4",
    "lessonId": "l-syl-la",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-lapin",
      "itemIds": [
        "w-livre",
        "w-lapin",
        "w-lait"
      ]
    }
  },
  {
    "id": "e-syl-la-image",
    "lessonId": "l-syl-la",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-lapin",
      "textItemId": "w-lapin",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lapin",
        "w-lait",
        "w-livre"
      ]
    }
  },
  {
    "id": "e-syl-la-assemble",
    "lessonId": "l-syl-la",
    "type": "syllable-assembly",
    "order": 6,
    "params": {
      "correctItemId": "w-lapin",
      "itemIds": [
        "s-pin",
        "s-al",
        "s-la"
      ]
    }
  },
  {
    "id": "e-syl-mi-1",
    "lessonId": "l-syl-mi",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "mi",
      "cue": "mi, comme dans ami",
      "itemIds": [
        "s-pi",
        "s-mi"
      ]
    }
  },
  {
    "id": "e-syl-mi-2",
    "lessonId": "l-syl-mi",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "mi",
      "cue": "mi",
      "itemIds": [
        "s-mi",
        "s-im"
      ]
    }
  },
  {
    "id": "e-syl-mi-3",
    "lessonId": "l-syl-mi",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "mi",
      "cue": "mi",
      "itemIds": [
        "s-mo",
        "s-mi",
        "s-pi"
      ]
    }
  },
  {
    "id": "e-syl-mi-4",
    "lessonId": "l-syl-mi",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-ami",
      "itemIds": [
        "w-ami",
        "w-auto",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-syl-mi-image",
    "lessonId": "l-syl-mi",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-ami",
      "textItemId": "w-ami",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-auto",
        "w-avion",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-syl-mi-assemble",
    "lessonId": "l-syl-mi",
    "type": "syllable-assembly",
    "order": 6,
    "params": {
      "correctItemId": "w-ami",
      "itemIds": [
        "s-a",
        "s-o",
        "s-mi"
      ]
    }
  },
  {
    "id": "e-syl-pi-1",
    "lessonId": "l-syl-pi",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "pi",
      "cue": "pi",
      "itemIds": [
        "s-pi",
        "s-ti"
      ]
    }
  },
  {
    "id": "e-syl-pi-2",
    "lessonId": "l-syl-pi",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "pi",
      "cue": "pi",
      "itemIds": [
        "s-ip",
        "s-pi"
      ]
    }
  },
  {
    "id": "e-syl-pi-3",
    "lessonId": "l-syl-pi",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "pi",
      "cue": "pi",
      "itemIds": [
        "s-pi",
        "s-ti",
        "s-pa"
      ]
    }
  },
  {
    "id": "e-syl-ti-1",
    "lessonId": "l-syl-ti",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ti",
      "cue": "ti",
      "itemIds": [
        "s-li",
        "s-ti"
      ]
    }
  },
  {
    "id": "e-syl-ti-2",
    "lessonId": "l-syl-ti",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "ti",
      "cue": "ti",
      "itemIds": [
        "s-ti",
        "s-it"
      ]
    }
  },
  {
    "id": "e-syl-ti-3",
    "lessonId": "l-syl-ti",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "ti",
      "cue": "ti",
      "itemIds": [
        "s-li",
        "s-to",
        "s-ti"
      ]
    }
  },
  {
    "id": "e-syl-li-1",
    "lessonId": "l-syl-li",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "li",
      "cue": "li, comme dans livre",
      "itemIds": [
        "s-li",
        "s-mi"
      ]
    }
  },
  {
    "id": "e-syl-li-2",
    "lessonId": "l-syl-li",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "li",
      "cue": "li",
      "itemIds": [
        "s-il",
        "s-li"
      ]
    }
  },
  {
    "id": "e-syl-li-3",
    "lessonId": "l-syl-li",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "li",
      "cue": "li",
      "itemIds": [
        "s-la",
        "s-li",
        "s-mi"
      ]
    }
  },
  {
    "id": "e-syl-li-4",
    "lessonId": "l-syl-li",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-livre",
      "itemIds": [
        "w-livre",
        "w-lion",
        "w-lapin"
      ]
    }
  },
  {
    "id": "e-syl-li-image",
    "lessonId": "l-syl-li",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-livre",
      "textItemId": "w-livre",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lion",
        "w-lapin",
        "w-livre"
      ]
    }
  },
  {
    "id": "e-syl-li-assemble",
    "lessonId": "l-syl-li",
    "type": "syllable-assembly",
    "order": 6,
    "params": {
      "correctItemId": "w-livre",
      "itemIds": [
        "s-vre",
        "s-il",
        "s-li"
      ]
    }
  },
  {
    "id": "e-syl-mo-1",
    "lessonId": "l-syl-mo",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "mo",
      "cue": "mo",
      "itemIds": [
        "s-to",
        "s-mo"
      ]
    }
  },
  {
    "id": "e-syl-mo-2",
    "lessonId": "l-syl-mo",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "mo",
      "cue": "mo",
      "itemIds": [
        "s-mo",
        "s-om"
      ]
    }
  },
  {
    "id": "e-syl-mo-3",
    "lessonId": "l-syl-mo",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "mo",
      "cue": "mo",
      "itemIds": [
        "s-mo",
        "s-to",
        "s-ma"
      ]
    }
  },
  {
    "id": "e-syl-to-1",
    "lessonId": "l-syl-to",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "to",
      "cue": "to",
      "itemIds": [
        "s-to",
        "s-mo"
      ]
    }
  },
  {
    "id": "e-syl-to-2",
    "lessonId": "l-syl-to",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "to",
      "cue": "to",
      "itemIds": [
        "s-ot",
        "s-to"
      ]
    }
  },
  {
    "id": "e-syl-to-3",
    "lessonId": "l-syl-to",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "to",
      "cue": "to",
      "itemIds": [
        "s-mo",
        "s-ti",
        "s-to"
      ]
    }
  },
  {
    "id": "e-mot-maman-image",
    "lessonId": "l-mot-maman",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-maman",
      "textItemId": "w-maman",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-maman",
        "w-maison",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-mot-maman-1",
    "lessonId": "l-mot-maman",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "w-maman",
        "w-maison",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-mot-maman-2",
    "lessonId": "l-mot-maman",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "w-bague",
        "w-maman",
        "w-doigt"
      ]
    }
  },
  {
    "id": "e-mot-maman-3",
    "lessonId": "l-mot-maman",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "w-maman",
        "x-naman"
      ]
    }
  },
  {
    "id": "e-mot-maman-assemble",
    "lessonId": "l-mot-maman",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "s-am",
        "s-ma",
        "s-man"
      ]
    }
  },
  {
    "id": "e-mot-papa-image",
    "lessonId": "l-mot-papa",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-papa",
      "textItemId": "w-papa",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-mot-papa-1",
    "lessonId": "l-mot-papa",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-mot-papa-2",
    "lessonId": "l-mot-papa",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "w-papa",
        "w-auto",
        "w-phoque"
      ]
    }
  },
  {
    "id": "e-mot-papa-3",
    "lessonId": "l-mot-papa",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "x-qapa",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-mot-papa-assemble",
    "lessonId": "l-mot-papa",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-papa",
      "itemIds": [
        "s-ap",
        "s-pa",
        "s-pa"
      ]
    }
  },
  {
    "id": "e-mot-livre-image",
    "lessonId": "l-mot-livre",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-livre",
      "textItemId": "w-livre",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lapin",
        "w-livre",
        "w-lion"
      ]
    }
  },
  {
    "id": "e-mot-livre-1",
    "lessonId": "l-mot-livre",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-livre",
      "itemIds": [
        "w-lapin",
        "w-livre",
        "w-lion"
      ]
    }
  },
  {
    "id": "e-mot-livre-2",
    "lessonId": "l-mot-livre",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-livre",
      "itemIds": [
        "w-lait",
        "w-loupe",
        "w-livre"
      ]
    }
  },
  {
    "id": "e-mot-livre-3",
    "lessonId": "l-mot-livre",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-livre",
      "itemIds": [
        "w-livre",
        "x-tivre"
      ]
    }
  },
  {
    "id": "e-mot-livre-assemble",
    "lessonId": "l-mot-livre",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-livre",
      "itemIds": [
        "s-vre",
        "s-il",
        "s-li"
      ]
    }
  },
  {
    "id": "e-mot-ecole-image",
    "lessonId": "l-mot-ecole",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-ecole",
      "textItemId": "w-ecole",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-ecole",
        "w-avion",
        "w-bague"
      ]
    }
  },
  {
    "id": "e-mot-ecole-1",
    "lessonId": "l-mot-ecole",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-ecole",
      "itemIds": [
        "w-ecole",
        "w-avion",
        "w-bague"
      ]
    }
  },
  {
    "id": "e-mot-ecole-2",
    "lessonId": "l-mot-ecole",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-ecole",
      "itemIds": [
        "w-doigt",
        "w-ecole",
        "w-elephant"
      ]
    }
  },
  {
    "id": "e-mot-ecole-3",
    "lessonId": "l-mot-ecole",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-ecole",
      "itemIds": [
        "x-ecole",
        "w-ecole"
      ]
    }
  },
  {
    "id": "e-mot-ecole-assemble",
    "lessonId": "l-mot-ecole",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-ecole",
      "itemIds": [
        "s-co",
        "s-le",
        "s-egrave",
        "s-eacute"
      ]
    }
  },
  {
    "id": "e-mot-maison-image",
    "lessonId": "l-mot-maison",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-maison",
      "textItemId": "w-maison",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-maman",
        "w-montagne",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-mot-maison-1",
    "lessonId": "l-mot-maison",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-maison",
      "itemIds": [
        "w-maman",
        "w-montagne",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-mot-maison-2",
    "lessonId": "l-mot-maison",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-maison",
      "itemIds": [
        "w-maison",
        "w-banane",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-mot-maison-3",
    "lessonId": "l-mot-maison",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-maison",
      "itemIds": [
        "w-maison",
        "x-naison"
      ]
    }
  },
  {
    "id": "e-mot-maison-assemble",
    "lessonId": "l-mot-maison",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-maison",
      "itemIds": [
        "s-mai",
        "s-nai",
        "s-son"
      ]
    }
  },
  {
    "id": "e-mot-ami-image",
    "lessonId": "l-mot-ami",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-ami",
      "textItemId": "w-ami",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-avion",
        "w-ami",
        "w-auto"
      ]
    }
  },
  {
    "id": "e-mot-ami-1",
    "lessonId": "l-mot-ami",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-ami",
      "itemIds": [
        "w-avion",
        "w-ami",
        "w-auto"
      ]
    }
  },
  {
    "id": "e-mot-ami-2",
    "lessonId": "l-mot-ami",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-ami",
      "itemIds": [
        "w-nez",
        "w-feu",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-mot-ami-3",
    "lessonId": "l-mot-ami",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-ami",
      "itemIds": [
        "x-omi",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-mot-ami-assemble",
    "lessonId": "l-mot-ami",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-ami",
      "itemIds": [
        "s-mi",
        "s-a",
        "s-o"
      ]
    }
  },
  {
    "id": "e-mot-chat-image",
    "lessonId": "l-mot-chat",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-chat",
      "textItemId": "w-chat",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-chat",
        "w-chaussure",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-mot-chat-1",
    "lessonId": "l-mot-chat",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-chat",
      "itemIds": [
        "w-chat",
        "w-chaussure",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-mot-chat-2",
    "lessonId": "l-mot-chat",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-chat",
      "itemIds": [
        "w-chenille",
        "w-chat",
        "w-cadeau"
      ]
    }
  },
  {
    "id": "e-mot-chat-3",
    "lessonId": "l-mot-chat",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-chat",
      "itemIds": [
        "w-chat",
        "x-chot"
      ]
    }
  },
  {
    "id": "e-mot-lune-image",
    "lessonId": "l-mot-lune",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-lune",
      "textItemId": "w-lune",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lait",
        "w-lion",
        "w-lune"
      ]
    }
  },
  {
    "id": "e-mot-lune-1",
    "lessonId": "l-mot-lune",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-lune",
      "itemIds": [
        "w-lait",
        "w-lion",
        "w-lune"
      ]
    }
  },
  {
    "id": "e-mot-lune-2",
    "lessonId": "l-mot-lune",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-lune",
      "itemIds": [
        "w-lune",
        "w-livre",
        "w-lapin"
      ]
    }
  },
  {
    "id": "e-mot-lune-3",
    "lessonId": "l-mot-lune",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-lune",
      "itemIds": [
        "x-tune",
        "w-lune"
      ]
    }
  },
  {
    "id": "e-mot-lune-assemble",
    "lessonId": "l-mot-lune",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-lune",
      "itemIds": [
        "s-ne",
        "s-ul",
        "s-lu"
      ]
    }
  },
  {
    "id": "e-mot-fleur-image",
    "lessonId": "l-mot-fleur",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-fleur",
      "textItemId": "w-fleur",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-feu",
        "w-fleur",
        "w-fille"
      ]
    }
  },
  {
    "id": "e-mot-fleur-1",
    "lessonId": "l-mot-fleur",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-fleur",
      "itemIds": [
        "w-feu",
        "w-fleur",
        "w-fille"
      ]
    }
  },
  {
    "id": "e-mot-fleur-2",
    "lessonId": "l-mot-fleur",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-fleur",
      "itemIds": [
        "w-bague",
        "w-avion",
        "w-fleur"
      ]
    }
  },
  {
    "id": "e-mot-fleur-3",
    "lessonId": "l-mot-fleur",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-fleur",
      "itemIds": [
        "w-fleur",
        "x-tleur"
      ]
    }
  },
  {
    "id": "e-mot-velo-image",
    "lessonId": "l-mot-velo",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-velo",
      "textItemId": "w-velo",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-velo",
        "w-auto",
        "w-bebe"
      ]
    }
  },
  {
    "id": "e-mot-velo-1",
    "lessonId": "l-mot-velo",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-velo",
      "itemIds": [
        "w-velo",
        "w-auto",
        "w-bebe"
      ]
    }
  },
  {
    "id": "e-mot-velo-2",
    "lessonId": "l-mot-velo",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-velo",
      "itemIds": [
        "w-chat",
        "w-velo",
        "w-dent"
      ]
    }
  },
  {
    "id": "e-mot-velo-3",
    "lessonId": "l-mot-velo",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-velo",
      "itemIds": [
        "x-uelo",
        "w-velo"
      ]
    }
  },
  {
    "id": "e-mot-velo-assemble",
    "lessonId": "l-mot-velo",
    "type": "syllable-assembly",
    "order": 5,
    "params": {
      "correctItemId": "w-velo",
      "itemIds": [
        "s-veacute",
        "s-eacutev",
        "s-lo"
      ]
    }
  },
  {
    "id": "e-son-oi-1",
    "lessonId": "l-son-oi",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "oi",
      "cue": "oi, comme dans poisson",
      "itemIds": [
        "g-ou",
        "g-oi"
      ]
    }
  },
  {
    "id": "e-son-oi-2",
    "lessonId": "l-son-oi",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-poisson",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-poisson"
      ]
    }
  },
  {
    "id": "e-son-oi-image",
    "lessonId": "l-son-oi",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-poisson",
      "textItemId": "w-poisson",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-poisson"
      ]
    }
  },
  {
    "id": "e-son-oi-3",
    "lessonId": "l-son-oi",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "oi",
      "cue": "oi",
      "itemIds": [
        "g-oi",
        "g-o",
        "g-ou"
      ]
    }
  },
  {
    "id": "e-son-oi-4",
    "lessonId": "l-son-oi",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-doigt",
      "itemIds": [
        "w-domino",
        "w-doigt",
        "w-dodo"
      ]
    }
  },
  {
    "id": "e-son-oi-trace",
    "lessonId": "l-son-oi",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-oi",
      "cue": "Avec ton doigt, trace les lettres o, i",
      "itemIds": [
        "g-oi"
      ]
    }
  },
  {
    "id": "e-son-an-1",
    "lessonId": "l-son-an",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "an",
      "cue": "an, comme dans maman",
      "itemIds": [
        "g-an",
        "g-on"
      ]
    }
  },
  {
    "id": "e-son-an-2",
    "lessonId": "l-son-an",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-maman",
      "itemIds": [
        "w-avion",
        "w-maman",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-son-an-image",
    "lessonId": "l-son-an",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-maman",
      "textItemId": "w-maman",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-avion",
        "w-maman",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-son-an-3",
    "lessonId": "l-son-an",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "an",
      "cue": "an",
      "itemIds": [
        "g-in",
        "g-on",
        "g-an"
      ]
    }
  },
  {
    "id": "e-son-an-4",
    "lessonId": "l-son-an",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-elephant",
      "itemIds": [
        "w-elephant",
        "w-araignee",
        "w-chenille"
      ]
    }
  },
  {
    "id": "e-son-an-trace",
    "lessonId": "l-son-an",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-an",
      "cue": "Avec ton doigt, trace les lettres a, n",
      "itemIds": [
        "g-an"
      ]
    }
  },
  {
    "id": "e-son-on-1",
    "lessonId": "l-son-on",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "on",
      "cue": "on, comme dans bonbon",
      "itemIds": [
        "g-an",
        "g-on"
      ]
    }
  },
  {
    "id": "e-son-on-2",
    "lessonId": "l-son-on",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-bonbon",
      "itemIds": [
        "w-bonbon",
        "w-banane",
        "w-bateau"
      ]
    }
  },
  {
    "id": "e-son-on-image",
    "lessonId": "l-son-on",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-bonbon",
      "textItemId": "w-bonbon",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-bonbon",
        "w-ballon",
        "w-banane"
      ]
    }
  },
  {
    "id": "e-son-on-3",
    "lessonId": "l-son-on",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "on",
      "cue": "on",
      "itemIds": [
        "g-an",
        "g-on",
        "g-ou"
      ]
    }
  },
  {
    "id": "e-son-on-4",
    "lessonId": "l-son-on",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-lion",
      "itemIds": [
        "w-livre",
        "w-lait",
        "w-lion"
      ]
    }
  },
  {
    "id": "e-son-on-trace",
    "lessonId": "l-son-on",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-on",
      "cue": "Avec ton doigt, trace les lettres o, n",
      "itemIds": [
        "g-on"
      ]
    }
  },
  {
    "id": "e-son-in-1",
    "lessonId": "l-son-in",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "in",
      "cue": "in, comme dans lapin",
      "itemIds": [
        "g-in",
        "g-an"
      ]
    }
  },
  {
    "id": "e-son-in-2",
    "lessonId": "l-son-in",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-lapin",
      "itemIds": [
        "w-lait",
        "w-livre",
        "w-lapin"
      ]
    }
  },
  {
    "id": "e-son-in-image",
    "lessonId": "l-son-in",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-lapin",
      "textItemId": "w-lapin",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lait",
        "w-livre",
        "w-lapin"
      ]
    }
  },
  {
    "id": "e-son-in-3",
    "lessonId": "l-son-in",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "in",
      "cue": "in",
      "itemIds": [
        "g-in",
        "g-on",
        "g-an"
      ]
    }
  },
  {
    "id": "e-son-in-trace",
    "lessonId": "l-son-in",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-in",
      "cue": "Avec ton doigt, trace les lettres i, n",
      "itemIds": [
        "g-in"
      ]
    }
  },
  {
    "id": "e-son-eau-1",
    "lessonId": "l-son-eau",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "eau",
      "cue": "eau, comme dans bateau",
      "itemIds": [
        "g-ou",
        "g-eau"
      ]
    }
  },
  {
    "id": "e-son-eau-2",
    "lessonId": "l-son-eau",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-bateau",
      "itemIds": [
        "w-banane",
        "w-bateau",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-eau-image",
    "lessonId": "l-son-eau",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-bateau",
      "textItemId": "w-bateau",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-banane",
        "w-bateau",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-eau-3",
    "lessonId": "l-son-eau",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "eau",
      "cue": "eau",
      "itemIds": [
        "g-an",
        "g-ou",
        "g-eau"
      ]
    }
  },
  {
    "id": "e-son-eau-trace",
    "lessonId": "l-son-eau",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-eau",
      "cue": "Avec ton doigt, trace les lettres e, a, u",
      "itemIds": [
        "g-eau"
      ]
    }
  },
  {
    "id": "e-son-ai-1",
    "lessonId": "l-son-ai",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ai",
      "cue": "è, comme dans lait",
      "itemIds": [
        "g-ai",
        "g-oi"
      ]
    }
  },
  {
    "id": "e-son-ai-2",
    "lessonId": "l-son-ai",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-lait",
      "itemIds": [
        "w-lait",
        "w-lapin",
        "w-lion"
      ]
    }
  },
  {
    "id": "e-son-ai-image",
    "lessonId": "l-son-ai",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-lait",
      "textItemId": "w-lait",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lait",
        "w-lapin",
        "w-lion"
      ]
    }
  },
  {
    "id": "e-son-ai-3",
    "lessonId": "l-son-ai",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "ai",
      "cue": "è",
      "itemIds": [
        "g-oi",
        "g-ai",
        "g-au"
      ]
    }
  },
  {
    "id": "e-son-ai-4",
    "lessonId": "l-son-ai",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-maison",
      "itemIds": [
        "w-maman",
        "w-montagne",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-son-ai-trace",
    "lessonId": "l-son-ai",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-ai",
      "cue": "Avec ton doigt, trace les lettres a, i",
      "itemIds": [
        "g-ai"
      ]
    }
  },
  {
    "id": "e-son-ei-1",
    "lessonId": "l-son-ei",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ei",
      "cue": "è, comme dans neige",
      "itemIds": [
        "g-eu",
        "g-ei"
      ]
    }
  },
  {
    "id": "e-son-ei-2",
    "lessonId": "l-son-ei",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-neige",
      "itemIds": [
        "w-nez",
        "w-avion",
        "w-neige"
      ]
    }
  },
  {
    "id": "e-son-ei-image",
    "lessonId": "l-son-ei",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-neige",
      "textItemId": "w-neige",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-nez",
        "w-avion",
        "w-neige"
      ]
    }
  },
  {
    "id": "e-son-ei-3",
    "lessonId": "l-son-ei",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "ei",
      "cue": "è",
      "itemIds": [
        "g-ei",
        "g-oi",
        "g-eu"
      ]
    }
  },
  {
    "id": "e-son-ei-4",
    "lessonId": "l-son-ei",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-baleine",
      "itemIds": [
        "w-banane",
        "w-baleine",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-ei-trace",
    "lessonId": "l-son-ei",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-ei",
      "cue": "Avec ton doigt, trace les lettres e, i",
      "itemIds": [
        "g-ei"
      ]
    }
  },
  {
    "id": "e-son-au-1",
    "lessonId": "l-son-au",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "au",
      "cue": "o, comme dans auto",
      "itemIds": [
        "g-au",
        "g-ou"
      ]
    }
  },
  {
    "id": "e-son-au-2",
    "lessonId": "l-son-au",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-auto",
      "itemIds": [
        "w-avion",
        "w-auto",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-son-au-image",
    "lessonId": "l-son-au",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-auto",
      "textItemId": "w-auto",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-avion",
        "w-auto",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-son-au-3",
    "lessonId": "l-son-au",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "au",
      "cue": "o",
      "itemIds": [
        "g-an",
        "g-ou",
        "g-au"
      ]
    }
  },
  {
    "id": "e-son-au-4",
    "lessonId": "l-son-au",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-chaussure",
      "itemIds": [
        "w-chaussure",
        "w-chenille",
        "w-chat"
      ]
    }
  },
  {
    "id": "e-son-au-trace",
    "lessonId": "l-son-au",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-au",
      "cue": "Avec ton doigt, trace les lettres a, u",
      "itemIds": [
        "g-au"
      ]
    }
  },
  {
    "id": "e-son-eu-1",
    "lessonId": "l-son-eu",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "eu",
      "cue": "eu, comme dans feu",
      "itemIds": [
        "g-ou",
        "g-eu"
      ]
    }
  },
  {
    "id": "e-son-eu-2",
    "lessonId": "l-son-eu",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-feu",
      "itemIds": [
        "w-feu",
        "w-fille",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-son-eu-image",
    "lessonId": "l-son-eu",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-feu",
      "textItemId": "w-feu",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-feu",
        "w-fille",
        "w-fleur"
      ]
    }
  },
  {
    "id": "e-son-eu-3",
    "lessonId": "l-son-eu",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "eu",
      "cue": "eu",
      "itemIds": [
        "g-ou",
        "g-eu",
        "g-au"
      ]
    }
  },
  {
    "id": "e-son-eu-4",
    "lessonId": "l-son-eu",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-fleur",
      "itemIds": [
        "w-fille",
        "w-avion",
        "w-fleur"
      ]
    }
  },
  {
    "id": "e-son-eu-trace",
    "lessonId": "l-son-eu",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-eu",
      "cue": "Avec ton doigt, trace les lettres e, u",
      "itemIds": [
        "g-eu"
      ]
    }
  },
  {
    "id": "e-son-en-1",
    "lessonId": "l-son-en",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "en",
      "cue": "an, comme dans dent",
      "itemIds": [
        "g-en",
        "g-on"
      ]
    }
  },
  {
    "id": "e-son-en-2",
    "lessonId": "l-son-en",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-dent",
      "itemIds": [
        "w-dodo",
        "w-doigt",
        "w-dent"
      ]
    }
  },
  {
    "id": "e-son-en-image",
    "lessonId": "l-son-en",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-dent",
      "textItemId": "w-dent",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-doigt",
        "w-auto",
        "w-dent"
      ]
    }
  },
  {
    "id": "e-son-en-3",
    "lessonId": "l-son-en",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "en",
      "cue": "an",
      "itemIds": [
        "g-en",
        "g-in",
        "g-on"
      ]
    }
  },
  {
    "id": "e-son-en-4",
    "lessonId": "l-son-en",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-enfant",
      "itemIds": [
        "w-banane",
        "w-enfant",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-en-trace",
    "lessonId": "l-son-en",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-en",
      "cue": "Avec ton doigt, trace les lettres e, n",
      "itemIds": [
        "g-en"
      ]
    }
  },
  {
    "id": "e-son-gn-1",
    "lessonId": "l-son-gn",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "gn",
      "cue": "gne, comme dans montagne",
      "itemIds": [
        "g-n",
        "g-gn"
      ]
    }
  },
  {
    "id": "e-son-gn-2",
    "lessonId": "l-son-gn",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-montagne",
      "itemIds": [
        "w-chenille",
        "w-montagne",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-son-gn-image",
    "lessonId": "l-son-gn",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-montagne",
      "textItemId": "w-montagne",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-araignee",
        "w-montagne",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-son-gn-3",
    "lessonId": "l-son-gn",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "gn",
      "cue": "gne",
      "itemIds": [
        "g-ill",
        "g-n",
        "g-gn"
      ]
    }
  },
  {
    "id": "e-son-gn-4",
    "lessonId": "l-son-gn",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-araignee",
      "itemIds": [
        "w-araignee",
        "w-avion",
        "w-chenille"
      ]
    }
  },
  {
    "id": "e-son-gn-trace",
    "lessonId": "l-son-gn",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-gn",
      "cue": "Avec ton doigt, trace les lettres g, n",
      "itemIds": [
        "g-gn"
      ]
    }
  },
  {
    "id": "e-son-ill-1",
    "lessonId": "l-son-ill",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ill",
      "cue": "ille, comme dans fille",
      "itemIds": [
        "g-ill",
        "g-gn"
      ]
    }
  },
  {
    "id": "e-son-ill-2",
    "lessonId": "l-son-ill",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-fille",
      "itemIds": [
        "w-fille",
        "w-fleur",
        "w-feu"
      ]
    }
  },
  {
    "id": "e-son-ill-image",
    "lessonId": "l-son-ill",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-fille",
      "textItemId": "w-fille",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-fille",
        "w-fleur",
        "w-feu"
      ]
    }
  },
  {
    "id": "e-son-ill-3",
    "lessonId": "l-son-ill",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "ill",
      "cue": "ille",
      "itemIds": [
        "g-gn",
        "g-ill",
        "g-l"
      ]
    }
  },
  {
    "id": "e-son-ill-4",
    "lessonId": "l-son-ill",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-chenille",
      "itemIds": [
        "w-cheval",
        "w-chaussure",
        "w-chenille"
      ]
    }
  },
  {
    "id": "e-son-ill-trace",
    "lessonId": "l-son-ill",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-ill",
      "cue": "Avec ton doigt, trace les lettres i, l, l",
      "itemIds": [
        "g-ill"
      ]
    }
  },
  {
    "id": "e-son-ph-1",
    "lessonId": "l-son-ph",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "ph",
      "cue": "fe, comme dans phoque",
      "itemIds": [
        "g-p",
        "g-ph"
      ]
    }
  },
  {
    "id": "e-son-ph-2",
    "lessonId": "l-son-ph",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-phoque",
      "itemIds": [
        "w-poisson",
        "w-pomme",
        "w-phoque"
      ]
    }
  },
  {
    "id": "e-son-ph-image",
    "lessonId": "l-son-ph",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-phoque",
      "textItemId": "w-phoque",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-poisson",
        "w-pomme",
        "w-phoque"
      ]
    }
  },
  {
    "id": "e-son-ph-3",
    "lessonId": "l-son-ph",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "ph",
      "cue": "fe",
      "itemIds": [
        "g-ph",
        "g-v",
        "g-p"
      ]
    }
  },
  {
    "id": "e-son-ph-4",
    "lessonId": "l-son-ph",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-elephant",
      "itemIds": [
        "w-chenille",
        "w-elephant",
        "w-araignee"
      ]
    }
  },
  {
    "id": "e-son-ph-trace",
    "lessonId": "l-son-ph",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-ph",
      "cue": "Avec ton doigt, trace les lettres p, h",
      "itemIds": [
        "g-ph"
      ]
    }
  },
  {
    "id": "e-son-qu-1",
    "lessonId": "l-son-qu",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "qu",
      "cue": "ke, comme dans quatre",
      "itemIds": [
        "g-qu",
        "g-gu"
      ]
    }
  },
  {
    "id": "e-son-qu-2",
    "lessonId": "l-son-qu",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-quatre",
      "itemIds": [
        "w-banane",
        "w-quatre",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-qu-3",
    "lessonId": "l-son-qu",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "qu",
      "cue": "ke",
      "itemIds": [
        "g-p",
        "g-gu",
        "g-qu"
      ]
    }
  },
  {
    "id": "e-son-qu-4",
    "lessonId": "l-son-qu",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-requin",
      "itemIds": [
        "w-requin",
        "w-robot",
        "w-ballon"
      ]
    }
  },
  {
    "id": "e-son-qu-trace",
    "lessonId": "l-son-qu",
    "type": "tracing",
    "order": 5,
    "params": {
      "correctItemId": "g-qu",
      "cue": "Avec ton doigt, trace les lettres q, u",
      "itemIds": [
        "g-qu"
      ]
    }
  },
  {
    "id": "e-son-gu-1",
    "lessonId": "l-son-gu",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "gu",
      "cue": "gue, comme dans guitare",
      "itemIds": [
        "g-qu",
        "g-gu"
      ]
    }
  },
  {
    "id": "e-son-gu-2",
    "lessonId": "l-son-gu",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "w-guitare",
      "itemIds": [
        "w-guitare",
        "w-gorille",
        "w-gateau"
      ]
    }
  },
  {
    "id": "e-son-gu-image",
    "lessonId": "l-son-gu",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-guitare",
      "textItemId": "w-guitare",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-guitare",
        "w-gorille",
        "w-gateau"
      ]
    }
  },
  {
    "id": "e-son-gu-3",
    "lessonId": "l-son-gu",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "gu",
      "cue": "gue",
      "itemIds": [
        "g-qu",
        "g-gu",
        "g-j"
      ]
    }
  },
  {
    "id": "e-son-gu-4",
    "lessonId": "l-son-gu",
    "type": "word-recognition",
    "order": 5,
    "params": {
      "correctItemId": "w-bague",
      "itemIds": [
        "w-ballon",
        "w-banane",
        "w-bague"
      ]
    }
  },
  {
    "id": "e-son-gu-trace",
    "lessonId": "l-son-gu",
    "type": "tracing",
    "order": 6,
    "params": {
      "correctItemId": "g-gu",
      "cue": "Avec ton doigt, trace les lettres g, u",
      "itemIds": [
        "g-gu"
      ]
    }
  },
  {
    "id": "e-phrase-1-1",
    "lessonId": "l-phrase-1",
    "type": "word-recognition",
    "order": 1,
    "params": {
      "correctItemId": "p-1",
      "itemIds": [
        "p-1",
        "p-2",
        "p-3"
      ]
    }
  },
  {
    "id": "e-phrase-1-sens",
    "lessonId": "l-phrase-1",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-chat",
      "textItemId": "p-1",
      "cue": "Lis la phrase. Qui dort ?",
      "itemIds": [
        "w-chat",
        "w-papa",
        "w-lapin"
      ],
      "question": "Qui dort ?"
    }
  },
  {
    "id": "e-phrase-1-2",
    "lessonId": "l-phrase-1",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-chat",
      "itemIds": [
        "w-le",
        "w-chat",
        "w-dort"
      ]
    }
  },
  {
    "id": "e-phrase-1-3",
    "lessonId": "l-phrase-1",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-dort",
      "itemIds": [
        "w-le",
        "w-chat",
        "w-dort"
      ]
    }
  },
  {
    "id": "e-phrase-2-1",
    "lessonId": "l-phrase-2",
    "type": "word-recognition",
    "order": 1,
    "params": {
      "correctItemId": "p-2",
      "itemIds": [
        "p-3",
        "p-4",
        "p-2"
      ]
    }
  },
  {
    "id": "e-phrase-2-sens",
    "lessonId": "l-phrase-2",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-livre",
      "textItemId": "p-2",
      "cue": "Lis la phrase. Que lit papa ?",
      "itemIds": [
        "w-pomme",
        "w-ballon",
        "w-livre"
      ],
      "question": "Que lit papa ?"
    }
  },
  {
    "id": "e-phrase-2-2",
    "lessonId": "l-phrase-2",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-livre",
      "itemIds": [
        "w-papa",
        "w-lit",
        "w-un",
        "w-livre"
      ]
    }
  },
  {
    "id": "e-phrase-2-3",
    "lessonId": "l-phrase-2",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-lit",
      "itemIds": [
        "w-papa",
        "w-lit",
        "w-un",
        "w-livre"
      ]
    }
  },
  {
    "id": "e-phrase-3-1",
    "lessonId": "l-phrase-3",
    "type": "word-recognition",
    "order": 1,
    "params": {
      "correctItemId": "p-3",
      "itemIds": [
        "p-5",
        "p-3",
        "p-4"
      ]
    }
  },
  {
    "id": "e-phrase-3-sens",
    "lessonId": "l-phrase-3",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-lune",
      "textItemId": "p-3",
      "cue": "Lis la phrase. De quoi parle la phrase ?",
      "itemIds": [
        "w-maison",
        "w-lune",
        "w-soleil"
      ],
      "question": "De quoi parle la phrase ?"
    }
  },
  {
    "id": "e-phrase-3-2",
    "lessonId": "l-phrase-3",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-lune",
      "itemIds": [
        "w-la",
        "w-lune",
        "w-est",
        "w-belle"
      ]
    }
  },
  {
    "id": "e-phrase-3-3",
    "lessonId": "l-phrase-3",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-belle",
      "itemIds": [
        "w-la",
        "w-lune",
        "w-est",
        "w-belle"
      ]
    }
  },
  {
    "id": "e-phrase-4-1",
    "lessonId": "l-phrase-4",
    "type": "word-recognition",
    "order": 1,
    "params": {
      "correctItemId": "p-4",
      "itemIds": [
        "p-4",
        "p-5",
        "p-1"
      ]
    }
  },
  {
    "id": "e-phrase-4-sens",
    "lessonId": "l-phrase-4",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-fleurs",
      "textItemId": "p-4",
      "cue": "Lis la phrase. Qu’est-ce que maman aime ?",
      "itemIds": [
        "w-fleurs",
        "w-banane",
        "w-bateau"
      ],
      "question": "Qu’est-ce que maman aime ?"
    }
  },
  {
    "id": "e-phrase-4-2",
    "lessonId": "l-phrase-4",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-fleurs",
      "itemIds": [
        "w-maman",
        "w-aime",
        "w-les",
        "w-fleurs"
      ]
    }
  },
  {
    "id": "e-phrase-4-3",
    "lessonId": "l-phrase-4",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-aime",
      "itemIds": [
        "w-maman",
        "w-aime",
        "w-les",
        "w-fleurs"
      ]
    }
  },
  {
    "id": "e-phrase-5-1",
    "lessonId": "l-phrase-5",
    "type": "word-recognition",
    "order": 1,
    "params": {
      "correctItemId": "p-5",
      "itemIds": [
        "p-1",
        "p-2",
        "p-5"
      ]
    }
  },
  {
    "id": "e-phrase-5-sens",
    "lessonId": "l-phrase-5",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-ecole",
      "textItemId": "p-5",
      "cue": "Lis la phrase. Où est-ce que je vais ?",
      "itemIds": [
        "w-maison",
        "w-bateau",
        "w-ecole"
      ],
      "question": "Où est-ce que je vais ?"
    }
  },
  {
    "id": "e-phrase-5-2",
    "lessonId": "l-phrase-5",
    "type": "word-recognition",
    "order": 3,
    "params": {
      "correctItemId": "w-ecole",
      "itemIds": [
        "w-je",
        "w-vais",
        "w-a",
        "w-ecole"
      ]
    }
  },
  {
    "id": "e-phrase-5-3",
    "lessonId": "l-phrase-5",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-vais",
      "itemIds": [
        "w-je",
        "w-vais",
        "w-a",
        "w-ecole"
      ]
    }
  },
  {
    "id": "e-texte-1-1",
    "lessonId": "l-texte-1",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-papa",
      "textItemId": "t-1",
      "cue": "Lis le texte. Qui a un petit chat ?",
      "itemIds": [
        "w-papa",
        "w-maman",
        "w-bebe"
      ],
      "question": "Qui a un petit chat ?"
    }
  },
  {
    "id": "e-texte-1-2",
    "lessonId": "l-texte-1",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "p-t1-2",
      "itemIds": [
        "p-t1-1",
        "p-t1-2",
        "p-t1-3"
      ]
    }
  },
  {
    "id": "e-texte-1-3",
    "lessonId": "l-texte-1",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-lait",
      "textItemId": "t-1",
      "cue": "Lis le texte. Qu’est-ce que le chat aime ?",
      "itemIds": [
        "w-pomme",
        "w-banane",
        "w-lait"
      ],
      "question": "Qu’est-ce que le chat aime ?"
    }
  },
  {
    "id": "e-texte-1-4",
    "lessonId": "l-texte-1",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-lait",
      "itemIds": [
        "w-lait",
        "w-papa",
        "w-pomme"
      ]
    }
  },
  {
    "id": "e-texte-2-1",
    "lessonId": "l-texte-2",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-bateau",
      "textItemId": "t-2",
      "cue": "Lis le texte. Qu’est-ce qu’il y a sur l’eau ?",
      "itemIds": [
        "w-avion",
        "w-velo",
        "w-bateau"
      ],
      "question": "Qu’est-ce qu’il y a sur l’eau ?"
    }
  },
  {
    "id": "e-texte-2-2",
    "lessonId": "l-texte-2",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "p-t2-2",
      "itemIds": [
        "p-t2-2",
        "p-t2-3",
        "p-t2-1"
      ]
    }
  },
  {
    "id": "e-texte-2-3",
    "lessonId": "l-texte-2",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-poisson",
      "textItemId": "t-2",
      "cue": "Lis le texte. Quel animal je vois ?",
      "itemIds": [
        "w-cheval",
        "w-poisson",
        "w-lion"
      ],
      "question": "Quel animal je vois ?"
    }
  },
  {
    "id": "e-texte-2-4",
    "lessonId": "l-texte-2",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-poisson",
      "itemIds": [
        "w-bateau",
        "w-lion",
        "w-poisson"
      ]
    }
  },
  {
    "id": "e-texte-3-1",
    "lessonId": "l-texte-3",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-gateau",
      "textItemId": "t-3",
      "cue": "Lis le texte. Qu’est-ce que papa fait ?",
      "itemIds": [
        "w-bateau",
        "w-gateau",
        "w-robot"
      ],
      "question": "Qu’est-ce que papa fait ?"
    }
  },
  {
    "id": "e-texte-3-2",
    "lessonId": "l-texte-3",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "p-t3-2",
      "itemIds": [
        "p-t3-3",
        "p-t3-1",
        "p-t3-2"
      ]
    }
  },
  {
    "id": "e-texte-3-3",
    "lessonId": "l-texte-3",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-bebe",
      "textItemId": "t-3",
      "cue": "Lis le texte. C’est la fête de qui ?",
      "itemIds": [
        "w-bebe",
        "w-papa",
        "w-chat"
      ],
      "question": "C’est la fête de qui ?"
    }
  },
  {
    "id": "e-texte-3-4",
    "lessonId": "l-texte-3",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-bebe",
      "itemIds": [
        "w-papa",
        "w-bebe",
        "w-gateau"
      ]
    }
  },
  {
    "id": "e-texte-4-1",
    "lessonId": "l-texte-4",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-montagne",
      "textItemId": "t-4",
      "cue": "Lis le texte. Où est-ce qu’il neige ?",
      "itemIds": [
        "w-montagne",
        "w-ecole",
        "w-maison"
      ],
      "question": "Où est-ce qu’il neige ?"
    }
  },
  {
    "id": "e-texte-4-2",
    "lessonId": "l-texte-4",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "p-t4-2",
      "itemIds": [
        "p-t4-1",
        "p-t4-2",
        "p-t4-3"
      ]
    }
  },
  {
    "id": "e-texte-4-3",
    "lessonId": "l-texte-4",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-carotte",
      "textItemId": "t-4",
      "cue": "Lis le texte. Le nez est en quoi ?",
      "itemIds": [
        "w-banane",
        "w-pomme",
        "w-carotte"
      ],
      "question": "Le nez est en quoi ?"
    }
  },
  {
    "id": "e-texte-4-4",
    "lessonId": "l-texte-4",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-carotte",
      "itemIds": [
        "w-carotte",
        "w-montagne",
        "w-banane"
      ]
    }
  },
  {
    "id": "e-texte-5-1",
    "lessonId": "l-texte-5",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-lion",
      "textItemId": "t-5",
      "cue": "Lis le texte. Qui dort au soleil ?",
      "itemIds": [
        "w-zebre",
        "w-chat",
        "w-lion"
      ],
      "question": "Qui dort au soleil ?"
    }
  },
  {
    "id": "e-texte-5-2",
    "lessonId": "l-texte-5",
    "type": "word-recognition",
    "order": 2,
    "params": {
      "correctItemId": "p-t5-2",
      "itemIds": [
        "p-t5-2",
        "p-t5-3",
        "p-t5-1"
      ]
    }
  },
  {
    "id": "e-texte-5-3",
    "lessonId": "l-texte-5",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-soleil",
      "textItemId": "t-5",
      "cue": "Lis le texte. Où dort le lion ?",
      "itemIds": [
        "w-maison",
        "w-soleil",
        "w-lune"
      ],
      "question": "Où dort le lion ?"
    }
  },
  {
    "id": "e-texte-5-4",
    "lessonId": "l-texte-5",
    "type": "word-recognition",
    "order": 4,
    "params": {
      "correctItemId": "w-soleil",
      "itemIds": [
        "w-lion",
        "w-lune",
        "w-soleil"
      ]
    }
  },
  {
    "id": "e-bilan-1-1",
    "lessonId": "l-bilan-1",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "a",
      "cue": "a",
      "itemIds": [
        "g-o",
        "g-a",
        "g-e"
      ]
    }
  },
  {
    "id": "e-bilan-1-2",
    "lessonId": "l-bilan-1",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "e",
      "cue": "e",
      "itemIds": [
        "g-e",
        "g-u",
        "g-e-aigu"
      ]
    }
  },
  {
    "id": "e-bilan-1-3",
    "lessonId": "l-bilan-1",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "i",
      "cue": "i",
      "itemIds": [
        "g-a",
        "g-e-aigu",
        "g-i"
      ]
    }
  },
  {
    "id": "e-bilan-1-4",
    "lessonId": "l-bilan-1",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "o",
      "cue": "o",
      "itemIds": [
        "g-a",
        "g-o",
        "g-u"
      ]
    }
  },
  {
    "id": "e-bilan-1-5",
    "lessonId": "l-bilan-1",
    "type": "sound-grapheme",
    "order": 5,
    "params": {
      "phoneme": "u",
      "cue": "u",
      "itemIds": [
        "g-u",
        "g-o",
        "g-i"
      ]
    }
  },
  {
    "id": "e-bilan-1-6",
    "lessonId": "l-bilan-1",
    "type": "sound-grapheme",
    "order": 6,
    "params": {
      "phoneme": "é",
      "cue": "é",
      "itemIds": [
        "g-i",
        "g-e",
        "g-e-aigu"
      ]
    }
  },
  {
    "id": "e-bilan-2-1",
    "lessonId": "l-bilan-2",
    "type": "sound-grapheme",
    "order": 1,
    "params": {
      "phoneme": "m",
      "cue": "m",
      "itemIds": [
        "g-n",
        "g-m",
        "g-p"
      ]
    }
  },
  {
    "id": "e-bilan-2-2",
    "lessonId": "l-bilan-2",
    "type": "sound-grapheme",
    "order": 2,
    "params": {
      "phoneme": "t",
      "cue": "t",
      "itemIds": [
        "g-l",
        "g-d",
        "g-t"
      ]
    }
  },
  {
    "id": "e-bilan-2-3",
    "lessonId": "l-bilan-2",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "r",
      "cue": "r",
      "itemIds": [
        "g-n",
        "g-l",
        "g-r"
      ]
    }
  },
  {
    "id": "e-bilan-2-4",
    "lessonId": "l-bilan-2",
    "type": "sound-grapheme",
    "order": 4,
    "params": {
      "phoneme": "f",
      "cue": "f",
      "itemIds": [
        "g-s",
        "g-v",
        "g-f"
      ]
    }
  },
  {
    "id": "e-bilan-2-5",
    "lessonId": "l-bilan-2",
    "type": "sound-grapheme",
    "order": 5,
    "params": {
      "phoneme": "j",
      "cue": "j",
      "itemIds": [
        "g-v",
        "g-s",
        "g-j"
      ]
    }
  },
  {
    "id": "e-bilan-2-6",
    "lessonId": "l-bilan-2",
    "type": "sound-grapheme",
    "order": 6,
    "params": {
      "phoneme": "z",
      "cue": "z",
      "itemIds": [
        "g-j",
        "g-s",
        "g-z"
      ]
    }
  },
  {
    "id": "e-bilan-3-1",
    "lessonId": "l-bilan-3",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-chat",
      "textItemId": "w-chat",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-chat",
        "w-chaussure",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-bilan-3-2",
    "lessonId": "l-bilan-3",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-maman",
      "textItemId": "w-maman",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-maman",
        "w-maison",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-bilan-3-3",
    "lessonId": "l-bilan-3",
    "type": "sound-grapheme",
    "order": 3,
    "params": {
      "phoneme": "ta",
      "cue": "ta",
      "itemIds": [
        "s-la",
        "s-ta"
      ]
    }
  },
  {
    "id": "e-bilan-3-4",
    "lessonId": "l-bilan-3",
    "type": "picture-match",
    "order": 4,
    "params": {
      "correctItemId": "w-ami",
      "textItemId": "w-ami",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-auto",
        "w-avion",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-bilan-3-5",
    "lessonId": "l-bilan-3",
    "type": "sound-grapheme",
    "order": 5,
    "params": {
      "phoneme": "ti",
      "cue": "ti",
      "itemIds": [
        "s-li",
        "s-ti"
      ]
    }
  },
  {
    "id": "e-bilan-3-6",
    "lessonId": "l-bilan-3",
    "type": "sound-grapheme",
    "order": 6,
    "params": {
      "phoneme": "mo",
      "cue": "mo",
      "itemIds": [
        "s-to",
        "s-mo"
      ]
    }
  },
  {
    "id": "e-bilan-4-1",
    "lessonId": "l-bilan-4",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-maman",
      "textItemId": "w-maman",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-maman",
        "w-maison",
        "w-avion"
      ]
    }
  },
  {
    "id": "e-bilan-4-2",
    "lessonId": "l-bilan-4",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-papa",
      "textItemId": "w-papa",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-papa"
      ]
    }
  },
  {
    "id": "e-bilan-4-3",
    "lessonId": "l-bilan-4",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-ecole",
      "textItemId": "w-ecole",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-ecole",
        "w-avion",
        "w-bague"
      ]
    }
  },
  {
    "id": "e-bilan-4-4",
    "lessonId": "l-bilan-4",
    "type": "picture-match",
    "order": 4,
    "params": {
      "correctItemId": "w-ami",
      "textItemId": "w-ami",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-avion",
        "w-ami",
        "w-auto"
      ]
    }
  },
  {
    "id": "e-bilan-4-5",
    "lessonId": "l-bilan-4",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-chat",
      "textItemId": "w-chat",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-chat",
        "w-chaussure",
        "w-cheval"
      ]
    }
  },
  {
    "id": "e-bilan-4-6",
    "lessonId": "l-bilan-4",
    "type": "picture-match",
    "order": 6,
    "params": {
      "correctItemId": "w-fleur",
      "textItemId": "w-fleur",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-feu",
        "w-fleur",
        "w-fille"
      ]
    }
  },
  {
    "id": "e-bilan-5-1",
    "lessonId": "l-bilan-5",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-poisson",
      "textItemId": "w-poisson",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-pomme",
        "w-poule",
        "w-poisson"
      ]
    }
  },
  {
    "id": "e-bilan-5-2",
    "lessonId": "l-bilan-5",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-bonbon",
      "textItemId": "w-bonbon",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-bonbon",
        "w-ballon",
        "w-banane"
      ]
    }
  },
  {
    "id": "e-bilan-5-3",
    "lessonId": "l-bilan-5",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-lait",
      "textItemId": "w-lait",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-lait",
        "w-lapin",
        "w-lion"
      ]
    }
  },
  {
    "id": "e-bilan-5-4",
    "lessonId": "l-bilan-5",
    "type": "picture-match",
    "order": 4,
    "params": {
      "correctItemId": "w-auto",
      "textItemId": "w-auto",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-avion",
        "w-auto",
        "w-ami"
      ]
    }
  },
  {
    "id": "e-bilan-5-5",
    "lessonId": "l-bilan-5",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-montagne",
      "textItemId": "w-montagne",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-araignee",
        "w-montagne",
        "w-maison"
      ]
    }
  },
  {
    "id": "e-bilan-5-6",
    "lessonId": "l-bilan-5",
    "type": "picture-match",
    "order": 6,
    "params": {
      "correctItemId": "w-phoque",
      "textItemId": "w-phoque",
      "cue": "Lis le mot, puis touche la bonne image.",
      "itemIds": [
        "w-poisson",
        "w-pomme",
        "w-phoque"
      ]
    }
  },
  {
    "id": "e-bilan-6-1",
    "lessonId": "l-bilan-6",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-chat",
      "textItemId": "p-1",
      "cue": "Lis la phrase. Qui dort ?",
      "itemIds": [
        "w-chat",
        "w-papa",
        "w-lapin"
      ],
      "question": "Qui dort ?"
    }
  },
  {
    "id": "e-bilan-6-2",
    "lessonId": "l-bilan-6",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-livre",
      "textItemId": "p-2",
      "cue": "Lis la phrase. Que lit papa ?",
      "itemIds": [
        "w-pomme",
        "w-ballon",
        "w-livre"
      ],
      "question": "Que lit papa ?"
    }
  },
  {
    "id": "e-bilan-6-3",
    "lessonId": "l-bilan-6",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-lune",
      "textItemId": "p-3",
      "cue": "Lis la phrase. De quoi parle la phrase ?",
      "itemIds": [
        "w-maison",
        "w-lune",
        "w-soleil"
      ],
      "question": "De quoi parle la phrase ?"
    }
  },
  {
    "id": "e-bilan-6-4",
    "lessonId": "l-bilan-6",
    "type": "picture-match",
    "order": 4,
    "params": {
      "correctItemId": "w-fleurs",
      "textItemId": "p-4",
      "cue": "Lis la phrase. Qu’est-ce que maman aime ?",
      "itemIds": [
        "w-fleurs",
        "w-banane",
        "w-bateau"
      ],
      "question": "Qu’est-ce que maman aime ?"
    }
  },
  {
    "id": "e-bilan-6-5",
    "lessonId": "l-bilan-6",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-ecole",
      "textItemId": "p-5",
      "cue": "Lis la phrase. Où est-ce que je vais ?",
      "itemIds": [
        "w-maison",
        "w-bateau",
        "w-ecole"
      ],
      "question": "Où est-ce que je vais ?"
    }
  },
  {
    "id": "e-bilan-6-6",
    "lessonId": "l-bilan-6",
    "type": "word-recognition",
    "order": 6,
    "params": {
      "correctItemId": "p-1",
      "itemIds": [
        "p-1",
        "p-2",
        "p-3"
      ]
    }
  },
  {
    "id": "e-bilan-7-1",
    "lessonId": "l-bilan-7",
    "type": "picture-match",
    "order": 1,
    "params": {
      "correctItemId": "w-papa",
      "textItemId": "t-1",
      "cue": "Lis le texte. Qui a un petit chat ?",
      "itemIds": [
        "w-papa",
        "w-maman",
        "w-bebe"
      ],
      "question": "Qui a un petit chat ?"
    }
  },
  {
    "id": "e-bilan-7-2",
    "lessonId": "l-bilan-7",
    "type": "picture-match",
    "order": 2,
    "params": {
      "correctItemId": "w-bateau",
      "textItemId": "t-2",
      "cue": "Lis le texte. Qu’est-ce qu’il y a sur l’eau ?",
      "itemIds": [
        "w-avion",
        "w-velo",
        "w-bateau"
      ],
      "question": "Qu’est-ce qu’il y a sur l’eau ?"
    }
  },
  {
    "id": "e-bilan-7-3",
    "lessonId": "l-bilan-7",
    "type": "picture-match",
    "order": 3,
    "params": {
      "correctItemId": "w-gateau",
      "textItemId": "t-3",
      "cue": "Lis le texte. Qu’est-ce que papa fait ?",
      "itemIds": [
        "w-bateau",
        "w-gateau",
        "w-robot"
      ],
      "question": "Qu’est-ce que papa fait ?"
    }
  },
  {
    "id": "e-bilan-7-4",
    "lessonId": "l-bilan-7",
    "type": "picture-match",
    "order": 4,
    "params": {
      "correctItemId": "w-montagne",
      "textItemId": "t-4",
      "cue": "Lis le texte. Où est-ce qu’il neige ?",
      "itemIds": [
        "w-montagne",
        "w-ecole",
        "w-maison"
      ],
      "question": "Où est-ce qu’il neige ?"
    }
  },
  {
    "id": "e-bilan-7-5",
    "lessonId": "l-bilan-7",
    "type": "picture-match",
    "order": 5,
    "params": {
      "correctItemId": "w-lion",
      "textItemId": "t-5",
      "cue": "Lis le texte. Qui dort au soleil ?",
      "itemIds": [
        "w-zebre",
        "w-chat",
        "w-lion"
      ],
      "question": "Qui dort au soleil ?"
    }
  },
  {
    "id": "e-bilan-7-6",
    "lessonId": "l-bilan-7",
    "type": "picture-match",
    "order": 6,
    "params": {
      "correctItemId": "w-lait",
      "textItemId": "t-1",
      "cue": "Lis le texte. Qu’est-ce que le chat aime ?",
      "itemIds": [
        "w-pomme",
        "w-banane",
        "w-lait"
      ],
      "question": "Qu’est-ce que le chat aime ?"
    }
  }
];
