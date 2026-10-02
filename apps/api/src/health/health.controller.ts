import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

/**
 * Healthcheck — Lot A.4.
 * Endpoint sans authentification, ne révèle aucune donnée sensible (aucun détail interne).
 */
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    // Retourne uniquement l'état global, sans fuite d'infrastructure.
    return this.health.check([]);
  }
}
