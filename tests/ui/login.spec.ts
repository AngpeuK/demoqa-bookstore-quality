import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';

test.describe('Book Store UI — authentication', () => {
  test('@smoke UI-010 rejects invalid credentials without exposing details', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('unknown_portfolio_user', 'WrongPassword!1');
    await expect(login.errorMessage).toHaveText('Invalid username or password!');
    await expect(page).toHaveURL(/\/login$/);
  });
});
