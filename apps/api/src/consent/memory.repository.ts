import { Injectable } from '@nestjs/common';
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
} from '../consent/entities';
import type { Repository } from './repository.interface';

/**
 * Repository en mémoire (Sprint 1 — dev/tests).
 * Expose la même interface asynchrone que PrismaRepository, mais stocke en RAM.
 * Les Maps restent publiques pour faciliter les assertions des tests.
 */
@Injectable()
export class MemoryRepository implements Repository {
  readonly users = new Map<string, UserEntity>();
  readonly children = new Map<string, ChildEntity>();
  /** Consents indexés par childId → liste ordonnée par version croissante. */
  readonly consents = new Map<string, ConsentEntity[]>();
  /** Tokens de vérification d'email (mono-usage). */
  readonly emailTokens = new Map<string, string>(); // token -> userId

  async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    const normalized = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) return user;
    }
    return undefined;
  }

  async findActiveConsent(childId: string): Promise<ConsentEntity | undefined> {
    const records = this.consents.get(childId) ?? [];
    return [...records].reverse().find((c) => c.status === 'GRANTED');
  }

  async findLatestConsent(childId: string): Promise<ConsentEntity | undefined> {
    const records = this.consents.get(childId) ?? [];
    return records.length > 0 ? records[records.length - 1] : undefined;
  }

  async nextConsentVersion(childId: string): Promise<number> {
    const records = this.consents.get(childId) ?? [];
    return records.reduce((max, c) => Math.max(max, c.version), 0) + 1;
  }

  async appendConsent(record: ConsentEntity): Promise<void> {
    const records = this.consents.get(record.childId) ?? [];
    records.push(record);
    this.consents.set(record.childId, records);
  }

  async listConsents(childId: string): Promise<ConsentEntity[]> {
    return [...(this.consents.get(childId) ?? [])].sort((a, b) => a.version - b.version);
  }

  async saveUser(user: UserEntity): Promise<void> {
    this.users.set(user.id, user);
  }

  async getUser(id: string): Promise<UserEntity | undefined> {
    return this.users.get(id);
  }

  async saveChild(child: ChildEntity): Promise<void> {
    this.children.set(child.id, child);
  }

  async getChild(id: string): Promise<ChildEntity | undefined> {
    return this.children.get(id);
  }

  async listChildrenByUser(userId: string): Promise<ChildEntity[]> {
    return [...this.children.values()].filter((c) => c.userId === userId);
  }

  async deleteChild(id: string): Promise<void> {
    this.children.delete(id);
    this.consents.delete(id);
  }

  async setEmailToken(token: string, userId: string): Promise<void> {
    this.emailTokens.set(token, userId);
  }

  async getEmailToken(token: string): Promise<string | undefined> {
    return this.emailTokens.get(token);
  }

  async deleteEmailToken(token: string): Promise<void> {
    this.emailTokens.delete(token);
  }

  // ─── Pédagogie (en mémoire) ──────────────────────────────────────────────────

  readonly nodes = new Map<string, SkillNodeEntity>();
  readonly lessons = new Map<string, LessonEntity>();
  readonly exercises = new Map<string, ExerciseEntity>();
  readonly items = new Map<string, ItemEntity>();
  readonly progress = new Map<string, ProgressEntity>(); // key = `${childId}:${nodeId}`
  readonly attempts: AttemptEntity[] = [];

  async listNodes(): Promise<SkillNodeEntity[]> {
    return [...this.nodes.values()].sort((a, b) => a.order - b.order);
  }

  async listLessons(nodeId?: string): Promise<LessonEntity[]> {
    return [...this.lessons.values()]
      .filter((l) => (nodeId ? l.nodeId === nodeId : true))
      .sort((a, b) => a.order - b.order);
  }

  async listExercises(lessonId?: string): Promise<ExerciseEntity[]> {
    return [...this.exercises.values()]
      .filter((e) => (lessonId ? e.lessonId === lessonId : true))
      .sort((a, b) => a.order - b.order);
  }

  async listItems(): Promise<ItemEntity[]> {
    return [...this.items.values()];
  }

  async upsertProgress(p: Omit<ProgressEntity, 'id'>): Promise<ProgressEntity> {
    const key = `${p.childId}:${p.nodeId}`;
    const existing = this.progress.get(key);
    const record: ProgressEntity = {
      id: existing?.id ?? `${p.childId}:${p.nodeId}`,
      ...p,
    };
    this.progress.set(key, record);
    return record;
  }

  async listProgress(childId: string): Promise<ProgressEntity[]> {
    return [...this.progress.values()].filter((p) => p.childId === childId);
  }

  async recordAttempt(a: Omit<AttemptEntity, 'id'>): Promise<AttemptEntity> {
    const attempt: AttemptEntity = { id: `attempt:${this.attempts.length + 1}`, ...a };
    this.attempts.push(attempt);
    return attempt;
  }

  async listAttempts(childId: string): Promise<AttemptEntity[]> {
    return this.attempts.filter((a) => a.childId === childId);
  }
}
