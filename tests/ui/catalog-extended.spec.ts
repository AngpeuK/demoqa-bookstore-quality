import { expect, test } from '@playwright/test';
import { BooksPage } from '../../src/pages/books.page.js';

test.describe('Book Store UI — extended catalog behavior', () => {
  test('@regression UI-005 search is case insensitive', async ({ page }) => {
    const books = new BooksPage(page);
    await books.open();
    await books.search('git pocket guide');
    await expect(books.rows).toHaveCount(1);
    await expect(books.bookLink('Git Pocket Guide')).toBeVisible();
  });

  test('@regression UI-006 search matches an author', async ({ page }) => {
    const books = new BooksPage(page);
    await books.open();
    await books.search('Addy Osmani');
    await expect(books.bookLink('Learning JavaScript Design Patterns')).toBeVisible();
  });

  test('@regression UI-007 clearing search restores the catalog', async ({ page }) => {
    const books = new BooksPage(page);
    await books.open();
    const initialCount = await books.rows.count();
    await books.search('Git Pocket Guide');
    await expect(books.rows).toHaveCount(1);
    await books.searchInput.clear();
    await expect(books.rows).toHaveCount(initialCount);
  });

  test('@regression UI-008 pagination controls reflect a single catalog page', async ({ page }) => {
    await new BooksPage(page).open();
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
    await expect(page.getByText('Page 1 of 1', { exact: true })).toBeVisible();
  });
});
