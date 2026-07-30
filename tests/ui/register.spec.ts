import { expect, test } from '@playwright/test';
import { RegisterPage } from '../../src/pages/register.page.js';

test.describe('Book Store UI — registration form', () => {
  test('@regression UI-016 exposes all required registration controls', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.open();
    await expect(register.firstName).toBeVisible();
    await expect(register.lastName).toBeVisible();
    await expect(register.username).toBeVisible();
    await expect(register.password).toHaveAttribute('type', 'password');
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });

  test('@regression UI-017 returns from registration to login', async ({ page }) => {
    await new RegisterPage(page).open();
    await page.getByRole('button', { name: 'Back to Login' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByPlaceholder('UserName')).toBeVisible();
  });
});
