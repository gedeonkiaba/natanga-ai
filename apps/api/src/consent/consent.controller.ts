import { Body, Controller, Get, Headers, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ConsentService } from './consent.service';
import { ConsentActionDto } from './dto/consent.dto';

/**
 * Endpoints de consentement — US-01 / UC-C2 / UC-C3.
 * Le contexte d'audit (source, user-agent, IP tronquée) est extrait de la requête.
 */
@Controller('children/:childId/consents')
export class ConsentController {
  constructor(private readonly consent: ConsentService) {}

  @Post()
  async apply(
    @Param('childId') childId: string,
    @Body() dto: ConsentActionDto,
    @Req() req: Request,
    @Headers('x-user-agent') userAgent?: string,
  ) {
    const ctx = {
      source: detectSource(req, userAgent),
      userAgent: userAgent ?? 'unknown',
      ipPrefix: truncateIp(req.ip ?? '0.0.0.0'),
    };
    return this.consent.apply(childId, dto.action, ctx);
  }

  @Get()
  history(@Param('childId') childId: string) {
    return this.consent.history(childId);
  }
}

function detectSource(req: Request, userAgent?: string): 'web' | 'mobile' {
  const ua = (userAgent ?? req.headers['user-agent'] ?? '').toLowerCase();
  // Heuristique simple : les clients mobiles Expo identifiés par un marqueur.
  return ua.includes('natanga-mobile') ? 'mobile' : 'web';
}

/** Tronque l'IP au premier octet (minimisation — jamais d'IP complète stockée). */
function truncateIp(ip: string): string {
  const v4 = ip.replace('::ffff:', '');
  const parts = v4.split('.');
  return parts[0] ? `${parts[0]}.0.0.0` : '0.0.0.0';
}
