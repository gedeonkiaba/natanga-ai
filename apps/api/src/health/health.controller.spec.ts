import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService } from '@nestjs/terminus';

describe('HealthController (smoke)', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: { check: () => ({ status: 'ok' }) } },
      ],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it('expose un endpoint de santé', async () => {
    const result = await controller.check();
    expect(result).toBeDefined();
  });
});
