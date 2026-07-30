import type { Page } from '@playwright/test';
import { test as accountTest } from './account.fixture.js';
import { LoginPage } from '../../src/pages/login.page.js';

interface UiFixtures {
  authenticatedPage: Page;
}

export const test = accountTest.extend<UiFixtures>({
  authenticatedPage: async ({ page, account }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.loginSuccessfully(account.username, account.password);
    await use(page);
  },
});

export { expect } from '@playwright/test';
