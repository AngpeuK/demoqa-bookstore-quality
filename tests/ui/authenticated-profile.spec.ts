import { test, expect } from '../fixtures/ui.fixture.js';
import { ProfilePage } from '../../src/pages/profile.page.js';

test.describe('Book Store UI — authenticated profile', () => {
  test('@smoke UI-011 signs in with a valid account', async ({ authenticatedPage, account }) => {
    const profile = new ProfilePage(authenticatedPage);
    await expect(profile.username).toHaveText(account.username);
    await expect(profile.logoutButton).toBeVisible();
  });

  test('@regression UI-012 preserves the session after reload', async ({
    authenticatedPage,
    account,
  }) => {
    await authenticatedPage.reload();
    const profile = new ProfilePage(authenticatedPage);
    await expect(profile.username).toHaveText(account.username);
    await expect(profile.logoutButton).toBeVisible();
  });

  test('@smoke UI-014 logs out and returns to login', async ({ authenticatedPage }) => {
    await new ProfilePage(authenticatedPage).logout();
    await expect(authenticatedPage.getByPlaceholder('UserName')).toBeVisible();
  });

  test('@security UI-015 blocks the profile after logout and browser back', async ({
    authenticatedPage,
  }) => {
    await new ProfilePage(authenticatedPage).logout();
    await authenticatedPage.goBack();
    await authenticatedPage.reload();
    await expect(authenticatedPage).toHaveURL(/\/profile$/);
    await expect(authenticatedPage.getByText(/Currently you are not logged/)).toBeVisible();
    await expect(authenticatedPage.locator('#userName-value')).toHaveCount(0);
  });
});
