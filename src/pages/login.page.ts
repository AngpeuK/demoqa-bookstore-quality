import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  public readonly errorMessage: Locator;

  public constructor(page: Page) {
    super(page);
    this.errorMessage = page.locator('#name');
  }

  public async open(): Promise<void> {
    await this.page.goto('/login');
    await this.disableObstructiveAds();
    await expect(this.page.getByText('Login in Book Store')).toBeVisible();
  }

  public async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('UserName').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }
}
