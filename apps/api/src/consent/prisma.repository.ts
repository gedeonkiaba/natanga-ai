import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
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
import type { Repository } from './repository.interface';
import { PrismaService } from '../common/prisma.service';

/**
 * Implémentation PostgreSQL du Repository (via Prisma).
 * Même contrat que MemoryRepository ; les services restent inchangés.
 */
@Injectable()
export class PrismaRepository implements Repository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    const u = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return u ? toUserEntity(u) : undefined;
  }

  async saveUser(user: UserEntity): Promise<void> {
    // Upsert : supporte la création comme la mise à jour (ex. passage ACTIVE).
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: { ...user },
      update: {
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
      },
    });
  }

  async getUser(id: string): Promise<UserEntity | undefined> {
    const u = await this.prisma.user.findUnique({ where: { id } });
    return u ? toUserEntity(u) : undefined;
  }

  async saveChild(child: ChildEntity): Promise<void> {
    await this.prisma.child.upsert({
      where: { id: child.id },
      create: { ...child },
      update: { status: child.status },
    });
  }

  async getChild(id: string): Promise<ChildEntity | undefined> {
    const c = await this.prisma.child.findUnique({ where: { id } });
    return c ? toChildEntity(c) : undefined;
  }

  async listChildrenByUser(userId: string): Promise<ChildEntity[]> {
    const children = await this.prisma.child.findMany({ where: { userId } });
    return children.map(toChildEntity);
  }

  async deleteChild(id: string): Promise<void> {
    // Cascade supprime les consents (relation onDelete: Cascade).
    await this.prisma.child.delete({ where: { id } });
  }

  async findActiveConsent(childId: string): Promise<ConsentEntity | undefined> {
    const c = await this.prisma.consent.findFirst({
      where: { childId, status: 'GRANTED' },
      orderBy: { version: 'desc' },
    });
    return c ? toConsentEntity(c) : undefined;
  }

  async findLatestConsent(childId: string): Promise<ConsentEntity | undefined> {
    const c = await this.prisma.consent.findFirst({
      where: { childId },
      orderBy: { version: 'desc' },
    });
    return c ? toConsentEntity(c) : undefined;
  }

  async nextConsentVersion(childId: string): Promise<number> {
    const latest = await this.prisma.consent.findFirst({
      where: { childId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    return (latest?.version ?? 0) + 1;
  }

  async appendConsent(record: ConsentEntity): Promise<void> {
    await this.prisma.consent.create({
      data: {
        ...record,
        // L'audit (ConsentAudit) est sérialisé en JSON Prisma.
        audit: record.audit as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async listConsents(childId: string): Promise<ConsentEntity[]> {
    const records = await this.prisma.consent.findMany({
      where: { childId },
      orderBy: { version: 'asc' },
    });
    return records.map(toConsentEntity);
  }

  async setEmailToken(token: string, userId: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h
    await this.prisma.emailToken.create({ data: { token, userId, expiresAt } });
  }

  async getEmailToken(token: string): Promise<string | undefined> {
    const t = await this.prisma.emailToken.findUnique({ where: { token } });
    if (!t) return undefined;
    if (t.expiresAt < new Date()) {
      await this.prisma.emailToken.delete({ where: { token } }).catch(() => undefined);
      return undefined;
    }
    return t.userId;
  }

  async deleteEmailToken(token: string): Promise<void> {
    await this.prisma.emailToken.delete({ where: { token } }).catch(() => undefined);
  }

  // ─── Pédagogie (Postgres) ──────────────────────────────────────────────────────

  async listNodes(): Promise<SkillNodeEntity[]> {
    const nodes = await this.prisma.skillNode.findMany({ orderBy: { order: 'asc' } });
    return nodes.map((n) => ({
      id: n.id,
      level: n.level as SkillNodeEntity['level'],
      title: n.title,
      order: n.order,
      unlockedWhen: n.unlockedWhen,
    }));
  }

  async listLessons(nodeId?: string): Promise<LessonEntity[]> {
    const lessons = await this.prisma.lesson.findMany({
      where: nodeId ? { nodeId } : undefined,
      orderBy: { order: 'asc' },
    });
    return lessons.map((l) => ({
      id: l.id,
      nodeId: l.nodeId,
      title: l.title,
      durationMin: l.durationMin,
      order: l.order,
    }));
  }

  async listExercises(lessonId?: string): Promise<ExerciseEntity[]> {
    const exercises = await this.prisma.exercise.findMany({
      where: lessonId ? { lessonId } : undefined,
      orderBy: { order: 'asc' },
    });
    return exercises.map((e) => ({
      id: e.id,
      lessonId: e.lessonId,
      type: e.type as ExerciseEntity['type'],
      params: (e.params ?? {}) as Record<string, unknown>,
      order: e.order,
    }));
  }

  async listItems(): Promise<ItemEntity[]> {
    const items = await this.prisma.item.findMany();
    return items.map((i) => ({
      id: i.id,
      type: i.type as ItemEntity['type'],
      label: i.label,
      phoneme: i.phoneme,
      audioUrl: i.audioUrl,
      metadata: (i.metadata ?? null) as Record<string, unknown> | null,
    }));
  }

  async upsertProgress(p: Omit<ProgressEntity, 'id'>): Promise<ProgressEntity> {
    const rec = await this.prisma.progress.upsert({
      where: { childId_nodeId: { childId: p.childId, nodeId: p.nodeId } },
      create: p,
      update: { status: p.status, masteredScore: p.masteredScore },
    });
    return {
      id: rec.id,
      childId: rec.childId,
      nodeId: rec.nodeId,
      status: rec.status as ProgressEntity['status'],
      masteredScore: rec.masteredScore,
    };
  }

  async listProgress(childId: string): Promise<ProgressEntity[]> {
    const rows = await this.prisma.progress.findMany({ where: { childId } });
    return rows.map((r) => ({
      id: r.id,
      childId: r.childId,
      nodeId: r.nodeId,
      status: r.status as ProgressEntity['status'],
      masteredScore: r.masteredScore,
    }));
  }

  async recordAttempt(a: Omit<AttemptEntity, 'id'>): Promise<AttemptEntity> {
    const rec = await this.prisma.attempt.create({ data: a });
    return {
      id: rec.id,
      childId: rec.childId,
      exerciseId: rec.exerciseId,
      itemId: rec.itemId,
      isCorrect: rec.isCorrect,
      errorKind: rec.errorKind,
    };
  }

  async listAttempts(childId: string): Promise<AttemptEntity[]> {
    const rows = await this.prisma.attempt.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      childId: r.childId,
      exerciseId: r.exerciseId,
      itemId: r.itemId,
      isCorrect: r.isCorrect,
      errorKind: r.errorKind,
    }));
  }
}

// ── Mappers Prisma → entités du domaine ──────────────────────────────────────────

type PrismaUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  status: string;
  createdAt: Date;
};

type PrismaChild = {
  id: string;
  userId: string;
  displayName: string;
  birthYear: number;
  avatar: string | null;
  ageBand: string;
  status: string;
  createdAt: Date;
};

type PrismaConsent = {
  id: string;
  childId: string;
  version: number;
  status: string;
  grantedAt: Date | null;
  revokedAt: Date | null;
  audit: unknown;
  createdAt: Date;
};

function toUserEntity(u: PrismaUser): UserEntity {
  return {
    id: u.id,
    email: u.email,
    passwordHash: u.passwordHash,
    role: u.role as UserEntity['role'],
    status: u.status as UserEntity['status'],
    createdAt: u.createdAt.toISOString(),
  };
}

function toChildEntity(c: PrismaChild): ChildEntity {
  return {
    id: c.id,
    userId: c.userId,
    displayName: c.displayName,
    birthYear: c.birthYear,
    avatar: c.avatar,
    ageBand: c.ageBand as ChildEntity['ageBand'],
    status: c.status as ChildEntity['status'],
    createdAt: c.createdAt.toISOString(),
  };
}

function toConsentEntity(c: PrismaConsent): ConsentEntity {
  return {
    id: c.id,
    childId: c.childId,
    version: c.version,
    status: c.status as ConsentEntity['status'],
    grantedAt: c.grantedAt?.toISOString() ?? null,
    revokedAt: c.revokedAt?.toISOString() ?? null,
    audit: c.audit as ConsentEntity['audit'],
    createdAt: c.createdAt.toISOString(),
  };
}
