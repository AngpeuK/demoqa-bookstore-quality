import { expect, test } from '@playwright/test';
import { BookStoreClient } from '../../src/api/book-store.client.js';
import type { Book, BooksResponse } from '../../src/models/book.js';

test.describe('Book Store API — extended catalog contract', () => {
  test('@regression API-004 rejects a lookup without ISBN', async ({ request }) => {
    test.fail(
      true,
      'Known defect DEF-001: missing ISBN leaks an internal stack trace with HTTP 500',
    );
    const response = await request.get('/BookStore/v1/Book');
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: '1205' });
  });

  test('@contract API-005 returns unique ISBNs', async ({ request }) => {
    const books = await new BookStoreClient(request).getBooks();
    expect(new Set(books.map((book) => book.isbn)).size).toBe(books.length);
  });

  test('@contract API-006 returns parseable dates and positive page counts', async ({
    request,
  }) => {
    const books = await new BookStoreClient(request).getBooks();
    for (const book of books) {
      expect(Number.isNaN(Date.parse(book.publish_date))).toBe(false);
      expect(book.pages).toBeGreaterThan(0);
    }
  });

  test('@contract API-007 returns absolute HTTP(S) website URLs', async ({ request }) => {
    const books = await new BookStoreClient(request).getBooks();
    for (const book of books) {
      expect(() => new URL(book.website)).not.toThrow();
      expect(new URL(book.website).protocol).toMatch(/^https?:$/);
    }
  });

  test('@contract API-008 list and detail contracts agree for every ISBN', async ({ request }) => {
    const client = new BookStoreClient(request);
    const books = await client.getBooks();
    for (const summary of books) {
      const response = await client.getBook(summary.isbn);
      expect(response.status()).toBe(200);
      const detail = (await response.json()) as Book;
      expect(detail).toMatchObject({
        isbn: summary.isbn,
        title: summary.title,
        author: summary.author,
      });
    }
  });

  test('@contract API-009 catalog response uses the documented top-level shape', async ({
    request,
  }) => {
    const response = await request.get('/BookStore/v1/Books');
    expect(response.headers()['content-type']).toContain('application/json');
    const body = (await response.json()) as BooksResponse;
    expect(Object.keys(body)).toEqual(['books']);
    expect(Array.isArray(body.books)).toBe(true);
  });
});
