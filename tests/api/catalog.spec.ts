import { expect, test } from '@playwright/test';
import { BookStoreClient } from '../../src/api/book-store.client.js';
import type { Book } from '../../src/models/book.js';

const knownBook = { isbn: '9781449325862', title: 'Git Pocket Guide' };

test.describe('Book Store API — catalog', () => {
  test('@smoke API-001 returns a non-empty catalog with valid core fields', async ({ request }) => {
    const books = await new BookStoreClient(request).getBooks();

    expect(books.length).toBeGreaterThan(0);
    for (const book of books) {
      expect(book).toMatchObject({
        isbn: expect.stringMatching(/^\d{13}$/),
        title: expect.any(String),
        author: expect.any(String),
        pages: expect.any(Number),
      });
    }
  });

  test('@smoke API-002 returns a book by ISBN', async ({ request }) => {
    const response = await new BookStoreClient(request).getBook(knownBook.isbn);
    expect(response.status()).toBe(200);
    const book = (await response.json()) as Book;
    expect(book).toMatchObject(knownBook);
  });

  test('@regression API-003 rejects an unknown ISBN with an actionable error', async ({
    request,
  }) => {
    const response = await new BookStoreClient(request).getBook('0000000000000');
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: '1205',
      message: 'ISBN supplied is not available in Books Collection!',
    });
  });
});
