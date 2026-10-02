import { Injectable, Optional, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService — gère la connexion Prisma (lifecycle NestJS).
 * Ne se connecte que si `DB_PROVIDER=prisma` (sinon, mode mémoire : aucune connexion).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly enabled: boolean;

  constructor(@Optional() config?: ConfigService) {
    super();
    this.enabled = config?.get<string>('DB_PROVIDER', 'memory') === 'prisma';
  }

  async onModuleInit(): Promise<void> {
    if (this.enabled) {
      await this.$connect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.enabled) {
      await this.$disconnect();
    }
  }
}
