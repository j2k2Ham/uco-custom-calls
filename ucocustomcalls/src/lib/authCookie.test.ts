import { signAuthCookie, verifyAuthCookie } from './authCookie';

// Simple unit tests for dev signed auth cookie helpers

describe('authCookie signing & verification', () => {
  it('signs and verifies a valid payload', async () => {
    const token = await signAuthCookie({ id: 'u_1', email: 'user@example.com', name: 'User Example' });
    const payload = await verifyAuthCookie(token);
    expect(payload).not.toBeNull();
    expect(payload?.email).toBe('user@example.com');
    expect(payload?.name).toBe('User Example');
  });

  it('rejects a tampered token (payload changed)', async () => {
    const token = await signAuthCookie({ id: 'u_2', email: 'victim@example.com' });
  const [, sig] = token.split('.');
  // Build new payload with different email but reuse old signature
    const tampered = JSON.stringify({ id: 'u_2', email: 'attacker@example.com' });
    const newB64 = typeof btoa === 'function' ? btoa(tampered) : Buffer.from(tampered).toString('base64');
    const tamperedToken = `${newB64}.${sig}`;
    const payload = await verifyAuthCookie(tamperedToken);
    expect(payload).toBeNull();
  });

  it('rejects malformed token formats', async () => {
    expect(await verifyAuthCookie('not-a-valid-token')).toBeNull();
    expect(await verifyAuthCookie('a.b.c')).toBeNull();
  });
});
