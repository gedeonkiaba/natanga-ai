import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DomainExceptionFilter } from '../src/common/domain-exception.filter';
import { MemoryRepository } from '../src/consent/memory.repository';
import { REPOSITORY } from '../src/consent/repository.token';

/**
 * Test e2e du parcours Lot C complet :
 * register → verify-email → create child → grant → revoke → export → erase.
 */
describe('Parcours consentement RGPD (e2e)', () => {
  let app: INestApplication;
  let repo: MemoryRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new DomainExceptionFilter());
    // Récupération du repository via le token d'injection (DB_PROVIDER=memory par défaut).
    repo = moduleRef.get<MemoryRepository>(REPOSITORY);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('déroule le parcours complet de bout en bout', async () => {
    const server = app.getHttpServer();

    // 1. Créer un parent.
    const reg = await request(server)
      .post('/api/auth/register')
      .send({ email: 'parent@e2e.com', password: 'secret1234' })
      .expect(201);
    const userId = reg.body.userId as string;

    // 2. Vérifier l'email (le token réel est récupéré depuis le repository de test).
    const token = [...repo.emailTokens.entries()].find(([, id]) => id === userId)?.[0];
    expect(token).toBeDefined();
    await request(server).post('/api/auth/verify-email').send({ token }).expect(201);

    // 3. Créer un profil enfant (âge dynamique stable dans la tranche 6-8).
    const birthYear = new Date().getFullYear() - 7;
    const child = await request(server)
      .post('/api/children')
      .set('x-user-id', userId)
      .send({ displayName: 'Léa', birthYear })
      .expect(201);
    const childId = child.body.id as string;
    expect(child.body.status).toBe('INACTIVE');
    expect(child.body.ageBand).toBe('6-8');

    // 4. Donner le consentement → enfant ACTIVE.
    await request(server)
      .post(`/api/children/${childId}/consents`)
      .set('x-user-agent', 'natanga-mobile')
      .send({ action: 'grant' })
      .expect(201);

    const childAfterGrant = await request(server)
      .get(`/api/children/${childId}`)
      .set('x-user-id', userId)
      .expect(200);
    expect(childAfterGrant.body.status).toBe('ACTIVE');

    // 5. Révocation → enfant INACTIVE + historique append-only (versions 1..2).
    await request(server)
      .post(`/api/children/${childId}/consents`)
      .send({ action: 'revoke' })
      .expect(201);

    const history = await request(server)
      .get(`/api/children/${childId}/consents`)
      .expect(200);
    expect(history.body.map((c: { version: number }) => c.version)).toEqual([1, 2]);

    // 6. Export (droit d'accès/portabilité).
    const exported = await request(server)
      .get(`/api/children/${childId}/export`)
      .set('x-user-id', userId)
      .expect(200);
    expect(exported.body).toHaveProperty('profile');
    expect(exported.body).toHaveProperty('consents');

    // 7. Suppression (droit à l'effacement, idempotent).
    await request(server).delete(`/api/children/${childId}`).set('x-user-id', userId).expect(200);
    await request(server).delete(`/api/children/${childId}`).set('x-user-id', userId).expect(200);
  });

  it('refuse un âge hors périmètre (COPPA)', async () => {
    const server = app.getHttpServer();
    const reg = await request(server)
      .post('/api/auth/register')
      .send({ email: 'parent2@e2e.com', password: 'secret1234' })
      .expect(201);
    const userId = reg.body.userId as string;
    const token = [...repo.emailTokens.entries()].find(([, id]) => id === userId)?.[0];
    await request(server).post('/api/auth/verify-email').send({ token }).expect(201);

    const tooYoung = new Date().getFullYear() - 3; // 3 ans
    const res = await request(server)
      .post('/api/children')
      .set('x-user-id', userId)
      .send({ displayName: 'X', birthYear: tooYoung })
      .expect(422);
    expect(res.body.code).toBe('ERR_AGE');
  });
});
