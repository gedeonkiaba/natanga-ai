import { Inject, Injectable } from '@nestjs/common';
import {
  applyAction,
  isChildActive,
  type ConsentAction,
  type ConsentStatus,
} from '@natanga/core';
import type { ConsentEntity } from './entities';
import type { Repository } from './repository.interface';
import { REPOSITORY } from './repository.token';

export interface ConsentContext {
  source: 'web' | 'mobile';
  userAgent: string;
  /** IP tronquée (minimisation — jamais l'IP complète). */
  ipPrefix: string;
}

@Injectable()
export class ConsentService {
  constructor(@Inject(REPOSITORY) private readonly repo: Repository) {}

  /**
   * Applique une action de consentement (grant/deny/revoke).
   * Retourne l'enregistrement créé (append-only) ou lève une erreur de domaine.
   */
  async apply(childId: string, action: ConsentAction, ctx: ConsentContext): Promise<ConsentEntity> {
    const child = await this.repo.getChild(childId);
    if (!child) {
      throw new DomainError('CHILD_NOT_FOUND', "profil enfant introuvable");
    }

    const current = await this.repo.findLatestConsent(childId);
    const from: ConsentStatus = current?.status ?? 'PENDING';

    const transition = applyAction(from, action);
    if (!transition.valid) {
      throw new DomainError('INVALID_TRANSITION', transition.reason ?? 'transition interdite');
    }

    const now = new Date().toISOString();
    const record: ConsentEntity = {
      id: `${childId}:${crypto.randomUUID()}`,
      childId,
      version: await this.repo.nextConsentVersion(childId),
      status: transition.to,
      grantedAt: transition.to === 'GRANTED' ? now : current?.grantedAt ?? null,
      revokedAt: transition.to === 'REVOKED' ? now : null,
      audit: {
        source: ctx.source,
        userAgent: ctx.userAgent,
        ipPrefix: ctx.ipPrefix,
        timestamp: now,
      },
      createdAt: now,
    };

    await this.repo.appendConsent(record);

    // Invariant C2 : l'accès de l'enfant est dérivé du consentement actif.
    child.status = isChildActive(record.status) ? 'ACTIVE' : 'INACTIVE';
    await this.repo.saveChild(child);

    return record;
  }

  /** Historique append-only d'un enfant (preuve d'audit). */
  history(childId: string): Promise<ConsentEntity[]> {
    return this.repo.listConsents(childId);
  }
}

/** Erreur de domaine métier transporte un code stable pour la sérialisation HTTP. */
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
