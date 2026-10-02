import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemoryRepository } from '../consent/memory.repository';
import { PrismaRepository } from '../consent/prisma.repository';
import { REPOSITORY } from '../consent/repository.token';
import type { Repository } from '../consent/repository.interface';
import { PrismaService } from './prisma.service';

/**
 * Module global fournissant une instance UNIQUE du Repository (interface).
 * Le choix de l'implémentation est piloté par `DB_PROVIDER` :
 *   - `memory` (défaut) → MemoryRepository (dev/tests)
 *   - `prisma`          → PrismaRepository (Postgres)
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    {
      provide: REPOSITORY,
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService): Repository => {
        const provider = config.get<string>('DB_PROVIDER', 'memory');
        // Par défaut : mémoire. Prisma uniquement si explicitement demandé
        // (évite d'exiger une BDD pendant les tests unitaires du socle).
        if (provider === 'prisma') {
          return new PrismaRepository(prisma);
        }
        return new MemoryRepository();
      },
    },
  ],
  exports: [REPOSITORY, PrismaService],
})
export class SharedModule {}
