import { describe, expect, it } from 'vitest';
import { applyAction, canTransition, isChildActive } from './index';

describe('consent — machine à états', () => {
  it('autorise PENDING → GRANTED', () => {
    expect(canTransition('PENDING', 'GRANTED')).toBe(true);
    expect(applyAction('PENDING', 'grant')).toEqual({
      valid: true,
      from: 'PENDING',
      to: 'GRANTED',
      reason: undefined,
    });
  });

  it('autorise PENDING → DENIED', () => {
    expect(applyAction('PENDING', 'deny').valid).toBe(true);
  });

  it('autorise GRANTED → REVOKED', () => {
    expect(applyAction('GRANTED', 'revoke').valid).toBe(true);
  });

  it('autorise REVOKED → GRANTED (nouvelle version)', () => {
    expect(applyAction('REVOKED', 'grant').valid).toBe(true);
  });

  it('autorise DENIED → GRANTED (nouvelle tentative)', () => {
    expect(applyAction('DENIED', 'grant').valid).toBe(true);
  });

  it('refuse les transitions illégales', () => {
    expect(applyAction('GRANTED', 'deny').valid).toBe(false);
    expect(applyAction('DENIED', 'revoke').valid).toBe(false);
    expect(applyAction('REVOKED', 'deny').valid).toBe(false);
    expect(applyAction('GRANTED', 'expire').valid).toBe(true); // expire est valide depuis GRANTED
    expect(applyAction('PENDING', 'revoke').valid).toBe(false);
  });

  it('considère un enfant actif uniquement si GRANTED', () => {
    expect(isChildActive('GRANTED')).toBe(true);
    expect(isChildActive('PENDING')).toBe(false);
    expect(isChildActive('REVOKED')).toBe(false);
    expect(isChildActive('DENIED')).toBe(false);
    expect(isChildActive('EXPIRED')).toBe(false);
  });
});
