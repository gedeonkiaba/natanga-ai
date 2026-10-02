import { Inject, Injectable } from '@nestjs/common';
import { deriveAgeBand, isSupportedAge } from '@natanga/core';
import { randomUUID } from 'node:crypto';
import type { ChildEntity } from '../consent/entities';
import type { Repository } from '../consent/repository.interface';
import { REPOSITORY } from '../consent/repository.token';
import { DomainError } from '../consent/consent.service';
import { CreateChildDto } from './dto/children.dto';

/**
 * Gestion des profils enfants — US-02.
 * Invariants C1 (lien obligatoire) et C3 (âge = tranche dérivée).
 */
@Injectable()
export class ChildrenService {
  constructor(@Inject(REPOSITORY) private readonly repo: Repository) {}

  async create(userId: string, dto: CreateChildDto): Promise<ChildEntity> {
    const parent = await this.repo.getUser(userId);
    if (!parent || parent.status !== 'ACTIVE') {
      throw new DomainError('ERR_PARENT', 'compte parent introuvable ou non vérifié');
    }

    // Garde-fou COPPA / périmètre produit (UC-C6) : âge hors 6-12 ans refusé.
    if (!isSupportedAge(dto.birthYear)) {
      throw new DomainError('ERR_AGE', 'ce contenu s’adresse aux enfants de 6 à 12 ans');
    }

    const ageBand = deriveAgeBand(dto.birthYear);
    if (!ageBand) {
      throw new DomainError('ERR_AGE', 'tranche d’âge non déterminable');
    }

    const child: ChildEntity = {
      id: randomUUID(),
      userId,
      displayName: dto.displayName,
      birthYear: dto.birthYear,
      avatar: dto.avatar ?? null,
      ageBand,
      status: 'INACTIVE', // Invariant C2 : inactif tant que consentement non GRANTED.
      createdAt: new Date().toISOString(),
    };
    await this.repo.saveChild(child);
    return child;
  }

  findById(childId: string): Promise<ChildEntity | undefined> {
    return this.repo.getChild(childId);
  }

  listForParent(userId: string): Promise<ChildEntity[]> {
    return this.repo.listChildrenByUser(userId);
  }
}
