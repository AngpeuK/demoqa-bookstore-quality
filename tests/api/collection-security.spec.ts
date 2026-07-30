import { expect, test } from '../fixtures/account.fixture.js';
import { BookStoreClient } from '../../src/api/book-store.client.js';
import { AccountClient } from '../../src/api/account.client.js';
import type { Book } from '../../src/models/book.js';

test.describe('Book Store API — collection integrity and security', () => {
  test.describe.configure({ mode: 'serial' });
  test('@smoke API-024 adds a valid book to the authorized profile', async ({
    request,
    account,
  }) => {
    const client = new BookStoreClient(request);
    const [book] = await client.getBooks();
    const response = await client.addBooks(account.userId, account.token, [book!.isbn]);
    expect(response.status()).toBe(201);
    await expect(response.json()).resolves.toMatchObject({ books: [{ isbn: book!.isbn }] });
  });

  test('@security API-011 denies collection mutation without a token', async ({
    request,
    account,
  }) => {
    const [book] = await new BookStoreClient(request).getBooks();
    const response = await request.post('/BookStore/v1/Books', {
      data: { userId: account.userId, collectionOfIsbns: [{ isbn: book!.isbn }] },
    });
    expect(response.status()).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ code: '1200' });
  });

  test('@security API-012 denies mutation when token and user ID do not match', async ({
    request,
    account,
  }) => {
    const [book] = await new BookStoreClient(request).getBooks();
    const response = await new BookStoreClient(request).addBooks(
      '00000000-0000-0000-0000-000000000000',
      account.token,
      [book!.isbn],
    );
    expect(response.status()).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ code: '1207' });
  });

  test('@regression API-025 rejects an ISBN absent from the catalog', async ({
    request,
    account,
  }) => {
    const response = await new BookStoreClient(request).addBooks(account.userId, account.token, [
      '0000000000000',
    ]);
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: '1205' });
  });

  test('@regression API-015 prevents duplicate books in a collection', async ({
    request,
    account,
  }) => {
    const client = new BookStoreClient(request);
    const [book] = await client.getBooks();
    expect((await client.addBooks(account.userId, account.token, [book!.isbn])).status()).toBe(201);
    const duplicate = await client.addBooks(account.userId, account.token, [book!.isbn]);
    expect(duplicate.status()).toBe(400);
    await expect(duplicate.json()).resolves.toMatchObject({ code: '1210' });
  });

  test('@regression API-026 deletes one selected book', async ({ request, account }) => {
    const client = new BookStoreClient(request);
    const [book] = await client.getBooks();
    await client.addBooks(account.userId, account.token, [book!.isbn]);
    expect((await client.deleteBook(account.userId, account.token, book!.isbn)).status()).toBe(204);
    const profile = await new AccountClient(request).getUser(account.userId, account.token);
    await expect(profile.json()).resolves.toMatchObject({ books: [] });
  });

  test('@regression API-027 replaces a selected book atomically', async ({ request, account }) => {
    const client = new BookStoreClient(request);
    const [first, second] = await client.getBooks();
    await client.addBooks(account.userId, account.token, [first!.isbn]);
    const response = await client.replaceBook(
      account.userId,
      account.token,
      first!.isbn,
      second!.isbn,
    );
    expect(response.status()).toBe(200);
    const payload = (await response.json()) as { books: Book[] };
    expect(payload.books.map((book) => book.isbn)).toEqual([second!.isbn]);
  });

  test('@regression API-016 removes all books idempotently', async ({ request, account }) => {
    const client = new BookStoreClient(request);
    const [first, second] = await client.getBooks();
    await client.addBooks(account.userId, account.token, [first!.isbn, second!.isbn]);
    expect((await client.deleteAllBooks(account.userId, account.token)).status()).toBe(204);
    expect((await client.deleteAllBooks(account.userId, account.token)).status()).toBe(204);
  });

  test('@security API-028 rejects a malformed bearer token', async ({ request, account }) => {
    const response = await new AccountClient(request).getUser(account.userId, 'not-a-jwt');
    expect(response.status()).toBe(401);
  });
});
