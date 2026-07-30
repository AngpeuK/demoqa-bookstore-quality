import { expect, test } from '@playwright/test';
import { BooksPage } from '../../src/pages/books.page.js';

test.describe('Book Store UI — catalog', () => {
  test('@smoke UI-001 displays the catalog', async ({ page }) => {
    const books = new BooksPage(page);
    await books.open();
    await expect(books.rows.first()).toBeVisible();
    await expect(books.bookLink('Git Pocket Guide')).toBeVisible();
  });

  test('@smoke UI-002 filters books by title', async ({ page }) => {
    const books = new BooksPage(page);
    await books.open();
    await books.search('Git Pocket Guide');
    await expect(books.rows).toHaveCount(1);
    await expect(books.bookLink('Git Pocket Guide')).toBeVisible();
  });

  test('@regression UI-003 opens book details from search results', async ({ page }) => {
    const books = new BooksPage(page);
    await books.open();
    await books.search('Git Pocket Guide');
    await books.bookLink('Git Pocket Guide').click();

    await expect(page).toHaveURL(/\/books\?search=9781449325862$/);
    await expect(page.locator('#ISBN-wrapper')).toContainText('9781449325862');
    await expect(page.locator('#title-wrapper')).toContainText('Git Pocket Guide');
    await expect(page.locator('#author-wrapper')).toContainText('Richard E. Silverman');
  });

  test('@regression UI-004 shows zero catalog results for a missing book', async ({ page }) => {
    const books = new BooksPage(page);
    await books.open();
    await books.search(`missing-${Date.now()}`);
    await expect(books.rows).toHaveCount(0);
    await expect(page.getByText('Page 1 of 0', { exact: true })).toBeVisible();
  });
});
