import { expect, test } from '@playwright/test';
import { AccountClient } from '../../src/api/account.client.js';
import { test as accountTest } from '../fixtures/account.fixture.js';

test.describe('Account API — validation and authorization', () => {
  test('@regression API-013 rejects a password without required complexity', async ({
    request,
  }) => {
    const response = await new AccountClient(request).createUser(`weak_${Date.now()}`, 'password');
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: '1300' });
  });

  test('@regression API-017 rejects a missing username', async ({ request }) => {
    const response = await request.post('/Account/v1/User', { data: { password: 'Strong!Pass1' } });
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: '1200' });
  });

  test('@regression API-018 rejects a missing password', async ({ request }) => {
    const response = await request.post('/Account/v1/User', {
      data: { userName: `missing_pw_${Date.now()}` },
    });
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: '1200' });
  });

  test('@regression API-019 rejects invalid credentials when generating a token', async ({
    request,
  }) => {
    const token = await new AccountClient(request).generateToken('missing-user', 'Wrong!Pass1');
    expect(token).toMatchObject({ status: 'Failed', result: 'User authorization failed.' });
    expect(token.token).toBeNull();
  });

  test('@security API-020 rejects authorization for an unknown user', async ({ request }) => {
    const response = await new AccountClient(request).authorize('missing-user', 'Wrong!Pass1');
    expect(response.status()).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      code: '1207',
      message: 'User not found!',
    });
  });

  test('@security API-021 denies profile access without a bearer token', async ({ request }) => {
    const response = await request.get('/Account/v1/User/00000000-0000-0000-0000-000000000000');
    expect(response.status()).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ code: '1200' });
  });
});

accountTest.describe('Account API — existing user rules', () => {
  accountTest('@regression API-014 rejects a duplicate username', async ({ request, account }) => {
    const response = await new AccountClient(request).createUser(
      account.username,
      account.password,
    );
    expect(response.status()).toBe(406);
    await expect(response.json()).resolves.toMatchObject({ code: '1204' });
  });

  accountTest('@smoke API-022 authorizes valid credentials', async ({ request, account }) => {
    const response = await new AccountClient(request).authorize(account.username, account.password);
    expect(response.status()).toBe(200);
    expect(await response.json()).toBe(true);
  });

  accountTest(
    '@regression API-023 returns a usable token with expiry metadata',
    async ({ request, account }) => {
      const token = await new AccountClient(request).generateToken(
        account.username,
        account.password,
      );
      expect(token.token).toBeTruthy();
      expect(Date.parse(token.expires)).toBeGreaterThan(Date.now());
    },
  );
});
