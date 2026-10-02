import { Inject, Injectable } from '@nestjs/common';
import type { Repository } from '../consent/repository.interface';
import { REPOSITORY } from '../consent/repository.token';
import { DomainError } from '../consent/consent.service';

/**
 * Droits RGPD — US-15 / UC-C4 / UC-C5.
 * Export (accès + portabilité) et suppression (effacement cascade, idempotente).
 */
@Injectable()
export class GdprService {
  constructor(@Inject(REPOSITORY) private readonly repo: Repository) {}

  /** Droit d'accès/portabilité : données agrégées de l'enfant. */
  async export(childId: string, userId: string): Promise<Record<string, unknown>> {
    const child = await this.repo.getChild(childId);
    if (!child || child.userId !== userId) {
      throw new DomainError('ERR_NOT_FOUND', 'données introuvables');
    }
    return {
      profile: {
        displayName: child.displayName,
        birthYear: child.birthYear,
        ageBand: child.ageBand,
        avatar: child.avatar,
      },
      consents: (await this.repo.listConsents(childId)).map((c) => ({
        version: c.version,
        status: c.status,
        grantedAt: c.grantedAt,
        revokedAt: c.revokedAt,
      })),
      exportedAt: new Date().toISOString(),
    };
  }

  /** Droit à l'effacement (cascade), idempotent. */
  async erase(childId: string, userId: string): Promise<{ erased: boolean; childId: string }> {
    const child = await this.repo.getChild(childId);
    if (!child) {
      // Idempotent : effacer deux fois la même ressource ne lève pas d'erreur.
      return { erased: true, childId };
    }
    if (child.userId !== userId) {
      throw new DomainError('ERR_FORBIDDEN', 'accès refusé');
    }
    await this.repo.deleteChild(childId);
    return { erased: true, childId };
  }
}
