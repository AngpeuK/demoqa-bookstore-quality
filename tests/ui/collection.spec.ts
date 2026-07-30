import { test, expect } from '../fixtures/ui.fixture.js';
import { ProfilePage } from '../../src/pages/profile.page.js';

const book = { isbn: '9781449325862', title: 'Git Pocket Guide' };

async function addBookThroughUi(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(`/books?search=${book.isbn}`);
  await page.addStyleTag({ content: '#fixedban, iframe { display: none !important; }' });
  page.once('dialog', (dialog) => dialog.accept());
  const addResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith('/BookStore/v1/Books') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Add To Your Collection' }).click();
  expect((await addResponse).status()).toBe(201);
}

test.describe('Book Store UI — collection management', () => {
  test('@regression UI-020 adds a book and displays it in the profile', async ({
    authenticatedPage: page,
  }) => {
    await addBookThroughUi(page);
    await page.goto('/profile');
    await expect(new ProfilePage(page).bookLink(book.title)).toBeVisible();
  });

  test('@regression UI-021 removes a book after confirmation', async ({
    authenticatedPage: page,
  }) => {
    await addBookThroughUi(page);
    await page.goto('/profile');
    await expect(new ProfilePage(page).bookLink(book.title)).toBeVisible();
    await page
      .getByRole('row', { name: new RegExp(book.title) })
      .getByTitle('Delete')
      .click();
    await expect(page.getByText('Delete Book', { exact: true })).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    const deleteResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/BookStore/v1/Book') && response.request().method() === 'DELETE',
    );
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    expect((await deleteResponse).status()).toBe(204);
    await page.reload();
    await expect(new ProfilePage(page).bookLink(book.title)).toHaveCount(0);
  });
});
