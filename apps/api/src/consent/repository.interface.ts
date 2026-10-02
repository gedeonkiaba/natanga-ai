import type {
  AttemptEntity,
  ChildEntity,
  ConsentEntity,
  ExerciseEntity,
  ItemEntity,
  LessonEntity,
  ProgressEntity,
  SkillNodeEntity,
  UserEntity,
} from './entities';

/**
 * Contrat de persistance — tout est asynchrone (Promise).
 * Couvre l'auth/consentement (Lot C) ET la pédagogie (Lot E/F).
 * Implémentations : `MemoryRepository` (tests/dev) et `PrismaRepository` (Postgres).
 * Les services ne dépendent que de cette interface, jamais d'une implémentation.
 */
export interface Repository {
  // Auth / consentement
  findUserByEmail(email: string): Promise<UserEntity | undefined>;
  saveUser(user: UserEntity): Promise<void>;
  getUser(id: string): Promise<UserEntity | undefined>;

  saveChild(child: ChildEntity): Promise<void>;
  getChild(id: string): Promise<ChildEntity | undefined>;
  listChildrenByUser(userId: string): Promise<ChildEntity[]>;
  deleteChild(id: string): Promise<void>;

  findActiveConsent(childId: string): Promise<ConsentEntity | undefined>;
  findLatestConsent(childId: string): Promise<ConsentEntity | undefined>;
  nextConsentVersion(childId: string): Promise<number>;
  appendConsent(record: ConsentEntity): Promise<void>;
  listConsents(childId: string): Promise<ConsentEntity[]>;

  setEmailToken(token: string, userId: string): Promise<void>;
  getEmailToken(token: string): Promise<string | undefined>;
  deleteEmailToken(token: string): Promise<void>;

  // Pédagogie (lecture)
  listNodes(): Promise<SkillNodeEntity[]>;
  listLessons(nodeId?: string): Promise<LessonEntity[]>;
  listExercises(lessonId?: string): Promise<ExerciseEntity[]>;
  listItems(): Promise<ItemEntity[]>;

  // Pédagogie (écriture — progression)
  upsertProgress(progress: Omit<ProgressEntity, 'id'>): Promise<ProgressEntity>;
  listProgress(childId: string): Promise<ProgressEntity[]>;
  recordAttempt(attempt: Omit<AttemptEntity, 'id'>): Promise<AttemptEntity>;
  listAttempts(childId: string): Promise<AttemptEntity[]>;
}
