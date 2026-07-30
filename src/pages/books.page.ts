import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class BooksPage extends BasePage {
  public readonly searchInput: Locator;
  public readonly rows: Locator;

  public constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder('Type to search');
    this.rows = page.getByRole('row').filter({ has: page.getByRole('link') });
  }

  public async open(): Promise<void> {
    await this.page.goto('/books');
    await this.disableObstructiveAds();
    await expect(this.searchInput).toBeVisible();
    await expect(this.rows.first()).toBeVisible();
  }

  public async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  public bookLink(title: string): Locator {
    return this.page.getByRole('link', { name: title, exact: true });
  }
}
