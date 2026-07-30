import { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  public async disableObstructiveAds(): Promise<void> {
    await this.page.addStyleTag({
      content: '#fixedban, iframe[id^="google_ads"], .adsbygoogle { display: none !important; }',
    });
  }
}
