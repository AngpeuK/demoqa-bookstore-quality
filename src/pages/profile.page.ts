import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ProfilePage extends BasePage {
  public readonly username: Locator;
  public readonly logoutButton: Locator;

  public constructor(page: Page) {
    super(page);
    this.username = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: 'Logout', exact: true });
  }

  public async open(): Promise<void> {
    await this.page.goto('/profile');
    await this.disableObstructiveAds();
    await expect(this.logoutButton).toBeVisible();
  }

  public async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  public bookLink(title: string): Locator {
    return this.page.getByRole('link', { name: title, exact: true });
  }
}
