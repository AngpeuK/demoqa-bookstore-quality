import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class RegisterPage extends BasePage {
  public readonly firstName: Locator;
  public readonly lastName: Locator;
  public readonly username: Locator;
  public readonly password: Locator;

  public constructor(page: Page) {
    super(page);
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.username = page.getByPlaceholder('UserName');
    this.password = page.getByPlaceholder('Password');
  }

  public async open(): Promise<void> {
    await this.page.goto('/register');
    await this.disableObstructiveAds();
    await expect(this.page.getByText('Register to Book Store')).toBeVisible();
  }
}
