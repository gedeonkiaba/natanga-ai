import { MemoryRepository } from './memory.repository';
import { ConsentService, DomainError } from './consent.service';

const ctx = { source: 'web' as const, userAgent: 'test', ipPrefix: '1.0.0.0' };

function setup(childId = 'child-1', userId = 'user-1') {
  const repo = new MemoryRepository();
  repo.children.set(childId, {
    id: childId,
    userId,
    displayName: 'Léa',
    birthYear: 2016,
    avatar: null,
    ageBand: '6-8',
    status: 'INACTIVE',
    createdAt: new Date().toISOString(),
  });
  const service = new ConsentService(repo);
  return { repo, service };
}

describe('ConsentService', () => {
  it('GRANT rend l’enfant actif et crée un enregistrement append-only', async () => {
    const { service, repo } = setup();
    const rec = await service.apply('child-1', 'grant', ctx);

    expect(rec.status).toBe('GRANTED');
    expect(rec.version).toBe(1);
    expect(rec.audit.ipPrefix).toBe('1.0.0.0');
    expect(repo.children.get('child-1')?.status).toBe('ACTIVE');
  });

  it('DENY laisse l’enfant inactif', async () => {
    const { service, repo } = setup();
    await service.apply('child-1', 'deny', ctx);
    expect(repo.children.get('child-1')?.status).toBe('INACTIVE');
  });

  it('REVOKE suspend l’enfant immédiatement', async () => {
    const { service, repo } = setup();
    await service.apply('child-1', 'grant', ctx);
    await service.apply('child-1', 'revoke', ctx);
    expect(repo.children.get('child-1')?.status).toBe('INACTIVE');
  });

  it('versionne chaque transition sans écraser l’historique', async () => {
    const { service, repo } = setup();
    await service.apply('child-1', 'grant', ctx);
    await service.apply('child-1', 'revoke', ctx);
    await service.apply('child-1', 'grant', ctx);

    const history = await service.history('child-1');
    expect(history.map((h) => h.version)).toEqual([1, 2, 3]);
    expect(repo.consents.get('child-1')?.length).toBe(3);
  });

  it('rejette une transition illégale', async () => {
    const { service } = setup();
    await service.apply('child-1', 'grant', ctx);
    await expect(service.apply('child-1', 'deny', ctx)).rejects.toThrow(DomainError);
  });

  it('rejette un enfant inexistant', async () => {
    const { service } = setup();
    await expect(service.apply('missing', 'grant', ctx)).rejects.toThrow(DomainError);
  });
});
