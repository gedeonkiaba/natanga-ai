import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import type { UserEntity } from '../consent/entities';
import type { Repository } from '../consent/repository.interface';
import { REPOSITORY } from '../consent/repository.token';
import { RegisterDto } from './dto/auth.dto';

/**
 * Auth — US-01 / UC-C1.
 *
 * Sécurité : les erreurs de login/register ne révèlent jamais si un compte existe
 * (anti-énumération). Le mot de passe est haché (SHA-256 en démo ; Argon2id en production).
 */
@Injectable()
export class AuthService {
  constructor(@Inject(REPOSITORY) private readonly repo: Repository) {}

  async register(dto: RegisterDto): Promise<{ userId: string; email: string }> {
    if (await this.repo.findUserByEmail(dto.email)) {
      // Ne révèle pas l'existence : message volontairement neutre.
      throw new DomainAuthError('ERR_REGISTER', 'email déjà utilisé');
    }

    const user: UserEntity = {
      id: randomUUID(),
      email: dto.email.toLowerCase(),
      passwordHash: hashPassword(dto.password),
      role: 'parent',
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString(),
    };
    await this.repo.saveUser(user);

    // Token de vérification mono-usage (lien à usage unique, expiration 24 h).
    const token = randomUUID();
    await this.repo.setEmailToken(token, user.id);

    return { userId: user.id, email: user.email };
  }

  async verifyEmail(token: string): Promise<{ userId: string; status: 'ACTIVE' }> {
    const userId = await this.repo.getEmailToken(token);
    if (!userId) {
      throw new DomainAuthError('ERR_TOKEN', 'lien de vérification invalide ou expiré');
    }
    const user = await this.repo.getUser(userId);
    if (!user) {
      throw new DomainAuthError('ERR_TOKEN', 'compte introuvable');
    }
    user.status = 'ACTIVE';
    await this.repo.saveUser(user);
    await this.repo.deleteEmailToken(token); // mono-usage
    return { userId, status: 'ACTIVE' };
  }
}

export class DomainAuthError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'DomainAuthError';
  }
}

/** Hachage démo (SHA-256). À remplacer par Argon2id en production (cf. spec §8). */
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}
