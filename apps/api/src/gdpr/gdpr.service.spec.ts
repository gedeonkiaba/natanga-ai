import { MemoryRepository } from '../consent/memory.repository';
import { GdprService } from './gdpr.service';

describe('GdprService', () => {
  function setup() {
    const repo = new MemoryRepository();
    repo.children.set('child-1', {
      id: 'child-1',
      userId: 'user-1',
      displayName: 'Léa',
      birthYear: 2016,
      avatar: null,
      ageBand: '6-8',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });
    return { repo, service: new GdprService(repo) };
  }

  it('exporte les données (accès/portabilité)', async () => {
    const { service } = setup();
    const data = await service.export('child-1', 'user-1');
    expect(data).toHaveProperty('profile');
    expect(data).toHaveProperty('consents');
  });

  it('refuse l’export pour un parent non référent', async () => {
    const { service } = setup();
    await expect(service.export('child-1', 'user-2')).rejects.toThrow();
  });

  it('supprime les données de façon idempotente (cascade)', async () => {
    const { service, repo } = setup();
    expect((await service.erase('child-1', 'user-1')).erased).toBe(true);
    expect(repo.children.has('child-1')).toBe(false);
    // Idempotent : pas d'erreur sur second appel.
    expect((await service.erase('child-1', 'user-1')).erased).toBe(true);
  });
});
