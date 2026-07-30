import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { BooksPage } from '../../src/pages/books.page.js';
import { LoginPage } from '../../src/pages/login.page.js';
import { RegisterPage } from '../../src/pages/register.page.js';

test.describe('Accessibility — critical public pages', () => {
  test('@accessibility A11Y-001 catalog has no serious or critical violations', async ({
    page,
  }) => {
    test.fail(true, 'Known defect DEF-002: critical accessible-name and image-alt violations');
    await new BooksPage(page).open();
    const result = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
    expect(
      result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    ).toEqual([]);
  });

  test('@accessibility A11Y-002 login has no serious or critical violations', async ({ page }) => {
    test.fail(true, 'Known defect DEF-002: critical image-alt and link-name violations');
    await new LoginPage(page).open();
    const result = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
    expect(
      result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    ).toEqual([]);
  });

  test('@accessibility A11Y-003 registration has no serious or critical violations', async ({
    page,
  }) => {
    test.fail(true, 'Known defect DEF-002: critical image-alt and link-name violations');
    await new RegisterPage(page).open();
    const result = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
    expect(
      result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    ).toEqual([]);
  });
});
