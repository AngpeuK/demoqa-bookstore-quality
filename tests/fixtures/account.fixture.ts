import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';
import { AccountClient } from '../../src/api/account.client.js';
import { BookStoreClient } from '../../src/api/book-store.client.js';

export interface TestAccount {
  userId: string;
  username: string;
  password: string;
  token: string;
}

interface AccountFixtures {
  account: TestAccount;
}

interface CreatedUser {
  userID: string;
}

export const test = base.extend<AccountFixtures>({
  account: async ({ request }, use) => {
    const suffix = `${Date.now()}_${randomUUID().replaceAll('-', '').slice(0, 12)}`;
    const username = `qa_${suffix}`;
    const password = `Pw!${suffix}aZ`;
    const accounts = new AccountClient(request);
    const books = new BookStoreClient(request);
    const createdResponse = await accounts.createUser(username, password);
    expect(createdResponse.status()).toBe(201);
    const created = (await createdResponse.json()) as CreatedUser;
    const generated = await accounts.generateToken(username, password);
    expect(generated.status).toBe('Success');

    const account = { userId: created.userID, username, password, token: generated.token };
    try {
      await use(account);
    } finally {
      const cleanupToken = await accounts.generateToken(account.username, account.password);
      if (cleanupToken.token) {
        await books.deleteAllBooks(account.userId, cleanupToken.token);
        await accounts.deleteUser(account.userId, cleanupToken.token);
      }
    }
  },
});

export { expect } from '@playwright/test';
