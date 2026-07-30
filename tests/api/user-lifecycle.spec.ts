import { expect, test } from '@playwright/test';
import { AccountClient } from '../../src/api/account.client.js';
import { BookStoreClient } from '../../src/api/book-store.client.js';

interface CreatedUser {
  userID: string;
  username: string;
  books: unknown[];
}

test.describe('Account API — isolated user lifecycle', () => {
  test('@regression API-010 creates, authorizes, updates and removes a user', async ({
    request,
  }) => {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
    const username = `qa_portfolio_${suffix}`;
    const password = `Pw!${suffix}aZ`;
    const account = new AccountClient(request);
    const bookstore = new BookStoreClient(request);
    let userId: string | undefined;
    let token: string | undefined;

    try {
      const createResponse = await account.createUser(username, password);
      expect(createResponse.status()).toBe(201);
      const created = (await createResponse.json()) as CreatedUser;
      userId = created.userID;
      expect(created).toMatchObject({ username, books: [] });

      const generated = await account.generateToken(username, password);
      expect(generated.status).toBe('Success');
      token = generated.token;
      expect(token).toBeTruthy();

      const [book] = await bookstore.getBooks();
      expect(book, 'Catalog must contain at least one book').toBeDefined();
      const addResponse = await bookstore.addBooks(userId, token, [book!.isbn]);
      expect(addResponse.status()).toBe(201);

      const profileResponse = await account.getUser(userId, token);
      expect(profileResponse.status()).toBe(200);
      await expect(profileResponse.json()).resolves.toMatchObject({
        userId,
        username,
        books: [expect.objectContaining({ isbn: book!.isbn })],
      });
    } finally {
      if (userId && token) {
        await bookstore.deleteAllBooks(userId, token);
        const deleteResponse = await account.deleteUser(userId, token);
        expect(deleteResponse.status()).toBe(204);
      }
    }
  });
});
