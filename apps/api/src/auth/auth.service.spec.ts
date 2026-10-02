import { MemoryRepository } from '../consent/memory.repository';
import { AuthService, DomainAuthError } from './auth.service';

describe('AuthService', () => {
  it('enregistre un parent et vérifie son email', async () => {
    const repo = new MemoryRepository();
    const service = new AuthService(repo);
    const { userId } = await service.register({
      email: 'parent@example.com',
      password: 'secret1234',
    });

    // On retrouve le token mono-usage pour simuler le clic du lien.
    const token = [...repo.emailTokens.entries()].find(([, id]) => id === userId)?.[0];
    expect(token).toBeDefined();

    const result = await service.verifyEmail(token!);
    expect(result.status).toBe('ACTIVE');
    // Mono-usage : le token ne peut plus servir.
    await expect(service.verifyEmail(token!)).rejects.toThrow(DomainAuthError);
  });

  it('rejette un email déjà utilisé (anti-énumération)', async () => {
    const service = new AuthService(new MemoryRepository());
    await service.register({ email: 'parent@example.com', password: 'secret1234' });
    await expect(
      service.register({ email: 'parent@example.com', password: 'autre1234' }),
    ).rejects.toThrow(DomainAuthError);
  });
});
