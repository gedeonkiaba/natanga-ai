import { MemoryRepository } from '../consent/memory.repository';
import { DomainError } from '../consent/consent.service';
import { ChildrenService } from './children.service';

describe('ChildrenService', () => {
  function setup() {
    const repo = new MemoryRepository();
    repo.users.set('user-1', {
      id: 'user-1',
      email: 'parent@example.com',
      passwordHash: 'x',
      role: 'parent',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });
    return { repo, service: new ChildrenService(repo) };
  }

  it('crée un profil enfant inactif avec tranche dérivée', async () => {
    const { service } = setup();
    const birthYear = new Date().getFullYear() - 7;
    const child = await service.create('user-1', { displayName: 'Léa', birthYear });
    expect(child.status).toBe('INACTIVE');
    expect(child.ageBand).toBe('6-8');
  });

  it('refuse un âge hors périmètre (COPPA)', async () => {
    const { service } = setup();
    const tooYoung = new Date().getFullYear() - 3; // 3 ans → hors 6-12
    await expect(
      service.create('user-1', { displayName: 'X', birthYear: tooYoung }),
    ).rejects.toThrow(DomainError);
  });

  it('refuse un parent non vérifié', async () => {
    const { service, repo } = setup();
    repo.users.get('user-1')!.status = 'PENDING_VERIFICATION';
    await expect(
      service.create('user-1', { displayName: 'Léa', birthYear: new Date().getFullYear() - 7 }),
    ).rejects.toThrow(DomainError);
  });
});
