import { Controller, Delete, Get, Headers, Param } from '@nestjs/common';
import { GdprService } from './gdpr.service';

/** Endpoints droits RGPD (export / suppression) — US-15 / UC-C4 / UC-C5. */
@Controller('children/:childId')
export class GdprController {
  constructor(private readonly gdpr: GdprService) {}

  @Get('export')
  export(@Param('childId') childId: string, @Headers('x-user-id') userId: string) {
    return this.gdpr.export(childId, userId);
  }

  @Delete()
  erase(@Param('childId') childId: string, @Headers('x-user-id') userId: string) {
    return this.gdpr.erase(childId, userId);
  }
}
