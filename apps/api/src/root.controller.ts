import { Controller, Get } from '@nestjs/common';

/** Contrôleur de démonstration du socle — sera remplacé par les modules métier. */
@Controller()
export class RootController {
  @Get()
  root() {
    return { name: 'natanga-api', version: '0.1.0', status: 'ok' };
  }
}
